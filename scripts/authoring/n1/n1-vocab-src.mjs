// N1 vocabulary source, part 1 (units 1–30). surface|reading|meaning|pos
// Readings and meanings are verified against JMdict by check-vocab.mjs.
import { VOCAB2 } from './n1-vocab-src-2.mjs';
import { VOCAB3 } from './n1-vocab-src-3.mjs';
import { VOCAB4 } from './n1-vocab-src-4.mjs';

const VOCAB1 = `
# --- Units 1-6
氏名|しめい|full name|n
氏|し|Mr; Ms; clan|n-suf
統一|とういつ|unification|n
統計学|とうけいがく|statistics (field)|n
伝統的|でんとうてき|traditional|adj-na
派閥|はばつ|faction; clique|n
流派|りゅうは|school (of thought or art)|n
対策本部|たいさくほんぶ|countermeasures headquarters|n
提携|ていけい|tie-up; cooperation|n
前提|ぜんてい|premise|n
選挙戦|せんきょせん|election campaign|n
藤|ふじ|wisteria|n
沢|さわ|swamp; marsh|n
贅沢品|ぜいたくひん|luxury item|n
裁判官|さいばんかん|judge|n
証拠品|しょうこひん|piece of evidence|n
証言|しょうげん|testimony|n
支援|しえん|support|n
実施中|じっしちゅう|in progress; being implemented|n
井戸|いど|well|n
護衛|ごえい|escort; guard|n
保護|ほご|protection|n
実態|じったい|actual state|n
鮮明|せんめい|vivid; clear|adj-na
視野|しや|field of vision; outlook|n
重視|じゅうし|emphasis; attaching importance|n
無視|むし|ignoring|n
幹部|かんぶ|executive; leadership|n
幹線|かんせん|main line; trunk line|n
宮殿|きゅうでん|palace|n
神宮|じんぐう|Shinto shrine (grand)|n
防衛|ぼうえい|defence|n
衛星|えいせい|satellite|n
監督|かんとく|director; supervisor|n
監視|かんし|surveillance|n
審査|しんさ|examination; screening|n
審判|しんぱん|referee; judgement|n
正義|せいぎ|justice|n
意義|いぎ|significance|n
訴訟|そしょう|lawsuit|n
姿勢|しせい|posture; attitude|n
姿|すがた|figure; appearance|n
内閣|ないかく|cabinet (government)|n
閣僚|かくりょう|cabinet minister|n
大衆|たいしゅう|the masses|n
観衆|かんしゅう|spectators|n
影響|えいきょう|influence|n
影|かげ|shadow|n
松|まつ|pine tree|n
攻撃力|こうげきりょく|offensive power|n
衝撃|しょうげき|shock; impact|n
目撃|もくげき|witnessing|n
補佐|ほさ|assistant; aide|n
核|かく|nucleus; core|n
核心|かくしん|core; heart (of a matter)|n
金融|きんゆう|finance|n
融合|ゆうごう|fusion|n
投票率|とうひょうりつ|voter turnout|n
伝票|でんぴょう|slip; voucher|n
干渉|かんしょう|interference|n
影響力|えいきょうりょく|influence (power)|n
反響|はんきょう|echo; response|n
推進力|すいしんりょく|driving force|n
推薦|すいせん|recommendation|n
要請|ようせい|request; demand|n
請求|せいきゅう|claim; billing|n
弁護士|べんごし|lawyer|n
博士|はかせ|doctor (PhD)|n
討論会|とうろんかい|debate meeting|n
検討中|けんとうちゅう|under consideration|n
崎|さき|cape; promontory|n
監督者|かんとくしゃ|supervisor|n
開催|かいさい|holding (an event)|n
催し|もよおし|event|n
及ぶ|およぶ|to reach; to extend to|v5
普及率|ふきゅうりつ|rate of diffusion|n
憲法改正|けんぽうかいせい|constitutional amendment|n
離れ|はなれ|detached room|n
分離|ぶんり|separation|n
距離|きょり|distance|n
刺激|しげき|stimulus|n
過激|かげき|extreme; radical|adj-na
摘む|つむ|to pick; to pluck|v5
摘発|てきはつ|exposure; crackdown|n
# --- Units 7-12
系統|けいとう|system; lineage|n
体系|たいけい|system; organisation|n
太郎|たろう|Taro (common male name)|n
新郎|しんろう|bridegroom|n
同盟|どうめい|alliance|n
加盟|かめい|affiliation; joining|n
従業員数|じゅうぎょういんすう|number of employees|n
服従|ふくじゅう|obedience|n
従来|じゅうらい|conventional; up to now|n
部隊|ぶたい|unit; troops|n
隊員|たいいん|member (of a unit)|n
組織的|そしきてき|systematic|adj-na
織物|おりもの|textile|n
振動|しんどう|vibration|n
振り|ふり|pretence; appearance|n
弁解|べんかい|excuse; justification|n
就任|しゅうにん|assumption of office|n
献立|こんだて|menu|n
文献|ぶんけん|literature; documents|n
厳しさ|きびしさ|severity|n
厳密|げんみつ|strict; precise|adj-na
維持費|いじひ|maintenance cost|n
繊維|せんい|fibre|n
浜|はま|beach|n
海浜|かいひん|seashore|n
遺産|いさん|inheritance; heritage|n
遺伝|いでん|heredity|n
塁|るい|base (baseball)|n
連邦|れんぽう|federation|n
邦人|ほうじん|Japanese national (abroad)|n
素材|そざい|material|n
素質|そしつ|aptitude; nature|n
抗議|こうぎ|protest|n
対抗|たいこう|opposition; rivalry|n
抵抗|ていこう|resistance|n
模様|もよう|pattern; design|n
模範|もはん|model; example|n
雄|おす|male (animal)|n
英雄|えいゆう|hero|n
有益|ゆうえき|beneficial|adj-na
緊急|きんきゅう|emergency|n
緊張感|きんちょうかん|feeling of tension|n
宣言|せんげん|declaration|n
宣伝|せんでん|publicity; advertising|n
昭和|しょうわ|Shōwa era|n
廃棄|はいき|disposal; abandonment|n
江戸|えど|Edo (old Tokyo)|n
官僚|かんりょう|bureaucrat|n
吉|きち|good fortune|n
盛り上がり|もりあがり|excitement; climax|n
皇帝|こうてい|emperor|n
天皇|てんのう|Emperor of Japan|n
臨時休業|りんじきゅうぎょう|temporary closure|n
臨む|のぞむ|to face; to attend|v5
踏み切る|ふみきる|to take the plunge|v5
破壊|はかい|destruction|n
崩壊|ほうかい|collapse|n
負債|ふさい|debt; liabilities|n
債券|さいけん|bond; debenture|n
興味深い|きょうみぶかい|very interesting|adj-i
興奮状態|こうふんじょうたい|state of excitement|n
起源|きげん|origin|n
儀式|ぎしき|ceremony|n
礼儀正しい|れいぎただしい|well-mannered|adj-i
創造|そうぞう|creation|n
創業|そうぎょう|founding (a business)|n
障害|しょうがい|obstacle; disability|n
故障中|こしょうちゅう|out of order|n
継続性|けいぞくせい|continuity|n
継ぐ|つぐ|to succeed; to inherit|v5
中継|ちゅうけい|relay; live broadcast|n
筋肉痛|きんにくつう|muscle pain|n
筋|すじ|line; plot; sinew|n
闘争|とうそう|struggle; conflict|n
戦闘|せんとう|battle|n
葬式|そうしき|funeral|n
避難所|ひなんじょ|evacuation shelter|n
逮捕状|たいほじょう|arrest warrant|n
迫る|せまる|to approach; to press|v5
圧迫|あっぱく|pressure; oppression|n
迷惑行為|めいわくこうい|nuisance behaviour|n
誘惑|ゆうわく|temptation|n
# --- Units 13-18
世紀|せいき|century|n
紀元|きげん|era; epoch|n
聴く|きく|to listen (attentively)|v5
聴衆|ちょうしゅう|audience|n
視聴者|しちょうしゃ|viewer (TV)|n
脱出|だっしゅつ|escape|n
離脱|りだつ|withdrawal; secession|n
博覧会|はくらんかい|exposition|n
締め切る|しめきる|to close (applications)|v5
締結|ていけつ|conclusion (of a treaty)|n
執筆|しっぴつ|writing (a book)|n
執着|しゅうちゃく|attachment; obsession|n
執行|しっこう|execution; enforcement|n
暖房器具|だんぼうきぐ|heating appliance|n
厨房|ちゅうぼう|kitchen (commercial)|n
撤退|てったい|withdrawal; retreat|n
撤去|てっきょ|removal|n
削減|さくげん|reduction; cut|n
密接|みっせつ|close; intimate|adj-na
密度|みつど|density|n
措置|そち|measure; step|n
記載|きさい|mention; entry (in a document)|n
積載|せきさい|loading (cargo)|n
陣営|じんえい|camp (political)|n
陣|じん|battle formation; camp|n
我々|われわれ|we|pn
我が国|わがくに|our country|n
我慢強い|がまんづよい|patient; persevering|adj-i
為替|かわせ|exchange (currency)|n
人為的|じんいてき|artificial; man-made|adj-na
抑制|よくせい|control; restraint|n
幕|まく|curtain; act|n
開幕|かいまく|opening (of a season or event)|n
幕府|ばくふ|shogunate|n
感染|かんせん|infection|n
伝染|でんせん|contagion|n
奈良|なら|Nara|n
傷|きず|wound; scratch|n
傷つける|きずつける|to wound; to hurt|v1
負傷|ふしょう|injury|n
選択|せんたく|choice; selection|n
選択肢|せんたくし|choice; option|n
秀でる|ひいでる|to excel|v1
特徴的|とくちょうてき|characteristic|adj-na
象徴|しょうちょう|symbol|n
徴収|ちょうしゅう|collection (of fees)|n
弾|たま|bullet|n
爆弾|ばくだん|bomb|n
補償|ほしょう|compensation|n
賠償金|ばいしょうきん|compensation money|n
成功者|せいこうしゃ|successful person|n
功績|こうせき|achievement; merit|n
根拠地|こんきょち|base (of operations)|n
拠点|きょてん|base; foothold|n
秘書|ひしょ|secretary|n
神秘|しんぴ|mystery|n
拒否|きょひ|refusal|n
拒む|こばむ|to refuse|v5
刑事|けいじ|detective; criminal (case)|n
刑罰|けいばつ|punishment; penalty|n
塚|つか|mound|n
致命的|ちめいてき|fatal|adj-na
一致|いっち|agreement; match|n
尾|お|tail|n
尾行|びこう|tailing; shadowing|n
描写力|びょうしゃりょく|descriptive power|n
鈴|すず|bell|n
風鈴|ふうりん|wind chime|n
基盤|きばん|foundation; base|n
円盤|えんばん|disk|n
項目|こうもく|item; heading|n
事項|じこう|matter; item|n
喪失|そうしつ|loss|n
喪服|もふく|mourning dress|n
養成|ようせい|training; cultivation|n
教養|きょうよう|culture; education|n
懸念|けねん|concern; worry|n
懸命|けんめい|eager; earnest|adj-na
懸かる|かかる|to hang; to be at stake|v5
街角|まちかど|street corner|n
街頭|がいとう|street (public)|n
契機|けいき|opportunity; trigger|n
契約書|けいやくしょ|contract (document)|n
掲示板|けいじばん|bulletin board|n
飛躍|ひやく|leap; rapid progress|n
躍る|おどる|to leap; to throb|v5
放棄|ほうき|abandonment; renunciation|n
棄権|きけん|abstention; withdrawal|n
邸宅|ていたく|mansion|n
官邸|かんてい|official residence|n
戸籍|こせき|family register|n
縮める|ちぢめる|to shorten|v1
圧縮|あっしゅく|compression|n
# --- Units 19-24
返還|へんかん|return; restoration|n
還元|かんげん|reduction; return (to source)|n
所属|しょぞく|affiliation|n
属する|ぞくする|to belong to|vs
金属|きんぞく|metal|n
遠慮がち|えんりょがち|reserved; hesitant|adj-na
枠|わく|frame; limit|n
枠組み|わくぐみ|framework|n
露出|ろしゅつ|exposure|n
暴露|ばくろ|exposure; disclosure|n
露|つゆ|dew|n
沖|おき|open sea; offshore|n
沖縄|おきなわ|Okinawa|n
緩やか|ゆるやか|gentle; gradual|adj-na
緩和|かんわ|relaxation; easing|n
需要|じゅよう|demand|n
必需品|ひつじゅひん|necessities|n
反射|はんしゃ|reflection|n
射る|いる|to shoot (an arrow)|v1
購入|こうにゅう|purchase|n
購買力|こうばいりょく|purchasing power|n
指揮|しき|command; conducting|n
充実感|じゅうじつかん|sense of fulfilment|n
充電|じゅうでん|charging (a battery)|n
充分|じゅうぶん|sufficient|adj-na
跡|あと|trace; mark|n
遺跡|いせき|ruins; historical site|n
足跡|あしあと|footprint|n
貢献度|こうけんど|degree of contribution|n
鹿|しか|deer|n
鹿児島|かごしま|Kagoshima|n
却下|きゃっか|rejection; dismissal|n
極端|きょくたん|extreme|adj-na
端|はし|edge; end|n
先端|せんたん|tip; cutting edge|n
獲る|える|to obtain; to catch|v1
郡|ぐん|district; county|n
合併|がっぺい|merger|n
併せる|あわせる|to put together; to combine|v1
徹底的|てっていてき|thorough|adj-na
徹夜明け|てつやあけ|morning after an all-nighter|n
貴重品|きちょうひん|valuables|n
貴族|きぞく|aristocrat|n
衝動|しょうどう|impulse|n
焦点|しょうてん|focus|n
奪う|うばう|to snatch; to rob|v5
争奪|そうだつ|scramble; contest|n
災難|さいなん|misfortune; calamity|n
火災|かさい|fire (disaster)|n
浦|うら|inlet; bay|n
解析|かいせき|analysis|n
譲歩|じょうほ|concession|n
名称|めいしょう|name; title|n
称する|しょうする|to call; to claim|vs
称賛|しょうさん|praise|n
納税|のうぜい|tax payment|n
納期|のうき|delivery date|n
樹木|じゅもく|trees|n
樹立|じゅりつ|establishment|n
挑む|いどむ|to challenge|v5
挑戦者|ちょうせんしゃ|challenger|n
誘導|ゆうどう|guidance; induction|n
紛争|ふんそう|dispute; conflict|n
紛れる|まぎれる|to be mixed in; to be diverted|v1
紛らわしい|まぎらわしい|confusing; misleading|adj-i
至る|いたる|to reach; to lead to|v5
至急|しきゅう|urgent|n
宗教|しゅうきょう|religion|n
宗派|しゅうは|sect; denomination|n
促す|うながす|to urge; to prompt|v5
催促|さいそく|urging; pressing|n
慎む|つつしむ|to refrain; to be careful|v5
控える|ひかえる|to refrain; to note down|v1
控室|ひかえしつ|waiting room|n
握手|あくしゅ|handshake|n
俊敏|しゅんびん|quick; agile|adj-na
銭|ぜに|money; coin|n
金銭|きんせん|money|n
渋い|しぶい|astringent; tasteful; sullen|adj-i
渋滞|じゅうたい|traffic jam|n
渋る|しぶる|to be reluctant|v5
銃|じゅう|gun|n
拳銃|けんじゅう|pistol|n
携わる|たずさわる|to be engaged in|v5
提携先|ていけいさき|partner (company)|n
診る|みる|to examine (a patient)|v1
診療|しんりょう|medical treatment|n
委託|いたく|consignment; entrusting|n
託す|たくす|to entrust|v5
# --- Units 25-30
撮影|さつえい|photographing; filming|n
誕生|たんじょう|birth|n
侵入|しんにゅう|intrusion|n
侵害|しんがい|infringement; violation|n
侵す|おかす|to invade; to infringe|v5
括弧|かっこ|parentheses|n
一括|いっかつ|lump sum; all at once|n
包括的|ほうかつてき|comprehensive|adj-na
掛け算|かけざん|multiplication|n
手掛かり|てがかり|clue|n
謝罪|しゃざい|apology|n
感謝状|かんしゃじょう|letter of thanks|n
孝行|こうこう|filial piety|n
親孝行|おやこうこう|filial devotion|n
駆け込む|かけこむ|to rush in|v5
先駆者|せんくしゃ|pioneer|n
透明感|とうめいかん|transparency; clarity|n
透ける|すける|to be transparent|v1
浸透|しんとう|permeation; penetration|n
津波警報|つなみけいほう|tsunami warning|n
津|つ|harbour; Tsu|n
稲|いね|rice plant|n
稲作|いなさく|rice cultivation|n
裂ける|さける|to split; to tear|v1
分裂|ぶんれつ|split; division|n
機敏|きびん|quick; agile|adj-na
是正|ぜせい|correction; rectification|n
排除|はいじょ|exclusion; removal|n
排出|はいしゅつ|emission; discharge|n
排水|はいすい|drainage|n
裕福|ゆうふく|wealthy|adj-na
余裕|よゆう|leeway; margin|n
堅い|かたい|hard; firm; reliable|adj-i
堅実|けんじつ|steady; sound|adj-na
中堅|ちゅうけん|mid-level; backbone|n
通訳者|つうやくしゃ|interpreter|n
訳す|やくす|to translate|v5
芝|しば|lawn; turf|n
芝居|しばい|play; drama|n
芝生|しばふ|lawn|n
綱|つな|rope; cable|n
綱引き|つなひき|tug of war|n
要綱|ようこう|outline; guidelines|n
典型的|てんけいてき|typical|adj-na
古典|こてん|classics|n
祝賀|しゅくが|celebration|n
年賀状|ねんがじょう|New Year's card|n
取り扱い|とりあつかい|handling; treatment|n
顧みる|かえりみる|to look back on; to reflect|v1
顧問|こもん|adviser|n
訴訟費用|そしょうひよう|litigation costs|n
警戒|けいかい|vigilance; caution|n
戒める|いましめる|to warn; to admonish|v1
福祉施設|ふくししせつ|welfare facility|n
名誉|めいよ|honour|n
誉れ|ほまれ|honour; glory|n
歓迎会|かんげいかい|welcome party|n
歓声|かんせい|cheer; shout of joy|n
奏でる|かなでる|to play (an instrument)|v1
勧告|かんこく|recommendation; advice|n
勧誘|かんゆう|solicitation; recruitment|n
騒音|そうおん|noise|n
騒動|そうどう|disturbance; uproar|n
財閥|ざいばつ|financial conglomerate|n
甲|こう|shell; back of the hand; first|n
甲板|かんぱん|deck (of a ship)|n
縄|なわ|rope|n
縄張り|なわばり|territory; turf|n
郷土|きょうど|hometown; local|n
免許|めんきょ|licence|n
免除|めんじょ|exemption|n
免れる|まぬがれる|to escape; to avoid|v1
既に|すでに|already|adv
既存|きぞん|existing|n
既婚|きこん|married|n
推薦状|すいせんじょう|letter of recommendation|n
隣接|りんせつ|adjacency|n
近隣|きんりん|neighbourhood|n
中華|ちゅうか|Chinese (cuisine)|n
範囲外|はんいがい|out of range|n
規範|きはん|norm; standard|n
道徳的|どうとくてき|moral|adj-na
徳|とく|virtue|n
哲学|てつがく|philosophy|n
杉|すぎ|cedar|n
里|さと|village; hometown|n
里帰り|さとがえり|returning to one's parents' home|n
釈明|しゃくめい|explanation; vindication|n
自己|じこ|self|n
利己的|りこてき|selfish|adj-na
`;

export const VOCAB = VOCAB1 + VOCAB2 + VOCAB3 + VOCAB4;
