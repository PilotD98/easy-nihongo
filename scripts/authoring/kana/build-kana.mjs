// One-off authoring script: builds data/kana.json for the hiragana stage.
// Stroke counts are read from data/strokes/hiragana.json (KanjiVG).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dir = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dir, '../../..');
const strokes = JSON.parse(fs.readFileSync(`${ROOT}/data/strokes/hiragana.json`, 'utf8'));

// [char, romaji, mnemonic]
const BASIC = {
  'h-a': ['あ row', [
    ['あ', 'a', 'An antenna with a cross on top and a loop below: "a" for antenna.'],
    ['い', 'i', 'Two eels swimming side by side: "ee" as in eel.'],
    ['う', 'u', 'A person bent over going "ooh", with a little hat on top.'],
    ['え', 'e', 'An exotic bird with a long swooping tail: "e" for exotic.'],
    ['お', 'o', 'A golfer about to tee off: the ball is the little tick on the right. "Oh!"']
  ]],
  'h-ka': ['か row', [
    ['か', 'ka', 'A karate kick: the hooked leg and a short chopping stroke.'],
    ['き', 'ki', 'A key: two bars across a shaft, with a small loop at the bottom.'],
    ['く', 'ku', 'A bird\'s beak opening to say "coo".'],
    ['け', 'ke', 'A keg of beer standing next to a stick.'],
    ['こ', 'ko', 'Two koi fish swimming one above the other.']
  ]],
  'h-sa': ['さ row', [
    ['さ', 'sa', 'A samurai sword with its crossguard.'],
    ['し', 'shi', 'A fishing hook: "she" caught a fish.'],
    ['す', 'su', 'A swing hanging from a bar: Sue on a swing.'],
    ['せ', 'se', 'A set of bars like a gate: "se" for set.'],
    ['そ', 'so', 'A zigzag sewing stitch: "so" and sew.']
  ]],
  'h-ta': ['た row', [
    ['た', 'ta', 'It looks like "ta" written in Latin letters: a t and an a.'],
    ['ち', 'chi', 'A cheerleader with a round skirt: "chi".'],
    ['つ', 'tsu', 'A tsunami wave curling over.'],
    ['て', 'te', 'A telephone cord hanging from a hook.'],
    ['と', 'to', 'A toe with a splinter stuck in it.']
  ]],
  'h-na': ['な row', [
    ['な', 'na', 'A nun kneeling, with a cross beside her: "na".'],
    ['に', 'ni', 'A needle beside two short threads: "nee".'],
    ['ぬ', 'nu', 'Noodles twirled around chopsticks, with a loop at the end.'],
    ['ね', 'ne', 'A cat (neko) sitting with its tail curled underneath.'],
    ['の', 'no', 'A "no entry" sign: a circle with a stroke through it.']
  ]],
  'h-ha': ['は row', [
    ['は', 'ha', 'A stick next to a letter "t" with a loop: someone laughing "ha!"'],
    ['ひ', 'hi', 'A big smile: "hee hee".'],
    ['ふ', 'fu', 'Mount Fuji with wisps of cloud around it.'],
    ['へ', 'he', 'A heap: a small hill with a peak.'],
    ['ほ', 'ho', 'A house with a stick fence: "ho-me".']
  ]],
  'h-ma': ['ま row', [
    ['ま', 'ma', 'A mast with two crossbars and a loop: "ma".'],
    ['み', 'mi', 'A rope tied in a loop around me: "mee".'],
    ['む', 'mu', 'A cow going "moo", with a curled tail.'],
    ['め', 'me', 'An eye (me) with a long lash across it.'],
    ['も', 'mo', 'A hook with more bars across it: "mo" for more.']
  ]],
  'h-ya': ['や row', [
    ['や', 'ya', 'A yak\'s head with a horn sticking up: "ya".'],
    ['ゆ', 'yu', 'A fish making a U-turn: "you".'],
    ['よ', 'yo', 'A yo-yo hanging from its string.']
  ]],
  'h-ra': ['ら row', [
    ['ら', 'ra', 'A rabbit\'s ear and curled body: "ra".'],
    ['り', 'ri', 'Two reeds standing in water: "ree".'],
    ['る', 'ru', 'A loop at the end of the road: "ru".'],
    ['れ', 're', 'A runner\'s leg kicking back: "re".'],
    ['ろ', 'ro', 'A road with a sharp bend: "ro". Like る without the loop.']
  ]],
  'h-wa': ['わ・を・ん', [
    ['わ', 'wa', 'A person waving with a rounded arm: "wa". Like れ with a closed curve.'],
    ['を', 'o (wo)', 'wo', 'A toe stepping into water: "wo-ah!" Used only as the object particle, pronounced "o".'],
    ['ん', 'n', 'An "n" that slid off its chair. The only kana with no vowel.']
  ]]
};

const DAKUTEN = {
  'h-ga': ['が row (dakuten)', 'Two small dots (dakuten ゛) at the top right turn k into g.', [['が', 'ga'], ['ぎ', 'gi'], ['ぐ', 'gu'], ['げ', 'ge'], ['ご', 'go']]],
  'h-za': ['ざ row (dakuten)', 'The dakuten turns s into z. Note じ is "ji", not "zi".', [['ざ', 'za'], ['じ', 'ji'], ['ず', 'zu'], ['ぜ', 'ze'], ['ぞ', 'zo']]],
  'h-da': ['だ row (dakuten)', 'The dakuten turns t into d. ぢ and づ are rare and sound like じ and ず.', [['だ', 'da'], ['ぢ', 'ji (di)', 'di'], ['づ', 'zu (du)', 'du'], ['で', 'de'], ['ど', 'do']]],
  'h-ba': ['ば row (dakuten)', 'The dakuten turns h into b.', [['ば', 'ba'], ['び', 'bi'], ['ぶ', 'bu'], ['べ', 'be'], ['ぼ', 'bo']]],
  'h-pa': ['ぱ row (handakuten)', 'A small circle (handakuten ゜) turns h into p.', [['ぱ', 'pa'], ['ぴ', 'pi'], ['ぷ', 'pu'], ['ぺ', 'pe'], ['ぽ', 'po']]]
};

const COMBO1 = [['き', 'ky'], ['し', 'sh'], ['ち', 'ch'], ['に', 'ny'], ['ひ', 'hy'], ['み', 'my'], ['り', 'ry']];
const COMBO2 = [['ぎ', 'gy'], ['じ', 'j'], ['び', 'by'], ['ぴ', 'py']];
const SMALL = { 'ゃ': ['ya', 'a'], 'ゅ': ['yu', 'u'], 'ょ': ['yo', 'o'] };

// Words: [jp, romaji, meaning]
const WORDS = {
  'h-a': [['あい', 'ai', 'love'], ['いえ', 'ie', 'house'], ['うえ', 'ue', 'above; on top'], ['あお', 'ao', 'blue'], ['いう', 'iu', 'to say'], ['え', 'e', 'picture']],
  'h-ka': [['あか', 'aka', 'red'], ['あき', 'aki', 'autumn'], ['かお', 'kao', 'face'], ['いけ', 'ike', 'pond'], ['こえ', 'koe', 'voice'], ['えき', 'eki', 'station'], ['かく', 'kaku', 'to write'], ['きく', 'kiku', 'to listen; to ask'], ['かう', 'kau', 'to buy'], ['いく', 'iku', 'to go']],
  'h-sa': [['すし', 'sushi', 'sushi'], ['あさ', 'asa', 'morning'], ['いす', 'isu', 'chair'], ['せき', 'seki', 'seat'], ['あし', 'ashi', 'foot; leg'], ['かさ', 'kasa', 'umbrella'], ['うそ', 'uso', 'lie'], ['おす', 'osu', 'to push'], ['すき', 'suki', 'liked; favourite'], ['さけ', 'sake', 'sake (rice wine)']],
  'h-ta': [['たこ', 'tako', 'octopus'], ['つくえ', 'tsukue', 'desk'], ['て', 'te', 'hand'], ['とけい', 'tokei', 'clock; watch'], ['うた', 'uta', 'song'], ['した', 'shita', 'below; under'], ['たつ', 'tatsu', 'to stand'], ['つき', 'tsuki', 'moon; month'], ['いち', 'ichi', 'one'], ['くち', 'kuchi', 'mouth'], ['ちかてつ', 'chikatetsu', 'subway']],
  'h-na': [['なつ', 'natsu', 'summer'], ['いぬ', 'inu', 'dog'], ['ねこ', 'neko', 'cat'], ['にく', 'niku', 'meat'], ['おかね', 'okane', 'money'], ['なに', 'nani', 'what'], ['さかな', 'sakana', 'fish'], ['きのう', 'kinou', 'yesterday'], ['あなた', 'anata', 'you'], ['いなか', 'inaka', 'countryside']],
  'h-ha': [['はな', 'hana', 'flower; nose'], ['ひと', 'hito', 'person'], ['ふね', 'fune', 'boat; ship'], ['ほし', 'hoshi', 'star'], ['はし', 'hashi', 'chopsticks; bridge'], ['はは', 'haha', '(my) mother'], ['へた', 'heta', 'unskilled; bad at'], ['ひこうき', 'hikouki', 'airplane'], ['ふとい', 'futoi', 'thick; fat'], ['はこ', 'hako', 'box']],
  'h-ma': [['まち', 'machi', 'town'], ['みみ', 'mimi', 'ear'], ['むし', 'mushi', 'insect'], ['め', 'me', 'eye'], ['もも', 'momo', 'peach'], ['あめ', 'ame', 'rain; candy'], ['うみ', 'umi', 'sea'], ['なまえ', 'namae', 'name'], ['いま', 'ima', 'now'], ['みせ', 'mise', 'shop'], ['のむ', 'nomu', 'to drink']],
  'h-ya': [['やま', 'yama', 'mountain'], ['ゆき', 'yuki', 'snow'], ['よむ', 'yomu', 'to read'], ['ふゆ', 'fuyu', 'winter'], ['へや', 'heya', 'room'], ['やさい', 'yasai', 'vegetable'], ['つよい', 'tsuyoi', 'strong'], ['おゆ', 'oyu', 'hot water'], ['やすみ', 'yasumi', 'holiday; rest'], ['よこ', 'yoko', 'side; beside']],
  'h-ra': [['さくら', 'sakura', 'cherry blossom'], ['とり', 'tori', 'bird'], ['くるま', 'kuruma', 'car'], ['そら', 'sora', 'sky'], ['これ', 'kore', 'this'], ['きれい', 'kirei', 'pretty; clean'], ['ひる', 'hiru', 'noon; daytime'], ['よる', 'yoru', 'night'], ['はる', 'haru', 'spring'], ['みる', 'miru', 'to see; to watch'], ['かえる', 'kaeru', 'to return home; frog'], ['あらう', 'arau', 'to wash']],
  'h-wa': [['わたし', 'watashi', 'I; me'], ['かわ', 'kawa', 'river'], ['にわ', 'niwa', 'garden'], ['ほん', 'hon', 'book'], ['せんせい', 'sensei', 'teacher'], ['にほん', 'nihon', 'Japan'], ['おんな', 'onna', 'woman'], ['みかん', 'mikan', 'mandarin orange'], ['えん', 'en', 'yen'], ['わらう', 'warau', 'to laugh'], ['しんかんせん', 'shinkansen', 'bullet train'], ['ほんをよむ', 'hon o yomu', 'to read a book (を marks the object)']],
  'h-ga': [['かがみ', 'kagami', 'mirror'], ['ぎんこう', 'ginkou', 'bank'], ['かぎ', 'kagi', 'key'], ['ごはん', 'gohan', 'cooked rice; meal'], ['ひらがな', 'hiragana', 'hiragana'], ['まんが', 'manga', 'comics'], ['がくせい', 'gakusei', 'student'], ['うさぎ', 'usagi', 'rabbit'], ['えいご', 'eigo', 'English (language)'], ['ごご', 'gogo', 'afternoon; p.m.'], ['かぐ', 'kagu', 'furniture'], ['げんき', 'genki', 'healthy; energetic']],
  'h-za': [['かぜ', 'kaze', 'wind; a cold'], ['みず', 'mizu', 'water'], ['かぞく', 'kazoku', 'family'], ['かじ', 'kaji', 'fire (disaster)'], ['ぞう', 'zou', 'elephant'], ['ごぜん', 'gozen', 'morning; a.m.'], ['かんじ', 'kanji', 'kanji'], ['じかん', 'jikan', 'time; hour'], ['ひざ', 'hiza', 'knee'], ['すずしい', 'suzushii', 'cool (weather)'], ['ざんねん', 'zannen', 'regrettable; too bad']],
  'h-da': [['だいがく', 'daigaku', 'university'], ['でんわ', 'denwa', 'telephone'], ['どこ', 'doko', 'where'], ['ともだち', 'tomodachi', 'friend'], ['でんき', 'denki', 'electricity; light'], ['まど', 'mado', 'window'], ['だれ', 'dare', 'who'], ['でぐち', 'deguchi', 'exit'], ['からだ', 'karada', 'body'], ['はなぢ', 'hanaji', 'nosebleed'], ['つづく', 'tsuzuku', 'to continue']],
  'h-ba': [['かばん', 'kaban', 'bag'], ['ぶた', 'buta', 'pig'], ['ぼうし', 'boushi', 'hat'], ['たべる', 'taberu', 'to eat'], ['えび', 'ebi', 'shrimp'], ['かべ', 'kabe', 'wall'], ['しんぶん', 'shinbun', 'newspaper'], ['ゆび', 'yubi', 'finger'], ['ことば', 'kotoba', 'word; language'], ['あぶない', 'abunai', 'dangerous'], ['あそぶ', 'asobu', 'to play'], ['どうぶつ', 'doubutsu', 'animal'], ['ばんごはん', 'bangohan', 'dinner']],
  'h-pa': [['ぱん', 'pan', 'bread'], ['えんぴつ', 'enpitsu', 'pencil'], ['さんぽ', 'sanpo', 'a walk'], ['てんぷら', 'tenpura', 'tempura'], ['かんぱい', 'kanpai', 'cheers!'], ['せんぱい', 'senpai', 'senior (at school or work)'], ['ぺらぺら', 'perapera', 'fluent'], ['しんぱい', 'shinpai', 'worry'], ['ぽかぽか', 'pokapoka', 'pleasantly warm'], ['ぴかぴか', 'pikapika', 'sparkling']],
  'h-combo1': [['きゃく', 'kyaku', 'guest; customer'], ['しゃしん', 'shashin', 'photograph'], ['おちゃ', 'ocha', 'tea'], ['ひゃく', 'hyaku', 'hundred'], ['りょこう', 'ryokou', 'travel'], ['きょう', 'kyou', 'today'], ['しゅくだい', 'shukudai', 'homework'], ['としょかん', 'toshokan', 'library'], ['ちゅうい', 'chuui', 'attention; caution'], ['りょうり', 'ryouri', 'cooking; cuisine'], ['しゅみ', 'shumi', 'hobby'], ['きょねん', 'kyonen', 'last year'], ['しょくじ', 'shokuji', 'meal'], ['みょうじ', 'myouji', 'surname'], ['きょうしつ', 'kyoushitsu', 'classroom'], ['りゅう', 'ryuu', 'dragon'], ['にゅうがく', 'nyuugaku', 'school entrance']],
  'h-combo2': [['ぎゅうにゅう', 'gyuunyuu', 'milk'], ['じゅう', 'juu', 'ten'], ['じゃあ', 'jaa', 'well then'], ['びょういん', 'byouin', 'hospital'], ['さんびゃく', 'sanbyaku', 'three hundred'], ['ぎょうざ', 'gyouza', 'gyoza dumplings'], ['じゅぎょう', 'jugyou', 'class; lesson'], ['にんぎょう', 'ningyou', 'doll'], ['じょうず', 'jouzu', 'skilled; good at'], ['じしょ', 'jisho', 'dictionary'], ['かのじょ', 'kanojo', 'she; girlfriend'], ['ぴょんぴょん', 'pyonpyon', 'hopping']],
  'h-sokuon': [['がっこう', 'gakkou', 'school'], ['きって', 'kitte', 'postage stamp'], ['ざっし', 'zasshi', 'magazine'], ['きっぷ', 'kippu', 'ticket'], ['ちょっと', 'chotto', 'a little'], ['いっぱい', 'ippai', 'full; a lot'], ['まっすぐ', 'massugu', 'straight ahead'], ['にっき', 'nikki', 'diary'], ['はっぴゃく', 'happyaku', 'eight hundred'], ['ゆっくり', 'yukkuri', 'slowly'], ['きっさてん', 'kissaten', 'café'], ['せっけん', 'sekken', 'soap'], ['けっこん', 'kekkon', 'marriage']],
  'h-long': [['おかあさん', 'okaasan', 'mother'], ['おにいさん', 'oniisan', 'older brother'], ['おねえさん', 'oneesan', 'older sister'], ['おとうさん', 'otousan', 'father'], ['くうき', 'kuuki', 'air'], ['とおい', 'tooi', 'far'], ['おおきい', 'ookii', 'big'], ['こうこう', 'koukou', 'high school'], ['ゆうびんきょく', 'yuubinkyoku', 'post office'], ['えいが', 'eiga', 'movie'], ['とうきょう', 'toukyou', 'Tokyo'], ['ゆうめい', 'yuumei', 'famous'], ['おはよう', 'ohayou', 'good morning'], ['ありがとう', 'arigatou', 'thank you'], ['さようなら', 'sayounara', 'goodbye'], ['いいえ', 'iie', 'no']]
};

const NOTES = {
  'h-a': 'Every hiragana is one beat (mora). Vowels are short and pure: a as in "father", i as in "machine", u as in "flute" (lips relaxed), e as in "bed", o as in "more".',
  'h-sa': 'し is "shi", not "si". Romaji in this app follows Hepburn, which spells sounds the way English speakers expect.',
  'h-ta': 'ち is "chi" and つ is "tsu". The つ sound is like the "ts" at the end of "cats".',
  'h-ha': 'ふ is "fu": blow the sound out gently between the lips, not with the teeth. Note: は is read "wa" when it is the topic particle (わたしは).',
  'h-ra': 'The Japanese r is a light tap of the tongue, between English r, l and d. It is never rolled.',
  'h-wa': 'を is used only as the object particle and is pronounced "o". ん is its own beat: ほん is two beats, ho-n. へ is read "e" when it marks a direction.',
  'h-ga': 'Dakuten (゛) voice the consonant: k → g, s → z, t → d, h → b. Voiced sounds use the voice box; put a finger on your throat and feel it buzz.',
  'h-pa': 'The handakuten (゜) is a small circle. It appears only on the は row and makes p sounds.',
  'h-combo1': 'A full-size kana followed by a small ゃ, ゅ or ょ blends into a single beat: きゃ is one beat, きや is two. Compare びょういん (hospital) with びよういん (hair salon).',
  'h-sokuon': 'Small っ is a silent beat: hold the pause before the next consonant. がっこう is four beats: ga-(pause)-ko-o. Writing it full size (つ) changes the word.',
  'h-long': 'Long vowels are held for two beats. They are written by adding あ, い, う, え or お: おばさん (aunt) and おばあさん (grandmother) differ only in length. "ou" is pronounced as a long o, and "ei" as a long e.'
};

const slug = (romaji) => romaji.toLowerCase().replace(/\s*\(.*\)/, '').replace(/[^a-z]+/g, '');
const groups = [];
const known = new Set();

function push(id, title, kind, chars, words, intro) {
  groups.push({
    id, title, kind, intro: intro || undefined,
    chars: chars.map((c) => ({ ...c, strokes: c.strokes ?? (strokes[c.char] ? strokes[c.char].strokes.length : undefined) })),
    words: (words || []).map(([jp, romaji, meaning]) => ({ id: `vocab:kana:${slug(romaji)}-${jp}`, jp, romaji, meaning })),
    note: NOTES[id]
  });
}

for (const [id, [title, chars]] of Object.entries(BASIC)) {
  push(id, title, 'basic', chars.map((c) => c.length === 4 ? { id: `kana:h:${c[2]}`, char: c[0], romaji: c[1], mnemonic: c[3] } : { id: `kana:h:${slug(c[1])}`, char: c[0], romaji: c[1], mnemonic: c[2] }), WORDS[id]);
}
for (const [id, [title, intro, chars]] of Object.entries(DAKUTEN)) {
  push(id, title, id === 'h-pa' ? 'handakuten' : 'dakuten', chars.map(([char, romaji, idSlug]) => {
    const base = String.fromCodePoint(char.codePointAt(0) - (id === 'h-pa' ? 2 : 1));
    const mark = id === 'h-pa' ? 'a small circle (handakuten)' : 'two dots (dakuten)';
    return { id: `kana:h:${idSlug || slug(romaji)}`, char, romaji, base, mnemonic: `${base} with ${mark} becomes ${romaji.replace(/\s*\(.*\)/, '')}. Same shape, voiced sound.` };
  }), WORDS[id], intro);
}
function comboChars(list) {
  const out = [];
  for (const [base, cons] of list) {
    const baseRomaji = Object.values(BASIC).concat(Object.values(DAKUTEN).map(([t, i, c]) => [t, c])).flatMap(([t, c]) => c).find((c) => c[0] === base)[1];
    for (const [small, [sy, vowel]] of Object.entries(SMALL)) {
      const romaji = cons + vowel;
      out.push({ id: `kana:h:${romaji}`, char: base + small, romaji, parts: [base, small], mnemonic: `${base} (${baseRomaji.replace(/\s*\(.*\)/, '')}) + small ${small} = ${romaji}, said as one beat.`, strokes: strokes[base].strokes.length + strokes[small].strokes.length });
    }
  }
  return out;
}
push('h-combo1', 'Combinations (きゃ, しゅ, ちょ…)', 'combo', comboChars(COMBO1), WORDS['h-combo1'], 'Combine an i-row kana with a small ゃ, ゅ or ょ. The two symbols make one beat.');
push('h-combo2', 'Voiced combinations (ぎゃ, じゅ, びょ…)', 'combo', comboChars(COMBO2), WORDS['h-combo2'], 'The same pattern with dakuten and handakuten kana. じゃ, じゅ, じょ are "ja, ju, jo".');
push('h-sokuon', 'Small っ (double consonants)', 'special', [
  { id: 'kana:h:xtsu', char: 'っ', romaji: '(pause)', mnemonic: 'A small つ. It is not pronounced; it doubles the next consonant by holding a one-beat pause.', strokes: strokes['っ'].strokes.length }
], WORDS['h-sokuon'], 'Small っ marks a doubled consonant: the sound stops for one beat.');
push('h-long', 'Long vowels', 'special', [
  { id: 'kana:h:long-a', char: 'ああ', romaji: 'aa', mnemonic: 'Add あ to hold an a-sound for two beats: おかあさん.', parts: ['あ', 'あ'], strokes: strokes['あ'].strokes.length * 2 },
  { id: 'kana:h:long-i', char: 'いい', romaji: 'ii', mnemonic: 'Add い to hold an i-sound: おにいさん, おおきい.', parts: ['い', 'い'], strokes: strokes['い'].strokes.length * 2 },
  { id: 'kana:h:long-u', char: 'うう', romaji: 'uu', mnemonic: 'Add う to hold a u-sound: くうき, ゆうめい.', parts: ['う', 'う'], strokes: strokes['う'].strokes.length * 2 },
  { id: 'kana:h:long-e', char: 'えい', romaji: 'ei (ee)', mnemonic: 'A long e is usually written with い: せんせい, えいが. Hold the e; the i is barely heard.', parts: ['え', 'い'], strokes: strokes['え'].strokes.length + strokes['い'].strokes.length },
  { id: 'kana:h:long-o', char: 'おう', romaji: 'ou (oo)', mnemonic: 'A long o is usually written with う: おとうさん, とうきょう. A few words use お: おおきい, とおい.', parts: ['お', 'う'], strokes: strokes['お'].strokes.length + strokes['う'].strokes.length }
], WORDS['h-long'], 'Vowel length changes meaning. Train your ear to hear one beat versus two.');

// Sanity: every word uses only known units (validator repeats this check).
for (const g of groups) {
  for (const c of g.chars) known.add(c.char);
  const units = [...known].sort((a, b) => b.length - a.length);
  for (const w of g.words) {
    let rest = w.jp;
    while (rest.length) {
      const u = units.find((x) => rest.startsWith(x));
      if (!u) throw new Error(`${g.id} word ${w.jp} uses untaught "${rest[0]}"`);
      rest = rest.slice(u.length);
    }
  }
  for (const c of g.chars) if (c.strokes == null) throw new Error(`no stroke count for ${c.char}`);
}

const out = {
  script: 'hiragana',
  title: 'Hiragana',
  exam: { questions: 50, passPercent: 90, unlocks: 'katakana' },
  quiz: { questions: 12, passPercent: 80 },
  groups
};
fs.writeFileSync(`${ROOT}/data/kana.json`, JSON.stringify(out, null, 1), 'utf8');
const nChars = groups.reduce((n, g) => n + g.chars.length, 0), nWords = groups.reduce((n, g) => n + g.words.length, 0);
console.log(`kana.json: ${groups.length} groups, ${nChars} characters, ${nWords} words`);
