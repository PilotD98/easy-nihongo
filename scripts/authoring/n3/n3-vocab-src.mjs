// N3 vocabulary source, part 1 (beyond N5/N4). surface|reading|meaning|pos
// Readings and meanings are verified against JMdict by check-vocab.mjs.
import { VOCAB2 } from './n3-vocab-src-2.mjs';

const VOCAB1 = `
# --- Society, politics, organisations
政治家|せいじか|politician|n
議員|ぎいん|member of parliament|n
会議室|かいぎしつ|meeting room|n
議論|ぎろん|argument; discussion|n
対策|たいさく|countermeasure|n
対象|たいしょう|target; object|n
反対|はんたい|opposition|n
賛成|さんせい|approval; agreement|n
選挙|せんきょ|election|n
投票|とうひょう|vote|n
国民|こくみん|the people; nation|n
県|けん|prefecture|n
地方|ちほう|region; countryside|n
地域|ちいき|area; region|n
国内|こくない|domestic|n
国外|こくがい|abroad|n
内容|ないよう|contents|n
部分|ぶぶん|part|n
全体|ぜんたい|the whole|n
一般|いっぱん|general; ordinary|n
社会人|しゃかいじん|working adult|n
団体|だんたい|group; organisation|n
組織|そしき|organisation|n
委員|いいん|committee member|n
委員会|いいんかい|committee|n
参加者|さんかしゃ|participant|n
関係者|かんけいしゃ|person concerned|n
担当|たんとう|being in charge|n
担当者|たんとうしゃ|person in charge|n
責任|せきにん|responsibility|n
役割|やくわり|role|n
役所|やくしょ|government office|n
制度|せいど|system; institution|n
法|ほう|law; method|n
条件|じょうけん|condition|n
権利|けんり|right (legal)|n
義務|ぎむ|duty; obligation|n
平和|へいわ|peace|n
戦争|せんそう|war|n
軍|ぐん|army|n
兵士|へいし|soldier|n
武器|ぶき|weapon|n
事件|じけん|incident; case|n
事情|じじょう|circumstances|n
事実|じじつ|fact|n
現実|げんじつ|reality|n
現在|げんざい|the present|n
現代|げんだい|modern times|n
実際|じっさい|actually; reality|n
実は|じつは|actually; the truth is|adv
当時|とうじ|at that time|n
当日|とうじつ|that day; the day in question|n
期間|きかん|period; term|n
期限|きげん|deadline|n
学期|がっき|school term|n
時期|じき|time; season|n
定期|ていき|regular; periodic|n
予定表|よていひょう|schedule|n
契約|けいやく|contract|n
協力|きょうりょく|cooperation|n
協会|きょうかい|association|n
機関|きかん|organisation; engine|n
機能|きのう|function|n
平均|へいきん|average|n
総理大臣|そうりだいじん|prime minister|n
総合|そうごう|synthesis; comprehensive|n
加える|くわえる|to add|v1
加わる|くわわる|to join|v5
参加費|さんかひ|participation fee|n
# --- Records, communication
記事|きじ|article|n
記者|きしゃ|reporter|n
記録|きろく|record|n
記憶|きおく|memory|n
報告書|ほうこくしょ|written report|n
情報|じょうほう|information|n
感情|かんじょう|emotion|n
表現|ひょうげん|expression|n
表情|ひょうじょう|facial expression|n
表|ひょう|table; chart|n
発表会|はっぴょうかい|recital; presentation|n
説明書|せつめいしょ|manual|n
申し込み|もうしこみ|application|n
申請|しんせい|application (formal)|n
指示|しじ|instruction|n
指導|しどう|guidance; coaching|n
指定|してい|designation|n
初め|はじめ|beginning|n
初心者|しょしんしゃ|beginner|n
最終|さいしゅう|last; final|n
最高|さいこう|highest; best|adj-na
最低|さいてい|lowest; worst|adj-na
最も|もっとも|most|adv
結論|けつろん|conclusion|n
結局|けっきょく|after all; in the end|adv
点数|てんすう|score|n
得点|とくてん|score; points gained|n
得意|とくい|one's forte; proud|adj-na
解決|かいけつ|solution; settlement|n
解答|かいとう|answer (to a problem)|n
理解|りかい|understanding|n
交通|こうつう|traffic; transport|n
交換|こうかん|exchange|n
交流|こうりゅう|exchange (cultural)|n
資料|しりょう|materials; data|n
資格|しかく|qualification|n
資源|しげん|resources|n
予想|よそう|expectation; forecast|n
予算|よさん|budget|n
予防|よぼう|prevention|n
際|さい|occasion|n
国際的|こくさいてき|international|adj-na
調査|ちょうさ|survey; investigation|n
調子|ちょうし|condition; tone|n
検査|けんさ|inspection; examination|n
勝負|しょうぶ|match; contest|n
勝ち|かち|win|n
負け|まけ|loss|n
面|めん|face; aspect; mask|n
場面|ばめん|scene|n
画面|がめん|screen|n
面倒|めんどう|trouble; bother|adj-na
広告|こうこく|advertisement|n
報道|ほうどう|news report|n
判断|はんだん|judgement|n
批判|ひはん|criticism|n
評判|ひょうばん|reputation|n
評価|ひょうか|evaluation|n
認める|みとめる|to recognise; to admit|v1
確実|かくじつ|certain; reliable|adj-na
利益|りえき|profit|n
便利さ|べんりさ|convenience|n
組み合わせ|くみあわせ|combination|n
組む|くむ|to assemble; to team up|v5
案|あん|plan; idea|n
提案|ていあん|proposal|n
案外|あんがい|unexpectedly|adv
存在|そんざい|existence|n
在学|ざいがく|being enrolled|n
件|けん|matter; case|n
用件|ようけん|business; matter to discuss|n
側|がわ|side|n
任せる|まかせる|to entrust|v1
求める|もとめる|to seek; to request|v1
要求|ようきゅう|demand|n
次々|つぎつぎ|one after another|adv
目次|もくじ|table of contents|n
論文|ろんぶん|thesis; paper|n
官|かん|government official|n
増加|ぞうか|increase|n
増やす|ふやす|to increase (something)|v5
関心|かんしん|interest; concern|n
関する|かんする|to be related to|vs
感じ|かんじ|feeling; impression|n
感じる|かんじる|to feel|v1
感動|かんどう|being moved; impression|n
感想|かんそう|impressions; thoughts|n
情け|なさけ|sympathy; pity|n
示す|しめす|to show; to indicate|v5
打ち合わせ|うちあわせ|preliminary meeting|n
基本|きほん|basics|n
基準|きじゅん|standard; criterion|n
基礎|きそ|foundation; basics|n
各|かく|each|pre-noun
各地|かくち|every place|n
直接|ちょくせつ|direct|n
素直|すなお|honest; obedient|adj-na
両方|りょうほう|both|n
両手|りょうて|both hands|n
革|かわ|leather|n
価格|かかく|price|n
価値|かち|value|n
形式|けいしき|form; format|n
正式|せいしき|formal; official|adj-na
方式|ほうしき|method; system|n
式|しき|ceremony; formula|n
果たす|はたす|to accomplish|v5
効果|こうか|effect|n
勢い|いきおい|momentum; force|n
減らす|へらす|to reduce|v5
容器|ようき|container|n
内容物|ないようぶつ|contents (physical)|n
応援|おうえん|support; cheering|n
応募|おうぼ|application (for a job)|n
演説|えんぜつ|speech|n
演奏|えんそう|musical performance|n
争い|あらそい|dispute|n
相談相手|そうだんあいて|someone to consult|n
能力|のうりょく|ability|n
可能|かのう|possible|adj-na
可能性|かのうせい|possibility|n
再び|ふたたび|again|adv
位置|いち|position|n
地位|ちい|status; position|n
流れ|ながれ|flow|n
流れる|ながれる|to flow|v1
流行|りゅうこう|fashion; trend|n
交流会|こうりゅうかい|social gathering|n
格好|かっこう|appearance; shape|n
疑う|うたがう|to doubt|v5
疑問|ぎもん|question; doubt|n
過ぎ|すぎ|past (time)|n
過去|かこ|the past|n
過ごす|すごす|to spend (time)|v5
局|きょく|bureau; station|n
放送局|ほうそうきょく|broadcasting station|n
放す|はなす|to release|v5
消費税|しょうひぜい|consumption tax|n
検討|けんとう|examination; consideration|n
常に|つねに|always|adv
日常|にちじょう|everyday|n
状態|じょうたい|state; condition|n
状況|じょうきょう|situation|n
地球|ちきゅう|the earth|n
経営|けいえい|management|n
営業|えいぎょう|business; sales|n
職業|しょくぎょう|occupation|n
職場|しょくば|workplace|n
就職|しゅうしょく|finding employment|n
提供|ていきょう|offer; provision|n
子供たち|こどもたち|children|n
許可|きょか|permission|n
構成|こうせい|composition; structure|n
割れる|われる|to break; to crack|v1
割る|わる|to divide; to break|v5
身体|しんたい|body|n
身長|しんちょう|height (of a person)|n
身分|みぶん|social status; identity|n
費用|ひよう|expense; cost|n
消費|しょうひ|consumption|n
付ける|つける|to attach|v1
付き合う|つきあう|to associate with; to date|v5
自由に|じゆうに|freely|adv
比べる|くらべる|to compare|v1
比較|ひかく|comparison|n
難しさ|むずかしさ|difficulty|n
防ぐ|ふせぐ|to prevent|v5
防止|ぼうし|prevention|n
補う|おぎなう|to supplement|v5
優れる|すぐれる|to excel|v1
優秀|ゆうしゅう|excellent|adj-na
優先|ゆうせん|priority|n
夫婦|ふうふ|married couple|n
収入|しゅうにゅう|income|n
石油|せきゆ|petroleum|n
境|さかい|boundary|n
環境|かんきょう|environment|n
神|かみ|god|n
神様|かみさま|god (polite)|n
順番|じゅんばん|turn; order|n
規模|きぼ|scale|n
技術者|ぎじゅつしゃ|engineer|n
芸術|げいじゅつ|art|n
手術|しゅじゅつ|surgery|n
展示|てんじ|exhibition|n
発展|はってん|development|n
導入|どうにゅう|introduction (of a system)|n
設備|せつび|facilities; equipment|n
自宅|じたく|one's home|n
住宅|じゅうたく|housing|n
被害|ひがい|damage|n
害|がい|harm|n
副|ふく|vice-; assistant|n
計算|けいさん|calculation|n
条|じょう|article; clause|cnt
独立|どくりつ|independence|n
独身|どくしん|single (unmarried)|n
警察官|けいさつかん|police officer|n
警告|けいこく|warning|n
輸送|ゆそう|transport|n
訪問|ほうもん|visit|n
述べる|のべる|to state|v1
残る|のこる|to remain|v5
残す|のこす|to leave behind|v5
想像|そうぞう|imagination|n
線|せん|line|n
線路|せんろ|railway track|n
率|りつ|rate|n
確率|かくりつ|probability|n
農業|のうぎょう|agriculture|n
農家|のうか|farmer; farmhouse|n
州|しゅう|state; province|n
武士|ぶし|samurai|n
残念ながら|ざんねんながら|unfortunately|adv
念のため|ねんのため|just in case|exp
印象|いんしょう|impression|n
象|ぞう|elephant|n
地域社会|ちいきしゃかい|local community|n
助ける|たすける|to help; to save|v1
助かる|たすかる|to be saved; to be helped|v5
労働|ろうどう|labour|n
例|れい|example|n
例外|れいがい|exception|n
自然|しぜん|nature|n
当然|とうぜん|naturally; of course|adj-na
張る|はる|to stretch; to put up|v5
頑張り|がんばり|effort|n
限る|かぎる|to limit|v5
限界|げんかい|limit|n
金額|きんがく|amount of money|n
額|がく|amount; frame|n
追加|ついか|addition|n
商売|しょうばい|business; trade|n
言葉遣い|ことばづかい|way of speaking|n
伝統|でんとう|tradition|n
手伝い|てつだい|help; helper|n
景気|けいき|economic conditions|n
落ち着く|おちつく|to calm down|v5
担ぐ|かつぐ|to carry on the shoulder|v5
負担|ふたん|burden|n
退屈|たいくつ|boredom|adj-na
基準点|きじゅんてん|reference point|n
賞|しょう|prize|n
賞金|しょうきん|prize money|n
辺り|あたり|vicinity|n
周辺|しゅうへん|surroundings|n
造る|つくる|to make; to build|v5
製造|せいぞう|manufacture|n
技|わざ|technique|n
回復|かいふく|recovery|n
失う|うしなう|to lose|v5
移る|うつる|to move; to transfer|v5
移動|いどう|movement; transfer|n
差|さ|difference|n
差別|さべつ|discrimination|n
個人|こじん|individual|n
個性|こせい|individuality|n
評論|ひょうろん|critique|n
課題|かだい|task; issue|n
年末|ねんまつ|year end|n
若者|わかもの|young person|n
脳|のう|brain|n
極めて|きわめて|extremely|adv
種類|しゅるい|kind; type|n
種|たね|seed|n
美術|びじゅつ|fine art|n
命|いのち|life|n
命令|めいれい|order; command|n
幸福|こうふく|happiness|adj-na
倉庫|そうこ|warehouse|n
量|りょう|quantity|n
大量|たいりょう|large quantity|n
望む|のぞむ|to wish for|v5
希望|きぼう|hope; wish|n
非常に|ひじょうに|extremely|adv
非常|ひじょう|emergency|n
観光客|かんこうきゃく|tourist|n
観察|かんさつ|observation|n
整理|せいり|sorting; organising|n
段階|だんかい|stage; step|n
横断|おうだん|crossing|n
型|かた|type; model|n
深夜|しんや|late night|n
様子|ようす|state; appearance|n
様々|さまざま|various|adj-na
財産|ざいさん|property; assets|n
知識|ちしき|knowledge|n
常識|じょうしき|common sense|n
意識|いしき|consciousness; awareness|n
呼び出す|よびだす|to call out; to summon|v5
達成|たっせい|achievement|n
良い|よい|good|adj-i
改良|かいりょう|improvement|n
方針|ほうしん|policy|n
専門家|せんもんか|expert|n
専門学校|せんもんがっこう|vocational school|n
谷|たに|valley|n
候補|こうほ|candidate|n
気候|きこう|climate|n
歴史的|れきしてき|historical|adj-na
程|ほど|degree; extent|n
満足|まんぞく|satisfaction|adj-na
満員|まんいん|full (of people)|n
不満|ふまん|dissatisfaction|adj-na
失敗作|しっぱいさく|a failure (work)|n
管理|かんり|management|n
値|ね|price|n
兵|へい|soldier|n
接続|せつぞく|connection|n
直接的|ちょくせつてき|direct|adj-na
器|うつわ|vessel; bowl|n
器具|きぐ|utensil; appliance|n
通路|つうろ|passage; aisle|n
科目|かもく|subject (school)|n
教授|きょうじゅ|professor|n
積む|つむ|to pile up; to load|v5
積極的|せっきょくてき|positive; proactive|adj-na
面積|めんせき|area|n
他人|たにん|other people; stranger|n
その他|そのた|and so on; others|n
記録的|きろくてき|record-breaking|adj-na
処理|しょり|processing; handling|n
省く|はぶく|to omit|v5
省略|しょうりゃく|omission; abbreviation|n
旧|きゅう|old; former|n
岸|きし|shore|n
客室|きゃくしつ|guest room|n
否定|ひてい|denial|n
周囲|しゅうい|surroundings|n
師|し|teacher; master|n
教師|きょうし|teacher|n
木材|もくざい|timber|n
登録|とうろく|registration|n
登山|とざん|mountain climbing|n
批評|ひひょう|criticism; review|n
容易|ようい|easy|adj-na
速度|そくど|speed|n
保存|ほぞん|preservation; saving|n
生存|せいぞん|survival|n
飛行場|ひこうじょう|airfield|n
殺す|ころす|to kill|v5
中央|ちゅうおう|centre|n
券|けん|ticket|n
定期券|ていきけん|commuter pass|n
記号|きごう|symbol|n
単語|たんご|word; vocabulary|n
単に|たんに|simply; merely|adv
座席|ざせき|seat|n
破れる|やぶれる|to be torn|v1
編集|へんしゅう|editing|n
竹|たけ|bamboo|n
除く|のぞく|to exclude; to remove|v5
掃除機|そうじき|vacuum cleaner|n
完成|かんせい|completion|n
完全|かんぜん|complete; perfect|adj-na
責める|せめる|to blame|v1
並木|なみき|row of trees|n
修理|しゅうり|repair|n
修正|しゅうせい|correction; amendment|n
危ない|あぶない|dangerous|adj-i
採用|さいよう|hiring; adoption|n
競技|きょうぎ|competition; sport|n
拡大|かくだい|expansion|n
故障|こしょう|breakdown|n
支給|しきゅう|provision; payment|n
根|ね|root|n
苦しい|くるしい|painful; difficult|adj-i
苦労|くろう|hardship|n
苦手|にがて|weak point; poor at|adj-na
庭園|ていえん|garden (formal)|n
具体的|ぐたいてき|concrete; specific|adj-na
家具|かぐ|furniture|n
異なる|ことなる|to differ|v5
異常|いじょう|abnormal|adj-na
愛|あい|love|n
愛する|あいする|to love|vs
富|とみ|wealth|n
未来|みらい|future|n
未だ|いまだ|still; not yet|adv
講師|こうし|lecturer|n
服装|ふくそう|clothing; dress|n
諸国|しょこく|various countries|n
劇|げき|drama; play|n
劇場|げきじょう|theatre|n
河|かわ|river|n
航空|こうくう|aviation|n
冷静|れいせい|calm|adj-na
適切|てきせつ|appropriate|adj-na
主婦|しゅふ|housewife|n
類|るい|kind; type|n
人類|じんるい|humankind|n
児童|じどう|child; juvenile|n
余る|あまる|to be left over|v5
余計|よけい|excess; unnecessary|adj-na
禁止|きんし|prohibition|n
禁煙|きんえん|no smoking|n
印刷|いんさつ|printing|n
逆|ぎゃく|reverse; opposite|n
王|おう|king|n
目標|もくひょう|goal; target|n
標準|ひょうじゅん|standard|n
久しぶり|ひさしぶり|after a long time|n
暴力|ぼうりょく|violence|n
輪|わ|ring; circle|n
背中|せなか|back (body)|n
背景|はいけい|background|n
植物|しょくぶつ|plant|n
宿泊|しゅくはく|lodging|n
清潔|せいけつ|clean; hygienic|adj-na
保険|ほけん|insurance|n
感覚|かんかく|sense; feeling|n
均等|きんとう|equal; even|adj-na
億|おく|hundred million|num
圧力|あつりょく|pressure|n
芸能人|げいのうじん|entertainer|n
許す|ゆるす|to forgive; to permit|v5
署名|しょめい|signature|n
罪|つみ|crime; sin|n
停車|ていしゃ|stopping (a vehicle)|n
停電|ていでん|power cut|n
陸|りく|land|n
玉|たま|ball; jewel|n
電波|でんぱ|radio wave; signal|n
帯|おび|belt; sash|n
延期|えんき|postponement|n
羽|はね|feather; wing|n
努力|どりょく|effort|n
精神|せいしん|spirit; mind|n
規則正しい|きそくただしい|regular; well-regulated|adj-i
乱れる|みだれる|to be disordered|v1
散歩道|さんぽみち|walking path|n
司会|しかい|host; chairing|n
健康的|けんこうてき|healthy|adj-na
測る|はかる|to measure|v5
豊か|ゆたか|rich; abundant|adj-na
`;

export const VOCAB = VOCAB1 + VOCAB2;
