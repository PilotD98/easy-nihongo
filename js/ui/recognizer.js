/* Speech recognition wrapper (Web Speech API, ja-JP, interim results on).
   Nothing is recorded or stored here; the browser's engine does the work.
   On some platforms (Chrome, Safari) recognition is processed by the browser
   vendor's service and needs a network connection. */

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

export function recognitionSupported() { return !!SR; }

/**
 * createRecognizer({ onInterim(text), onFinal(alternatives[]), onError(code, message), onEnd() })
 * returns { start(), stop(), abort(), get active() }
 */
export function createRecognizer({ onInterim, onFinal, onError, onEnd, maxAlternatives = 5, timeoutMs = 12000 } = {}) {
  if (!SR) return null;
  let rec = null;
  let active = false;
  let timer = null;
  let finals = [];

  const messages = {
    'not-allowed': 'Microphone access was blocked. Allow the microphone for this site and try again.',
    'service-not-allowed': 'Speech recognition is not allowed in this browser context.',
    'no-speech': 'No speech was heard. Try again, a little closer to the microphone.',
    'audio-capture': 'No microphone was found.',
    'network': 'Speech recognition needs a network connection on this browser.',
    'aborted': 'Listening was cancelled.',
    'language-not-supported': 'This browser has no Japanese recognition model.'
  };

  function start() {
    if (active) return;
    rec = new SR();
    rec.lang = 'ja-JP';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = maxAlternatives;
    finals = [];
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          const alts = [];
          for (let k = 0; k < res.length; k++) if (res[k].transcript) alts.push(res[k].transcript.trim());
          finals.push(alts);
        } else interim += res[0].transcript;
      }
      if (interim) onInterim?.(interim.trim());
    };
    rec.onerror = (e) => { onError?.(e.error, messages[e.error] || `Speech recognition error: ${e.error}`); };
    rec.onend = () => {
      active = false; clearTimeout(timer);
      if (finals.length) {
        // Merge the best alternative of each final segment; expose alternatives of the whole.
        const merged = [];
        const maxK = Math.max(...finals.map((f) => f.length));
        for (let k = 0; k < maxK; k++) merged.push(finals.map((f) => f[Math.min(k, f.length - 1)]).join(''));
        onFinal?.(merged);
      }
      onEnd?.();
    };
    active = true;
    try { rec.start(); } catch (err) { active = false; onError?.('start', 'Could not start listening.'); return; }
    timer = setTimeout(() => stop(), timeoutMs);
  }
  function stop() { try { rec?.stop(); } catch { /* ignore */ } }
  function abort() { try { rec?.abort(); } catch { /* ignore */ } active = false; clearTimeout(timer); }
  return { start, stop, abort, get active() { return active; } };
}
