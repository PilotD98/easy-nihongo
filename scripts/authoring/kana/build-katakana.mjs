// One-off authoring script: builds data/katakana.json for the katakana stage.
// Stroke counts are read from data/strokes/katakana.json (KanjiVG).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dir = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dir, '../../..');
const strokes = JSON.parse(fs.readFileSync(`${ROOT}/data/strokes/katakana.json`, 'utf8'));

// [char, romaji, mnemonic, idSlug?]
const BASIC = {
  'k-a': ['ア row', [
    ['ア', 'a', 'A sharp antenna bent by the wind: "a". Katakana are angular where hiragana are curvy.'],
    ['イ', 'i', 'A person leaning on a stick: "ee". Two straight strokes.'],
    ['ウ', 'u', 'A roof with a chimney: "u". It is ワ with a hat; hiragana う has the same top.'],
    ['エ', 'e', 'An elevator door frame, a capital I on its side: "e" for エレベーター.'],
    ['オ', 'o', 'A figure carrying a pole over the shoulder: "oh!"'],
    ['ー', 'long vowel (ー)', 'A dash that stretches the vowel before it for one extra beat: コーヒー is ko-o-hi-i. Vertical text turns it vertical.', 'choon']
  ]],
  'k-ka': ['カ row', [
    ['カ', 'ka', 'Hiragana か without its dash: the same karate kick.'],
    ['キ', 'ki', 'A key with two teeth: き without the bottom loop.'],
    ['ク', 'ku', 'A cuckoo\'s open beak: "ku". Watch out for タ (ク with a dot inside).'],
    ['ケ', 'ke', 'A capital K leaning back: "ke".'],
    ['コ', 'ko', 'The corner of a box: "ko" for corner.']
  ]],
  'k-sa': ['サ row', [
    ['サ', 'sa', 'The top of さ, straightened: a samurai\'s crossguard with the sword below.'],
    ['シ', 'shi', 'Three drops sliding in from the left, with a smile swept upward: "she" smiles. Compare ツ, whose drops fall from above.'],
    ['ス', 'su', 'A skier gliding downhill: "su" for スキー.'],
    ['セ', 'se', 'Hiragana せ with straight lines: a set of bars.'],
    ['ソ', 'so', 'Two drops falling from above: "so". Compare ン, which has one drop and a flatter sweep.']
  ]],
  'k-ta': ['タ row', [
    ['タ', 'ta', 'ク with a dot inside: a taco shell with filling.'],
    ['チ', 'chi', 'A capital T with a flag on top: a cheerleader waving.'],
    ['ツ', 'tsu', 'A tsunami: two drops falling from above and a wave sweeping up. Compare シ, whose drops come from the side.'],
    ['テ', 'te', 'A telephone pole with two crossbars.'],
    ['ト', 'to', 'A boot seen from the side with a toe sticking out: "to".']
  ]],
  'k-na': ['ナ row', [
    ['ナ', 'na', 'A knife blade with a crossguard: "na" for ナイフ.'],
    ['ニ', 'ni', 'Two lines: ni is "two" (二) in Japanese.'],
    ['ヌ', 'nu', 'Noodles draped over chopsticks: "nu".'],
    ['ネ', 'ne', 'A cat (neko) sitting on a stake, tail hanging down.'],
    ['ノ', 'no', 'A single stroke: a nose in profile, "no".']
  ]],
  'k-ha': ['ハ row', [
    ['ハ', 'ha', 'Two sides of a wide-open laughing mouth: "ha ha".'],
    ['ヒ', 'hi', 'A heel seen from the side: "hee".'],
    ['フ', 'fu', 'A hood pulled over the top of Mount Fuji: "fu". Compare ワ (closed on the left) and ウ (with a hat).'],
    ['ヘ', 'he', 'Identical to hiragana へ: a small heap.'],
    ['ホ', 'ho', 'A holy cross with two drops: "ho".']
  ]],
  'k-ma': ['マ row', [
    ['マ', 'ma', 'A 7 with a tail: a magnet pulling to the right, "ma".'],
    ['ミ', 'mi', 'Three lines: mi is "three" (三) in Japanese.'],
    ['ム', 'mu', 'A cow\'s muzzle with a tuft: "moo".'],
    ['メ', 'me', 'A needle crossing a thread: "me" marks the spot. Compare ナ (straight bar).'],
    ['モ', 'mo', 'Hiragana も without its bottom hook: more bars.']
  ]],
  'k-ya': ['ヤ row', [
    ['ヤ', 'ya', 'Hiragana や without the loop: a yak\'s horn.'],
    ['ユ', 'yu', 'A U-turn sign laid flat: "yu".'],
    ['ヨ', 'yo', 'A mirrored capital E: three shelves for your yoghurt.']
  ]],
  'k-ra': ['ラ row', [
    ['ラ', 'ra', 'A ramen bowl with its lid lifted: "ra".'],
    ['リ', 'ri', 'Hiragana り with the strokes separated: two reeds.'],
    ['ル', 'ru', 'A root splitting in two: "ru". Compare レ (one stroke).'],
    ['レ', 're', 'A lever, or a leg kicking: "re".'],
    ['ロ', 'ro', 'A square mouth, a robot\'s mouth: "ro".']
  ]],
  'k-wa': ['ワ・ヲ・ン', [
    ['ワ', 'wa', 'A wide box with a lid: "wa". ウ is ワ with a hat; フ is ワ without the left side.'],
    ['ヲ', 'o (wo)', 'ラ with an extra bar. Rare: it appears only in old texts and stylised writing. Pronounced "o".', 'wo'],
    ['ン', 'n', 'One drop from above and a long upward sweep: "n". Compare ソ (two drops, steeper sweep).']
  ]]
};

const DAKUTEN = {
  'k-ga': ['ガ row (dakuten)', 'Two small dots (゛) at the top right turn k into g, exactly as in hiragana.', [['ガ', 'ga'], ['ギ', 'gi'], ['グ', 'gu'], ['ゲ', 'ge'], ['ゴ', 'go']]],
  'k-za': ['ザ row (dakuten)', 'The dakuten turns s into z. ジ is "ji".', [['ザ', 'za'], ['ジ', 'ji'], ['ズ', 'zu'], ['ゼ', 'ze'], ['ゾ', 'zo']]],
  'k-da': ['ダ row (dakuten)', 'The dakuten turns t into d. ヂ and ヅ are very rare.', [['ダ', 'da'], ['ヂ', 'ji (di)', 'di'], ['ヅ', 'zu (du)', 'du'], ['デ', 'de'], ['ド', 'do']]],
  'k-ba': ['バ row (dakuten)', 'The dakuten turns h into b.', [['バ', 'ba'], ['ビ', 'bi'], ['ブ', 'bu'], ['ベ', 'be'], ['ボ', 'bo']]],
  'k-pa': ['パ row (handakuten)', 'The small circle (゜) turns h into p.', [['パ', 'pa'], ['ピ', 'pi'], ['プ', 'pu'], ['ペ', 'pe'], ['ポ', 'po']]]
};

const COMBO1 = [['キ', 'ky'], ['シ', 'sh'], ['チ', 'ch'], ['ニ', 'ny'], ['ヒ', 'hy'], ['ミ', 'my'], ['リ', 'ry']];
const COMBO2 = [['ギ', 'gy'], ['ジ', 'j'], ['ビ', 'by'], ['ピ', 'py']];
const SMALL = { 'ャ': ['ya', 'a'], 'ュ': ['yu', 'u'], 'ョ': ['yo', 'o'] };

// Extended combinations for loanwords: [char, romaji, parts, mnemonic]
const EXTENDED = [
  ['ファ', 'fa', ['フ', 'ァ'], 'フ + small ァ: fa, as in ファン (fan).'],
  ['フィ', 'fi', ['フ', 'ィ'], 'フ + small ィ: fi, as in フィルム (film).'],
  ['フェ', 'fe', ['フ', 'ェ'], 'フ + small ェ: fe, as in カフェ (café).'],
  ['フォ', 'fo', ['フ', 'ォ'], 'フ + small ォ: fo, as in フォーク (fork).'],
  ['ティ', 'ti', ['テ', 'ィ'], 'テ + small ィ: a true "ti" sound, as in ティー (tea). Compare チ (chi).'],
  ['ディ', 'di', ['デ', 'ィ'], 'デ + small ィ: "di", as in ディナー (dinner).'],
  ['ウィ', 'wi', ['ウ', 'ィ'], 'ウ + small ィ: "wi", as in ウィンドウ (window).'],
  ['ウェ', 'we', ['ウ', 'ェ'], 'ウ + small ェ: "we", as in ウェブ (web).'],
  ['ウォ', 'wo', ['ウ', 'ォ'], 'ウ + small ォ: "wo", as in ウォーター (water).'],
  ['シェ', 'she', ['シ', 'ェ'], 'シ + small ェ: "she", as in シェフ (chef).'],
  ['ジェ', 'je', ['ジ', 'ェ'], 'ジ + small ェ: "je", as in ジェット (jet).'],
  ['チェ', 'che', ['チ', 'ェ'], 'チ + small ェ: "che", as in チェック (check).'],
  ['ヴァ', 'va', ['ヴ', 'ァ'], 'ヴ (ウ with dakuten) + small ァ: "va". Many people say and write バ instead.'],
  ['デュ', 'dyu', ['デ', 'ュ'], 'デ + small ュ: "dyu", as in プロデューサー (producer).'],
  ['トゥ', 'tu', ['ト', 'ゥ'], 'ト + small ゥ: a true "tu", as in タトゥー (tattoo).']
];

// Words: [jp, romaji, meaning]
const WORDS = {
  'k-a': [['エア', 'ea', 'air (as in air conditioner)'], ['アイ', 'ai', 'eye (as in eye contact)'], ['エー', 'ee', 'the letter A'], ['オー', 'oo', 'the letter O; "oh"']],
  'k-ka': [['カー', 'kaa', 'car'], ['ケーキ', 'keeki', 'cake'], ['キー', 'kii', 'key'], ['コア', 'koa', 'core'], ['エコ', 'eko', 'eco (ecological)'], ['ココア', 'kokoa', 'cocoa'], ['カカオ', 'kakao', 'cacao'], ['オーケー', 'ookee', 'OK'], ['イカ', 'ika', 'squid']],
  'k-sa': [['スキー', 'sukii', 'ski'], ['アイス', 'aisu', 'ice cream'], ['ソース', 'soosu', 'sauce'], ['ケース', 'keesu', 'case'], ['コース', 'koosu', 'course'], ['エース', 'eesu', 'ace'], ['サーカス', 'saakasu', 'circus'], ['キス', 'kisu', 'kiss'], ['シーソー', 'shiisoo', 'seesaw'], ['オアシス', 'oashisu', 'oasis']],
  'k-ta': [['テスト', 'tesuto', 'test'], ['タクシー', 'takushii', 'taxi'], ['トースト', 'toosuto', 'toast'], ['ツアー', 'tsuaa', 'tour'], ['テキスト', 'tekisuto', 'textbook'], ['スーツ', 'suutsu', 'suit'], ['ステーキ', 'suteeki', 'steak'], ['アウト', 'auto', 'out'], ['タコス', 'takosu', 'tacos'], ['カート', 'kaato', 'cart'], ['スカート', 'sukaato', 'skirt'], ['チーズ', 'chiizu', 'cheese (uses ズ, taught later; note the dakuten)', null]],
  'k-na': [['テニス', 'tenisu', 'tennis'], ['ノート', 'nooto', 'notebook'], ['ネクタイ', 'nekutai', 'necktie'], ['カヌー', 'kanuu', 'canoe'], ['ソナタ', 'sonata', 'sonata'], ['オーナー', 'oonaa', 'owner'], ['ナース', 'naasu', 'nurse'], ['コーナー', 'koonaa', 'corner'], ['ノー', 'noo', 'no'], ['ナッツ', 'nattsu', 'nuts (uses small ッ, taught later)', null]],
  'k-ha': [['コーヒー', 'koohii', 'coffee'], ['ナイフ', 'naifu', 'knife'], ['ハート', 'haato', 'heart'], ['ホース', 'hoosu', 'hose'], ['ヒーター', 'hiitaa', 'heater'], ['スカーフ', 'sukaafu', 'scarf'], ['ハーフ', 'haafu', 'half'], ['ヘア', 'hea', 'hair (style)'], ['ハイキング', 'haikingu', 'hiking (uses ン and グ, taught later)', null], ['ホテル', 'hoteru', 'hotel (uses ル, taught later)', null]],
  'k-ma': [['メモ', 'memo', 'memo'], ['ミス', 'misu', 'mistake'], ['マスク', 'masuku', 'mask'], ['メーカー', 'meekaa', 'maker; manufacturer'], ['ホーム', 'hoomu', 'home; train platform'], ['ハム', 'hamu', 'ham'], ['タイム', 'taimu', 'time'], ['ミニ', 'mini', 'mini'], ['モーター', 'mootaa', 'motor'], ['マナー', 'manaa', 'manners'], ['テーマ', 'teema', 'theme'], ['ムース', 'muusu', 'mousse']],
  'k-ya': [['ヨーヨー', 'yooyoo', 'yo-yo'], ['ユーモア', 'yuumoa', 'humour'], ['タイヤ', 'taiya', 'tyre'], ['ユニーク', 'yuniiku', 'unique'], ['ユース', 'yuusu', 'youth'], ['ヤシ', 'yashi', 'palm tree'], ['ヨーヨー', 'yooyoo', 'yo-yo', null]],
  'k-ra': [['ホテル', 'hoteru', 'hotel'], ['カメラ', 'kamera', 'camera'], ['トイレ', 'toire', 'toilet'], ['アルコール', 'arukooru', 'alcohol'], ['ルール', 'ruuru', 'rule'], ['メール', 'meeru', 'email'], ['カラー', 'karaa', 'colour'], ['ミルク', 'miruku', 'milk'], ['コーラ', 'koora', 'cola'], ['クラス', 'kurasu', 'class'], ['レース', 'reesu', 'race; lace'], ['カレー', 'karee', 'curry'], ['ライス', 'raisu', 'rice (on a plate)'], ['タオル', 'taoru', 'towel'], ['サラリー', 'sararii', 'salary']],
  'k-wa': [['ワイン', 'wain', 'wine'], ['レモン', 'remon', 'lemon'], ['ラーメン', 'raamen', 'ramen'], ['レストラン', 'resutoran', 'restaurant'], ['リモコン', 'rimokon', 'remote control'], ['アンテナ', 'antena', 'antenna'], ['メロン', 'meron', 'melon'], ['ヒント', 'hinto', 'hint'], ['ワクチン', 'wakuchin', 'vaccine'], ['テント', 'tento', 'tent'], ['コンサート', 'konsaato', 'concert'], ['ワンタン', 'wantan', 'wonton']],
  'k-ga': [['ゲーム', 'geemu', 'game'], ['ガス', 'gasu', 'gas'], ['ギター', 'gitaa', 'guitar'], ['グラス', 'gurasu', 'glass (for drinks)'], ['ゴール', 'gooru', 'goal'], ['ハンガー', 'hangaa', 'hanger'], ['ヨーグルト', 'yooguruto', 'yoghurt'], ['ギア', 'gia', 'gear'], ['ゴム', 'gomu', 'rubber'], ['ガム', 'gamu', 'chewing gum'], ['ハイキング', 'haikingu', 'hiking'], ['ゴルフ', 'gorufu', 'golf'], ['マンゴー', 'mangoo', 'mango']],
  'k-za': [['サイズ', 'saizu', 'size'], ['ゼロ', 'zero', 'zero'], ['クイズ', 'kuizu', 'quiz'], ['ジーンズ', 'jiinzu', 'jeans'], ['ゾーン', 'zoon', 'zone'], ['ジム', 'jimu', 'gym'], ['ソーセージ', 'sooseeji', 'sausage'], ['ユーザー', 'yuuzaa', 'user'], ['ゼリー', 'zerii', 'jelly'], ['チーズ', 'chiizu', 'cheese'], ['ラジオ', 'rajio', 'radio']],
  'k-da': [['データ', 'deeta', 'data'], ['デザイン', 'dezain', 'design'], ['ドア', 'doa', 'door'], ['サラダ', 'sarada', 'salad'], ['ドーナツ', 'doonatsu', 'doughnut'], ['カード', 'kaado', 'card'], ['デート', 'deeto', 'date (romantic)'], ['モデル', 'moderu', 'model'], ['ダンス', 'dansu', 'dance'], ['ガイド', 'gaido', 'guide'], ['ドル', 'doru', 'dollar'], ['デジタル', 'dejitaru', 'digital'], ['ダイエット', 'daietto', 'diet (uses small ッ, taught later)', null]],
  'k-ba': [['テレビ', 'terebi', 'television'], ['バス', 'basu', 'bus'], ['ビール', 'biiru', 'beer'], ['バナナ', 'banana', 'banana'], ['ボール', 'booru', 'ball'], ['エレベーター', 'erebeetaa', 'elevator'], ['バター', 'bataa', 'butter'], ['ビル', 'biru', 'building'], ['ボタン', 'botan', 'button'], ['バイク', 'baiku', 'motorbike'], ['ブーツ', 'buutsu', 'boots'], ['ベルト', 'beruto', 'belt'], ['ブログ', 'burogu', 'blog'], ['アルバイト', 'arubaito', 'part-time job']],
  'k-pa': [['パン', 'pan', 'bread'], ['ペン', 'pen', 'pen'], ['パソコン', 'pasokon', 'personal computer'], ['スープ', 'suupu', 'soup'], ['ピアノ', 'piano', 'piano'], ['ポスト', 'posuto', 'postbox'], ['プール', 'puuru', 'swimming pool'], ['ピザ', 'piza', 'pizza'], ['ペンギン', 'pengin', 'penguin'], ['パスタ', 'pasuta', 'pasta'], ['スポーツ', 'supootsu', 'sports'], ['スーパー', 'suupaa', 'supermarket'], ['デパート', 'depaato', 'department store'], ['ピンク', 'pinku', 'pink'], ['パスポート', 'pasupooto', 'passport']],
  'k-combo1': [['シャツ', 'shatsu', 'shirt'], ['ニュース', 'nyuusu', 'news'], ['シャワー', 'shawaa', 'shower'], ['チョコレート', 'chokoreeto', 'chocolate'], ['キャベツ', 'kyabetsu', 'cabbage'], ['キャンプ', 'kyanpu', 'camping'], ['シャンプー', 'shanpuu', 'shampoo'], ['チャンス', 'chansu', 'chance'], ['ミュージック', 'myuujikku', 'music (uses small ッ, taught later)', null], ['キャンセル', 'kyanseru', 'cancel'], ['ショー', 'shoo', 'show'], ['メニュー', 'menyuu', 'menu'], ['マニキュア', 'manikyua', 'nail polish'], ['キャンドル', 'kyandoru', 'candle'], ['ヒューマン', 'hyuuman', 'human'], ['リュック', 'ryukku', 'backpack (uses small ッ, taught later)', null]],
  'k-combo2': [['ジャム', 'jamu', 'jam'], ['ジュース', 'juusu', 'juice'], ['ジョギング', 'jogingu', 'jogging'], ['ギャラリー', 'gyararii', 'gallery'], ['ジャズ', 'jazu', 'jazz'], ['ピュア', 'pyua', 'pure'], ['ジャンプ', 'janpu', 'jump'], ['ジョーク', 'jooku', 'joke'], ['ジャガイモ', 'jagaimo', 'potato'], ['ジャンル', 'janru', 'genre'], ['ビュー', 'byuu', 'view'], ['ギョーザ', 'gyooza', 'gyoza dumplings']],
  'k-sokuon': [['ベッド', 'beddo', 'bed'], ['サッカー', 'sakkaa', 'football (soccer)'], ['クッキー', 'kukkii', 'cookie'], ['ポケット', 'poketto', 'pocket'], ['チケット', 'chiketto', 'ticket'], ['カップ', 'kappu', 'cup'], ['コップ', 'koppu', 'glass; tumbler'], ['ロケット', 'roketto', 'rocket'], ['マッチ', 'matchi', 'match (for lighting)'], ['バッグ', 'baggu', 'bag'], ['ペット', 'petto', 'pet'], ['ネット', 'netto', 'the internet; net'], ['トラック', 'torakku', 'truck'], ['サンドイッチ', 'sandoitchi', 'sandwich'], ['ショッピング', 'shoppingu', 'shopping'], ['インターネット', 'intaanetto', 'internet'], ['リュック', 'ryukku', 'backpack']],
  'k-ext': [['パーティー', 'paatii', 'party'], ['ファッション', 'fasshon', 'fashion'], ['フォーク', 'fooku', 'fork'], ['ソファ', 'sofa', 'sofa'], ['ウェブ', 'webu', 'the web'], ['ウィンドウ', 'windou', 'window (on a screen)'], ['チェック', 'chekku', 'check'], ['ジェット', 'jetto', 'jet'], ['シェフ', 'shefu', 'chef'], ['ティー', 'tii', 'tea'], ['フィルム', 'firumu', 'film'], ['ディナー', 'dinaa', 'dinner'], ['カフェ', 'kafe', 'café'], ['フェリー', 'ferii', 'ferry'], ['ウォーター', 'wootaa', 'water'], ['スパゲッティ', 'supagetti', 'spaghetti'], ['ヴァイオリン', 'vaiorin', 'violin'], ['ティッシュ', 'tisshu', 'tissue'], ['タトゥー', 'tatuu', 'tattoo']]
};

const NOTES = {
  'k-a': 'Katakana writes the same 46 sounds as hiragana with angular strokes. It is used for loanwords (コーヒー), foreign names, animal and plant names in science, onomatopoeia, and emphasis. The long-vowel mark ー replaces the extra vowel kana hiragana uses: hiragana おかあさん, katakana カー.',
  'k-ka': 'Loanword rule 1: English consonant clusters get a vowel inserted, usually u (ク, ス, ト takes o): "cake" → ケーキ, "ice" → アイス.',
  'k-sa': 'Loanword rule 2: a long English vowel or an -er/-or ending becomes ー: "course" → コース, "soccer" → サッカー. シ (drops from the side) and ツ (drops from above) are the most-confused pair; so are ソ and ン.',
  'k-ta': 'ツ and シ: in ツ the two short strokes point down and the sweep rises steeply; in シ the short strokes point right and the sweep is flatter. Note スーツ (suit) and スカート (skirt): "t" before a vowel-less ending becomes ト.',
  'k-na': 'ナ (two strokes, straight) versus メ (two strokes, crossing low). Words you already know in hiragana (いぬ, ねこ) stay hiragana; katakana is for words that came from other languages.',
  'k-ha': 'フ, ワ and ウ share a family: フ is open on the left, ワ is closed, ウ wears a hat. コーヒー (coffee) is the classic four-beat word: ko-o-hi-i.',
  'k-ma': 'Loanword rule 3: English "-er" at the end becomes aa with ー: "maker" → メーカー, "motor" → モーター. ム looks like a cow\'s nose; マ is a 7 with a tail.',
  'k-ya': 'Small ャ, ュ, ョ are introduced in the combinations group. The full-size ヤ ユ ヨ you learn here are their own beats.',
  'k-ra': 'The r-row is the busiest in loanwords because English l and r both become the Japanese r: "rule" → ルール, "lace" and "race" are both レース. ル (two strokes) versus レ (one stroke).',
  'k-wa': 'ン closes a syllable: パン, レストラン. It is one beat on its own. ソ versus ン: ソ\'s sweep starts from the top; ン\'s sweep starts low and rises.',
  'k-ga': 'Voiced consonants work exactly as in hiragana. English "-ing" becomes イング: ハイキング, ショッピング.',
  'k-za': 'ジ is "ji": ジム (gym), ラジオ (radio). English "z" and "th" both tend to become ザ-row sounds.',
  'k-da': 'English "d" + vowel is straightforward; a bare "d" at the end becomes ド: カード (card), ガイド (guide).',
  'k-ba': 'English "v" is usually written with the バ row: テレビ (television), ビル (building). ヴ exists for precision but is optional.',
  'k-pa': 'Half-voiced p sounds carry a lot of everyday vocabulary: パン, ペン, パソコン (pasokon, from "personal computer").',
  'k-combo1': 'Small ャ ュ ョ blend into one beat, as in hiragana. English "sh", "ch", "ny" and "-ure" endings land here: シャツ, チャンス, ニュース, ミュージック.',
  'k-combo2': 'Voiced combinations: ジャ ジュ ジョ carry English "j" and soft "g": ジャム, ジュース, ジョギング.',
  'k-sokuon': 'Small ッ doubles the next consonant and often appears where English has a short, clipped vowel: bed → ベッド, cup → カップ, net → ネット.',
  'k-ext': 'Extended combinations use small ァ ィ ゥ ェ ォ to reach sounds Japanese did not have: ファ (fa), ティ (ti), ウェ (we), ヴァ (va). They appear only in loanwords and names. Usage varies: ヴァイオリン and バイオリン are both common.'
};

const slug = (romaji) => romaji.toLowerCase().replace(/\s*\(.*\)/, '').replace(/[^a-z]+/g, '');
const groups = [];
const known = new Set();

function push(id, title, kind, chars, words, intro) {
  groups.push({
    id, title, kind, intro: intro || undefined,
    chars: chars.map((c) => ({ ...c, strokes: c.strokes ?? (strokes[c.char] ? strokes[c.char].strokes.length : undefined) })),
    words: (words || []).filter((w) => w[3] !== null).map(([jp, romaji, meaning]) => ({ id: `vocab:katakana:${slug(romaji)}-${jp}`, jp, romaji, meaning })),
    note: NOTES[id]
  });
}

for (const [id, [title, chars]] of Object.entries(BASIC)) {
  push(id, title, 'basic', chars.map((c) => ({ id: `kana:k:${c[3] || slug(c[1])}`, char: c[0], romaji: c[1], mnemonic: c[2] })), WORDS[id]);
}
for (const [id, [title, intro, chars]] of Object.entries(DAKUTEN)) {
  push(id, title, id === 'k-pa' ? 'handakuten' : 'dakuten', chars.map(([char, romaji, idSlug]) => {
    const base = String.fromCodePoint(char.codePointAt(0) - (id === 'k-pa' ? 2 : 1));
    const mark = id === 'k-pa' ? 'a small circle (handakuten)' : 'two dots (dakuten)';
    return { id: `kana:k:${idSlug || slug(romaji)}`, char, romaji, base, mnemonic: `${base} with ${mark} becomes ${romaji.replace(/\s*\(.*\)/, '')}. Same shape, ${mark.includes('handakuten') ? 'p sound' : 'voiced sound'}.` };
  }), WORDS[id], intro);
}
const allBasic = Object.values(BASIC).flatMap(([t, c]) => c).concat(Object.values(DAKUTEN).flatMap(([t, i, c]) => c));
function comboChars(list) {
  const out = [];
  for (const [base, cons] of list) {
    const baseRomaji = allBasic.find((c) => c[0] === base)[1];
    for (const [small, [sy, vowel]] of Object.entries(SMALL)) {
      const romaji = cons + vowel;
      out.push({ id: `kana:k:${romaji}`, char: base + small, romaji, parts: [base, small], mnemonic: `${base} (${baseRomaji.replace(/\s*\(.*\)/, '')}) + small ${small} = ${romaji}, said as one beat.`, strokes: strokes[base].strokes.length + strokes[small].strokes.length });
    }
  }
  return out;
}
push('k-combo1', 'Combinations (キャ, シュ, チョ…)', 'combo', comboChars(COMBO1), WORDS['k-combo1'], 'Combine an i-row katakana with a small ャ, ュ or ョ. The two symbols make one beat.');
push('k-combo2', 'Voiced combinations (ギャ, ジュ, ビョ…)', 'combo', comboChars(COMBO2), WORDS['k-combo2'], 'The same pattern with dakuten and handakuten katakana.');
push('k-sokuon', 'Small ッ (double consonants)', 'special', [
  { id: 'kana:k:xtsu', char: 'ッ', romaji: '(pause)', mnemonic: 'A small ツ. Not pronounced: it doubles the next consonant with a one-beat pause, as in ベッド (bed).', strokes: strokes['ッ'].strokes.length }
], WORDS['k-sokuon'], 'Small ッ marks a doubled consonant: the sound stops for one beat.');
push('k-ext', 'Extended combinations (ファ, ティ, ウェ…)', 'combo', EXTENDED.map(([char, romaji, parts, mnemonic]) => ({ id: `kana:k:x-${romaji}`, char, romaji, parts, mnemonic, strokes: parts.reduce((n, p) => n + strokes[p].strokes.length, 0) })), WORDS['k-ext'], 'Katakana borrows sounds Japanese never had by pairing a kana with a small vowel: ファ, ティ, ウェ, ヴァ.');

// Sanity: every word uses only known units (validator repeats this check).
for (const g of groups) {
  for (const c of g.chars) known.add(c.char);
  const units = [...known].sort((a, b) => b.length - a.length);
  for (const w of g.words) {
    let rest = w.jp;
    while (rest.length) {
      const u = units.find((x) => rest.startsWith(x));
      if (!u) { console.log(`BAD ${g.id} word ${w.jp} uses untaught "${rest[0]}"`); break; }
      rest = rest.slice(u.length);
    }
  }
  for (const c of g.chars) if (c.strokes == null) throw new Error(`no stroke count for ${c.char}`);
}
const ids = new Set();
for (const g of groups) for (const it of [...g.chars, ...g.words]) { if (ids.has(it.id)) throw new Error('dup ' + it.id); ids.add(it.id); }

const out = {
  script: 'katakana',
  title: 'Katakana',
  exam: { questions: 50, passPercent: 90, unlocks: 'N5' },
  quiz: { questions: 12, passPercent: 80 },
  groups
};
fs.writeFileSync(`${ROOT}/data/katakana.json`, JSON.stringify(out, null, 1), 'utf8');
const nChars = groups.reduce((n, g) => n + g.chars.length, 0), nWords = groups.reduce((n, g) => n + g.words.length, 0);
console.log(`katakana.json: ${groups.length} groups, ${nChars} characters, ${nWords} words`);
