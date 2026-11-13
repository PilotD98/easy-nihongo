// Adds pitch-accent numbers (NHK/OJAD convention, 0 = heiban) to kana-stage words
// where the pattern is well established and the word is unambiguous.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dir = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dir, '../../..');
const PITCH = {
  'いぬ': 2, 'ねこ': 1, 'さかな': 0, 'やま': 2, 'うみ': 1, 'ほん': 1, 'かさ': 1, 'あさ': 1, 'みず': 0, 'さくら': 0,
  'くるま': 0, 'とり': 0, 'そら': 1, 'ゆき': 2, 'なつ': 2, 'ふゆ': 2, 'はる': 1, 'あき': 1, 'えき': 1, 'いえ': 2,
  'かお': 0, 'こえ': 1, 'にく': 2, 'おかね': 0, 'なまえ': 0, 'いま': 1, 'みせ': 2, 'まち': 2, 'ひと': 0, 'ほし': 0,
  'ふね': 1, 'め': 1, 'みみ': 2, 'もも': 0, 'おちゃ': 0, 'せんせい': 3, 'にほん': 2, 'わたし': 0, 'ともだち': 0,
  'がっこう': 0, 'でんわ': 0, 'きょう': 1, 'きのう': 2, 'ごはん': 1, 'みかん': 1, 'たべる': 2, 'のむ': 1, 'みる': 1,
  'いく': 0, 'かう': 0, 'よむ': 1, 'かく': 1, 'きく': 0, 'ありがとう': 2, 'おはよう': 0, 'こうこう': 0, 'だいがく': 0,
  'えいが': 1, 'おおきい': 3, 'とおい': 0, 'かぞく': 1, 'じかん': 0, 'かぜ': 0, 'あめ': 1, 'いす': 0, 'つくえ': 0,
  'うた': 2, 'した': 0, 'つき': 2, 'くち': 0, 'かわ': 2, 'にわ': 0, 'おんな': 3, 'かばん': 0, 'ぶた': 0, 'ぼうし': 0,
  'えび': 0, 'かべ': 0, 'しんぶん': 0, 'ゆび': 2, 'ことば': 3, 'ぱん': 1, 'えんぴつ': 0, 'さんぽ': 0, 'きって': 0,
  'きっぷ': 0, 'ざっし': 0, 'りょこう': 0, 'しゃしん': 0, 'きゃく': 0, 'ひゃく': 2, 'しゅくだい': 0, 'としょかん': 2,
  'ぎゅうにゅう': 0, 'じゅう': 1, 'びょういん': 0, 'おかあさん': 2, 'おとうさん': 2, 'おにいさん': 2, 'おねえさん': 2,
  'コーヒー': 3, 'テレビ': 1, 'タクシー': 1, 'ホテル': 1, 'カメラ': 1, 'レストラン': 1, 'パソコン': 0, 'バス': 1,
  'ビール': 1, 'ケーキ': 1, 'スーパー': 1, 'ニュース': 1, 'サッカー': 1, 'メール': 0, 'ゲーム': 1, 'ギター': 1,
  'パン': 1, 'ペン': 1, 'ノート': 1, 'テスト': 1, 'シャツ': 1, 'ドア': 1, 'ジュース': 1, 'ラーメン': 1, 'ワイン': 1
};
let added = 0;
for (const file of ['kana.json', 'katakana.json']) {
  const p = `${ROOT}/data/${file}`;
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const g of data.groups) for (const w of g.words) {
    if (PITCH[w.jp] !== undefined) { w.pitch = PITCH[w.jp]; added++; }
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 1), 'utf8');
}
console.log('pitch added to', added, 'words');
