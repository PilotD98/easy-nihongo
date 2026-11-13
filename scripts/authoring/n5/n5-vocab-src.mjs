// N5 vocabulary source. One entry per line: surface|reading|meaning|pos
// pos: n noun, v5 godan verb, v1 ichidan verb, vs suru verb, vk kuru verb, adj-i, adj-na,
//      adv, prt particle, exp expression, num, cnt counter, pn pronoun, int, conj, pre-noun.
// Readings and meanings are verified against JMdict by the build script.
export const VOCAB = `
# --- Pronouns and people
私|わたし|I; me|pn
僕|ぼく|I (male, casual)|pn
あなた|あなた|you|pn
彼|かれ|he; boyfriend|pn
彼女|かのじょ|she; girlfriend|pn
私たち|わたしたち|we|pn
皆さん|みなさん|everyone (polite)|n
みんな|みんな|everyone|n
人|ひと|person|n
男|おとこ|man|n
女|おんな|woman|n
男の人|おとこのひと|man|n
女の人|おんなのひと|woman|n
男の子|おとこのこ|boy|n
女の子|おんなのこ|girl|n
子供|こども|child|n
大人|おとな|adult|n
友達|ともだち|friend|n
家族|かぞく|family|n
父|ちち|(my) father|n
母|はは|(my) mother|n
お父さん|おとうさん|father|n
お母さん|おかあさん|mother|n
兄|あに|(my) older brother|n
姉|あね|(my) older sister|n
弟|おとうと|younger brother|n
妹|いもうと|younger sister|n
お兄さん|おにいさん|older brother|n
お姉さん|おねえさん|older sister|n
おじいさん|おじいさん|grandfather; old man|n
おばあさん|おばあさん|grandmother; old woman|n
おじさん|おじさん|uncle; middle-aged man|n
おばさん|おばさん|aunt; middle-aged woman|n
両親|りょうしん|parents|n
兄弟|きょうだい|siblings|n
夫|おっと|husband|n
妻|つま|wife|n
ご主人|ごしゅじん|(your) husband|n
奥さん|おくさん|(your) wife|n
先生|せんせい|teacher|n
学生|がくせい|student|n
生徒|せいと|pupil|n
留学生|りゅうがくせい|international student|n
医者|いしゃ|doctor|n
警官|けいかん|police officer|n
お巡りさん|おまわりさん|police officer (friendly)|n
店員|てんいん|shop assistant|n
会社員|かいしゃいん|company employee|n
外国人|がいこくじん|foreigner|n
名前|なまえ|name|n
誰|だれ|who|pn
どなた|どなた|who (polite)|pn
# --- Places
家|いえ|house; home|n
うち|うち|home; one's house|n
部屋|へや|room|n
学校|がっこう|school|n
大学|だいがく|university|n
教室|きょうしつ|classroom|n
図書館|としょかん|library|n
会社|かいしゃ|company|n
銀行|ぎんこう|bank|n
郵便局|ゆうびんきょく|post office|n
病院|びょういん|hospital|n
駅|えき|station|n
空港|くうこう|airport|n
店|みせ|shop|n
喫茶店|きっさてん|café|n
レストラン|レストラン|restaurant|n
食堂|しょくどう|dining hall; cafeteria|n
八百屋|やおや|greengrocer|n
本屋|ほんや|bookshop|n
花屋|はなや|flower shop|n
デパート|デパート|department store|n
スーパー|スーパー|supermarket|n
コンビニ|コンビニ|convenience store|n
公園|こうえん|park|n
庭|にわ|garden|n
道|みち|road; way|n
町|まち|town|n
国|くに|country|n
外国|がいこく|foreign country|n
日本|にほん|Japan|n
東京|とうきょう|Tokyo|n
大阪|おおさか|Osaka|n
富士山|ふじさん|Mount Fuji|n
田中|たなか|Tanaka (surname)|n
山|やま|mountain|n
川|かわ|river|n
海|うみ|sea|n
池|いけ|pond|n
森|もり|forest|n
田んぼ|たんぼ|rice paddy|n
木|き|tree|n
花|はな|flower|n
空|そら|sky|n
所|ところ|place|n
場所|ばしょ|place; location|n
入口|いりぐち|entrance|n
出口|でぐち|exit|n
玄関|げんかん|entrance hall|n
台所|だいどころ|kitchen|n
トイレ|トイレ|toilet|n
お手洗い|おてあらい|restroom|n
お風呂|おふろ|bath|n
階段|かいだん|stairs|n
エレベーター|エレベーター|elevator|n
門|もん|gate|n
建物|たてもの|building|n
ビル|ビル|building (office)|n
アパート|アパート|apartment|n
映画館|えいがかん|cinema|n
プール|プール|swimming pool|n
交番|こうばん|police box|n
ホテル|ホテル|hotel|n
# --- Positions and directions
上|うえ|above; on top|n
下|した|below; under|n
中|なか|inside|n
外|そと|outside|n
前|まえ|front; before|n
後ろ|うしろ|behind|n
右|みぎ|right|n
左|ひだり|left|n
隣|となり|next to; neighbour|n
横|よこ|side; beside|n
近く|ちかく|nearby|n
間|あいだ|between; interval|n
東|ひがし|east|n
西|にし|west|n
南|みなみ|south|n
北|きた|north|n
ここ|ここ|here|pn
そこ|そこ|there|pn
あそこ|あそこ|over there|pn
どこ|どこ|where|pn
こちら|こちら|this way; this person (polite)|pn
そちら|そちら|that way|pn
あちら|あちら|that way over there|pn
どちら|どちら|which way; which (of two)|pn
これ|これ|this|pn
それ|それ|that|pn
あれ|あれ|that over there|pn
どれ|どれ|which one|pn
この|この|this (noun)|pre-noun
その|その|that (noun)|pre-noun
あの|あの|that (noun) over there|pre-noun
どの|どの|which (noun)|pre-noun
# --- Time
今|いま|now|n
今日|きょう|today|n
明日|あした|tomorrow|n
昨日|きのう|yesterday|n
今朝|けさ|this morning|n
今晩|こんばん|tonight|n
今週|こんしゅう|this week|n
来週|らいしゅう|next week|n
先週|せんしゅう|last week|n
今月|こんげつ|this month|n
来月|らいげつ|next month|n
先月|せんげつ|last month|n
今年|ことし|this year|n
来年|らいねん|next year|n
去年|きょねん|last year|n
毎日|まいにち|every day|n
毎朝|まいあさ|every morning|n
毎晩|まいばん|every evening|n
毎週|まいしゅう|every week|n
毎月|まいつき|every month|n
毎年|まいとし|every year|n
朝|あさ|morning|n
昼|ひる|noon; daytime|n
晩|ばん|evening|n
夜|よる|night|n
午前|ごぜん|a.m.; morning|n
午後|ごご|p.m.; afternoon|n
時間|じかん|time; hour|n
時|とき|time; when|n
分|ふん|minute|n
半|はん|half|n
週|しゅう|week|n
週末|しゅうまつ|weekend|n
月|つき|month; moon|n
年|とし|year; age|n
日|ひ|day; sun|n
月曜日|げつようび|Monday|n
火曜日|かようび|Tuesday|n
水曜日|すいようび|Wednesday|n
木曜日|もくようび|Thursday|n
金曜日|きんようび|Friday|n
土曜日|どようび|Saturday|n
日曜日|にちようび|Sunday|n
春|はる|spring|n
夏|なつ|summer|n
秋|あき|autumn|n
冬|ふゆ|winter|n
誕生日|たんじょうび|birthday|n
休み|やすみ|holiday; rest; day off|n
夏休み|なつやすみ|summer holiday|n
いつ|いつ|when|pn
一日|ついたち|first day of the month|n
二日|ふつか|second day; two days|n
三日|みっか|third day; three days|n
四日|よっか|fourth day; four days|n
五日|いつか|fifth day; five days|n
六日|むいか|sixth day; six days|n
七日|なのか|seventh day; seven days|n
八日|ようか|eighth day; eight days|n
九日|ここのか|ninth day; nine days|n
十日|とおか|tenth day; ten days|n
二十日|はつか|twentieth day; twenty days|n
# --- Numbers and counters
零|ゼロ|zero|num
一|いち|one|num
二|に|two|num
三|さん|three|num
四|よん|four|num
五|ご|five|num
六|ろく|six|num
七|なな|seven|num
八|はち|eight|num
九|きゅう|nine|num
十|じゅう|ten|num
百|ひゃく|hundred|num
千|せん|thousand|num
万|まん|ten thousand|num
一つ|ひとつ|one (thing)|num
二つ|ふたつ|two (things)|num
三つ|みっつ|three (things)|num
四つ|よっつ|four (things)|num
五つ|いつつ|five (things)|num
六つ|むっつ|six (things)|num
七つ|ななつ|seven (things)|num
八つ|やっつ|eight (things)|num
九つ|ここのつ|nine (things)|num
十|とお|ten (things)|num
一人|ひとり|one person; alone|n
二人|ふたり|two people|n
一番|いちばん|number one; the most|n
円|えん|yen|n
歳|さい|years old (counter)|cnt
時|じ|o'clock (counter)|cnt
枚|まい|counter for flat things|cnt
冊|さつ|counter for books|cnt
台|だい|counter for machines|cnt
階|かい|floor (of a building)|cnt
回|かい|times (occurrences)|cnt
匹|ひき|counter for small animals|cnt
個|こ|counter for small items|cnt
人|にん|counter for people|cnt
番|ばん|number (in a series)|cnt
半分|はんぶん|half|n
# --- Food and drink
食べ物|たべもの|food|n
飲み物|のみもの|drink|n
ご飯|ごはん|cooked rice; meal|n
朝ご飯|あさごはん|breakfast|n
昼ご飯|ひるごはん|lunch|n
晩ご飯|ばんごはん|dinner|n
パン|パン|bread|n
卵|たまご|egg|n
肉|にく|meat|n
魚|さかな|fish|n
野菜|やさい|vegetable|n
果物|くだもの|fruit|n
牛肉|ぎゅうにく|beef|n
豚肉|ぶたにく|pork|n
鶏肉|とりにく|chicken (meat)|n
塩|しお|salt|n
砂糖|さとう|sugar|n
醤油|しょうゆ|soy sauce|n
お茶|おちゃ|tea|n
紅茶|こうちゃ|black tea|n
コーヒー|コーヒー|coffee|n
牛乳|ぎゅうにゅう|milk|n
水|みず|water|n
お酒|おさけ|alcohol; sake|n
ビール|ビール|beer|n
ジュース|ジュース|juice|n
お菓子|おかし|sweets; snacks|n
りんご|りんご|apple|n
バナナ|バナナ|banana|n
みかん|みかん|mandarin orange|n
カレー|カレー|curry|n
料理|りょうり|cooking; dish|n
お弁当|おべんとう|boxed lunch|n
# --- Things, objects, clothes
物|もの|thing|n
本|ほん|book|n
雑誌|ざっし|magazine|n
新聞|しんぶん|newspaper|n
辞書|じしょ|dictionary|n
手紙|てがみ|letter|n
葉書|はがき|postcard|n
切手|きって|stamp|n
封筒|ふうとう|envelope|n
紙|かみ|paper|n
鉛筆|えんぴつ|pencil|n
ペン|ペン|pen|n
ボールペン|ボールペン|ballpoint pen|n
消しゴム|けしゴム|eraser|n
ノート|ノート|notebook|n
かばん|かばん|bag|n
財布|さいふ|wallet|n
時計|とけい|clock; watch|n
眼鏡|めがね|glasses|n
傘|かさ|umbrella|n
鍵|かぎ|key|n
写真|しゃしん|photograph|n
カメラ|カメラ|camera|n
電話|でんわ|telephone|n
テレビ|テレビ|television|n
ラジオ|ラジオ|radio|n
パソコン|パソコン|personal computer|n
机|つくえ|desk|n
椅子|いす|chair|n
窓|まど|window|n
ドア|ドア|door|n
戸|と|door (sliding)|n
壁|かべ|wall|n
箱|はこ|box|n
荷物|にもつ|luggage|n
服|ふく|clothes|n
洋服|ようふく|Western clothes|n
シャツ|シャツ|shirt|n
ズボン|ズボン|trousers|n
スカート|スカート|skirt|n
靴|くつ|shoes|n
靴下|くつした|socks|n
帽子|ぼうし|hat|n
コート|コート|coat|n
セーター|セーター|sweater|n
ネクタイ|ネクタイ|necktie|n
ポケット|ポケット|pocket|n
ハンカチ|ハンカチ|handkerchief|n
石鹸|せっけん|soap|n
タバコ|タバコ|cigarette; tobacco|n
薬|くすり|medicine|n
お金|おかね|money|n
切符|きっぷ|ticket|n
地図|ちず|map|n
絵|え|picture; painting|n
花瓶|かびん|vase|n
電気|でんき|electricity; light|n
ストーブ|ストーブ|heater|n
冷蔵庫|れいぞうこ|refrigerator|n
テーブル|テーブル|table|n
ベッド|ベッド|bed|n
本棚|ほんだな|bookshelf|n
皿|さら|plate|n
茶碗|ちゃわん|rice bowl|n
コップ|コップ|glass; cup|n
カップ|カップ|cup|n
箸|はし|chopsticks|n
スプーン|スプーン|spoon|n
フォーク|フォーク|fork|n
ナイフ|ナイフ|knife|n
# --- Transport
車|くるま|car|n
自動車|じどうしゃ|automobile|n
自転車|じてんしゃ|bicycle|n
電車|でんしゃ|train|n
地下鉄|ちかてつ|subway|n
バス|バス|bus|n
タクシー|タクシー|taxi|n
飛行機|ひこうき|airplane|n
船|ふね|ship; boat|n
# --- Body and health
体|からだ|body|n
頭|あたま|head|n
顔|かお|face|n
目|め|eye|n
耳|みみ|ear|n
鼻|はな|nose|n
口|くち|mouth|n
歯|は|tooth|n
手|て|hand|n
足|あし|foot; leg|n
お腹|おなか|stomach; belly|n
背|せ|height; back|n
声|こえ|voice|n
力|ちから|strength; power|n
病気|びょうき|illness|n
風邪|かぜ|a cold|n
熱|ねつ|fever|n
# --- Nature, weather, animals
天気|てんき|weather|n
雨|あめ|rain|n
雪|ゆき|snow|n
風|かぜ|wind|n
晴れ|はれ|clear weather|n
曇り|くもり|cloudy weather|n
犬|いぬ|dog|n
猫|ねこ|cat|n
鳥|とり|bird|n
動物|どうぶつ|animal|n
# --- Study and work
日本語|にほんご|Japanese language|n
英語|えいご|English language|n
外国語|がいこくご|foreign language|n
言葉|ことば|word; language|n
字|じ|character; letter|n
漢字|かんじ|kanji|n
平仮名|ひらがな|hiragana|n
片仮名|かたかな|katakana|n
文章|ぶんしょう|sentence; text|n
質問|しつもん|question|n
問題|もんだい|problem; question|n
答え|こたえ|answer|n
意味|いみ|meaning|n
宿題|しゅくだい|homework|n
試験|しけん|exam|n
テスト|テスト|test|n
授業|じゅぎょう|class; lesson|n
クラス|クラス|class|n
練習|れんしゅう|practice|n
勉強|べんきょう|study|n
仕事|しごと|work; job|n
会議|かいぎ|meeting|n
旅行|りょこう|travel|n
買い物|かいもの|shopping|n
散歩|さんぽ|walk; stroll|n
音楽|おんがく|music|n
歌|うた|song|n
映画|えいが|film; movie|n
スポーツ|スポーツ|sports|n
サッカー|サッカー|football|n
テニス|テニス|tennis|n
ギター|ギター|guitar|n
ピアノ|ピアノ|piano|n
パーティー|パーティー|party|n
ニュース|ニュース|news|n
話|はなし|talk; story|n
番号|ばんごう|number|n
住所|じゅうしょ|address|n
お土産|おみやげ|souvenir|n
プレゼント|プレゼント|present|n
方|ほう|direction; side (comparison)|n
方|かた|person (polite)|n
用事|ようじ|errand; business|n
色|いろ|colour|n
赤|あか|red|n
青|あお|blue|n
白|しろ|white|n
黒|くろ|black|n
黄色|きいろ|yellow|n
緑|みどり|green|n
茶色|ちゃいろ|brown|n
形|かたち|shape|n
音|おと|sound|n
# --- Verbs (godan)
行く|いく|to go|v5
帰る|かえる|to return home|v5
買う|かう|to buy|v5
飲む|のむ|to drink|v5
読む|よむ|to read|v5
書く|かく|to write|v5
聞く|きく|to listen; to ask|v5
話す|はなす|to speak; to talk|v5
会う|あう|to meet|v5
待つ|まつ|to wait|v5
持つ|もつ|to hold; to have|v5
使う|つかう|to use|v5
作る|つくる|to make|v5
住む|すむ|to live (reside)|v5
働く|はたらく|to work|v5
休む|やすむ|to rest; to take a day off|v5
泳ぐ|およぐ|to swim|v5
遊ぶ|あそぶ|to play|v5
死ぬ|しぬ|to die|v5
立つ|たつ|to stand|v5
座る|すわる|to sit|v5
入る|はいる|to enter|v5
出す|だす|to take out; to submit|v5
歩く|あるく|to walk|v5
走る|はしる|to run|v5
乗る|のる|to ride; to get on|v5
降る|ふる|to fall (rain, snow)|v5
取る|とる|to take|v5
撮る|とる|to take (a photo)|v5
送る|おくる|to send|v5
洗う|あらう|to wash|v5
歌う|うたう|to sing|v5
吸う|すう|to smoke; to inhale|v5
脱ぐ|ぬぐ|to take off (clothes)|v5
履く|はく|to put on (shoes, trousers)|v5
かぶる|かぶる|to put on (a hat)|v5
切る|きる|to cut|v5
貸す|かす|to lend|v5
返す|かえす|to return (something)|v5
習う|ならう|to learn (from someone)|v5
知る|しる|to know|v5
分かる|わかる|to understand|v5
思う|おもう|to think|v5
言う|いう|to say|v5
終わる|おわる|to end|v5
始まる|はじまる|to begin (intransitive)|v5
困る|こまる|to be troubled|v5
曲がる|まがる|to turn (a corner)|v5
渡る|わたる|to cross|v5
登る|のぼる|to climb|v5
咲く|さく|to bloom|v5
鳴く|なく|to cry (animal)|v5
吹く|ふく|to blow|v5
泊まる|とまる|to stay (overnight)|v5
止まる|とまる|to stop|v5
止める|とめる|to stop (something); to park|v1
要る|いる|to need|v5
売る|うる|to sell|v5
押す|おす|to push|v5
引く|ひく|to pull|v5
弾く|ひく|to play (an instrument)|v5
置く|おく|to put; to place|v5
消す|けす|to turn off; to erase|v5
並ぶ|ならぶ|to line up|v5
頼む|たのむ|to request|v5
なる|なる|to become|v5
ある|ある|to exist (things); to have|v5
いらっしゃる|いらっしゃる|to be; to come; to go (honorific)|v5
# --- Verbs (ichidan)
食べる|たべる|to eat|v1
見る|みる|to see; to watch|v1
起きる|おきる|to get up|v1
寝る|ねる|to sleep; to go to bed|v1
出る|でる|to go out; to leave|v1
いる|いる|to exist (people, animals)|v1
教える|おしえる|to teach; to tell|v1
覚える|おぼえる|to memorise|v1
忘れる|わすれる|to forget|v1
着る|きる|to wear (upper body)|v1
開ける|あける|to open|v1
閉める|しめる|to close|v1
つける|つける|to turn on|v1
消える|きえる|to go out; to disappear|v1
借りる|かりる|to borrow|v1
見せる|みせる|to show|v1
かける|かける|to make (a call); to put on (glasses)|v1
浴びる|あびる|to take (a shower)|v1
上げる|あげる|to give; to raise|v1
入れる|いれる|to put in|v1
出かける|でかける|to go out|v1
疲れる|つかれる|to get tired|v1
降りる|おりる|to get off|v1
始める|はじめる|to begin (transitive)|v1
答える|こたえる|to answer|v1
生まれる|うまれる|to be born|v1
晴れる|はれる|to clear up|v1
並べる|ならべる|to line up (things)|v1
# --- Verbs (irregular and suru)
する|する|to do|vs
来る|くる|to come|vk
勉強する|べんきょうする|to study|vs
散歩する|さんぽする|to take a walk|vs
旅行する|りょこうする|to travel|vs
買い物する|かいものする|to shop|vs
掃除する|そうじする|to clean|vs
洗濯する|せんたくする|to do laundry|vs
結婚する|けっこんする|to marry|vs
練習する|れんしゅうする|to practise|vs
質問する|しつもんする|to ask a question|vs
電話する|でんわする|to phone|vs
料理する|りょうりする|to cook|vs
運転する|うんてんする|to drive|vs
# --- i-adjectives
大きい|おおきい|big|adj-i
小さい|ちいさい|small|adj-i
新しい|あたらしい|new|adj-i
古い|ふるい|old (things)|adj-i
良い|いい|good|adj-i
悪い|わるい|bad|adj-i
高い|たかい|tall; expensive|adj-i
安い|やすい|cheap|adj-i
低い|ひくい|low|adj-i
長い|ながい|long|adj-i
短い|みじかい|short|adj-i
広い|ひろい|wide; spacious|adj-i
狭い|せまい|narrow; cramped|adj-i
重い|おもい|heavy|adj-i
軽い|かるい|light (weight)|adj-i
速い|はやい|fast|adj-i
早い|はやい|early|adj-i
遅い|おそい|late; slow|adj-i
近い|ちかい|near|adj-i
遠い|とおい|far|adj-i
多い|おおい|many; much|adj-i
少ない|すくない|few; little|adj-i
暑い|あつい|hot (weather)|adj-i
熱い|あつい|hot (to the touch)|adj-i
寒い|さむい|cold (weather)|adj-i
冷たい|つめたい|cold (to the touch)|adj-i
暖かい|あたたかい|warm|adj-i
涼しい|すずしい|cool|adj-i
明るい|あかるい|bright|adj-i
暗い|くらい|dark|adj-i
強い|つよい|strong|adj-i
弱い|よわい|weak|adj-i
楽しい|たのしい|fun; enjoyable|adj-i
面白い|おもしろい|interesting; funny|adj-i
つまらない|つまらない|boring|adj-i
難しい|むずかしい|difficult|adj-i
易しい|やさしい|easy|adj-i
忙しい|いそがしい|busy|adj-i
美味しい|おいしい|delicious|adj-i
まずい|まずい|bad-tasting|adj-i
甘い|あまい|sweet|adj-i
辛い|からい|spicy|adj-i
白い|しろい|white|adj-i
黒い|くろい|black|adj-i
赤い|あかい|red|adj-i
青い|あおい|blue|adj-i
黄色い|きいろい|yellow|adj-i
太い|ふとい|thick; fat|adj-i
細い|ほそい|thin; slender|adj-i
若い|わかい|young|adj-i
痛い|いたい|painful|adj-i
汚い|きたない|dirty|adj-i
丸い|まるい|round|adj-i
可愛い|かわいい|cute|adj-i
欲しい|ほしい|wanted; desired|adj-i
ない|ない|not; nonexistent|adj-i
# --- na-adjectives
元気|げんき|healthy; energetic|adj-na
静か|しずか|quiet|adj-na
賑やか|にぎやか|lively|adj-na
綺麗|きれい|pretty; clean|adj-na
有名|ゆうめい|famous|adj-na
親切|しんせつ|kind|adj-na
便利|べんり|convenient|adj-na
不便|ふべん|inconvenient|adj-na
好き|すき|liked; favourite|adj-na
嫌い|きらい|disliked|adj-na
上手|じょうず|skilled|adj-na
下手|へた|unskilled|adj-na
暇|ひま|free (time)|adj-na
大丈夫|だいじょうぶ|all right; OK|adj-na
大変|たいへん|tough; serious|adj-na
大切|たいせつ|important|adj-na
簡単|かんたん|simple|adj-na
立派|りっぱ|splendid|adj-na
色々|いろいろ|various|adj-na
同じ|おなじ|same|adj-na
丈夫|じょうぶ|sturdy; healthy|adj-na
結構|けっこう|fine; splendid|adj-na
# --- Adverbs and question words
とても|とても|very|adv
たくさん|たくさん|a lot|adv
少し|すこし|a little|adv
ちょっと|ちょっと|a little; a moment|adv
よく|よく|often; well|adv
時々|ときどき|sometimes|adv
いつも|いつも|always|adv
もう|もう|already; more|adv
まだ|まだ|still; not yet|adv
また|また|again|adv
すぐ|すぐ|immediately|adv
ゆっくり|ゆっくり|slowly|adv
一緒に|いっしょに|together|adv
全部|ぜんぶ|all|n
大体|だいたい|roughly|adv
本当に|ほんとうに|really|adv
多分|たぶん|probably|adv
どうして|どうして|why|adv
なぜ|なぜ|why|adv
どう|どう|how|adv
どうぞ|どうぞ|please; go ahead|adv
どうも|どうも|thanks; somehow|adv
初めて|はじめて|for the first time|adv
あまり|あまり|not very (with negative)|adv
全然|ぜんぜん|not at all (with negative)|adv
もっと|もっと|more|adv
だんだん|だんだん|gradually|adv
まっすぐ|まっすぐ|straight ahead|adv
先に|さきに|first; ahead|adv
何|なに|what|pn
いくつ|いくつ|how many; how old|n
いくら|いくら|how much|n
どんな|どんな|what kind of|pre-noun
# --- Conjunctions, particles, expressions
そして|そして|and then|conj
それから|それから|after that|conj
でも|でも|but|conj
しかし|しかし|however|conj
だから|だから|so; therefore|conj
では|では|well then|conj
じゃあ|じゃあ|well then (casual)|conj
はい|はい|yes|int
いいえ|いいえ|no|int
ええ|ええ|yes (soft)|int
おはようございます|おはようございます|good morning|exp
こんにちは|こんにちは|hello|exp
こんばんは|こんばんは|good evening|exp
さようなら|さようなら|goodbye|exp
おやすみなさい|おやすみなさい|good night|exp
ありがとうございます|ありがとうございます|thank you|exp
すみません|すみません|excuse me; sorry|exp
ごめんなさい|ごめんなさい|I'm sorry|exp
いただきます|いただきます|said before a meal|exp
ごちそうさま|ごちそうさま|thanks for the meal|exp
いらっしゃいませ|いらっしゃいませ|welcome (to a shop)|exp
お願いします|おねがいします|please|exp
初めまして|はじめまして|nice to meet you|exp
どういたしまして|どういたしまして|you're welcome|exp
お元気ですか|おげんきですか|how are you?|exp
行ってきます|いってきます|I'm off (leaving home)|exp
ただいま|ただいま|I'm home|exp
お休み|おやすみ|good night (casual)|exp
# --- More nouns (daily life)
生活|せいかつ|daily life|n
朝食|ちょうしょく|breakfast|n
昼食|ちゅうしょく|lunch|n
夕食|ゆうしょく|dinner|n
銭湯|せんとう|public bath|n
風呂|ふろ|bath|n
シャワー|シャワー|shower|n
歯ブラシ|はブラシ|toothbrush|n
石|いし|stone|n
土|つち|soil|n
火|ひ|fire|n
空気|くうき|air|n
光|ひかり|light|n
氷|こおり|ice|n
お湯|おゆ|hot water|n
水道|すいどう|water supply; tap water|n
ガス|ガス|gas|n
部屋代|へやだい|room rent|n
値段|ねだん|price|n
お釣り|おつり|change (money)|n
百円|ひゃくえん|one hundred yen|n
人口|じんこう|population|n
世界|せかい|world|n
社会|しゃかい|society|n
歴史|れきし|history|n
文化|ぶんか|culture|n
政治|せいじ|politics|n
経済|けいざい|economy|n
科学|かがく|science|n
数学|すうがく|mathematics|n
医学|いがく|medicine (study)|n
魚屋|さかなや|fishmonger|n
肉屋|にくや|butcher|n
薬屋|くすりや|pharmacy|n
電気屋|でんきや|electronics shop|n
駐車場|ちゅうしゃじょう|car park|n
道路|どうろ|road|n
橋|はし|bridge|n
角|かど|corner|n
信号|しんごう|traffic light|n
交差点|こうさてん|intersection|n
横断歩道|おうだんほどう|pedestrian crossing|n
電車代|でんしゃだい|train fare|n
切符売り場|きっぷうりば|ticket office|n
出発|しゅっぱつ|departure|n
到着|とうちゃく|arrival|n
予約|よやく|reservation|n
注文|ちゅうもん|order (food)|n
お客さん|おきゃくさん|customer; guest|n
趣味|しゅみ|hobby|n
意見|いけん|opinion|n
約束|やくそく|promise; appointment|n
気持ち|きもち|feeling|n
心|こころ|heart; mind|n
夢|ゆめ|dream|n
人生|じんせい|life|n
時代|じだい|era|n
昔|むかし|long ago|n
最近|さいきん|recently|n
今度|こんど|this time; next time|n
次|つぎ|next|n
最初|さいしょ|first; beginning|n
最後|さいご|last; end|n
途中|とちゅう|on the way|n
自分|じぶん|oneself|n
皆|みな|everyone|n
他|ほか|other|n
別|べつ|different; separate|n
以上|いじょう|more than; that is all|n
以下|いか|less than; below|n
# --- Katakana extras
コンピューター|コンピューター|computer|n
インターネット|インターネット|internet|n
メール|メール|email|n
スマホ|スマホ|smartphone|n
ケーキ|ケーキ|cake|n
アイスクリーム|アイスクリーム|ice cream|n
サンドイッチ|サンドイッチ|sandwich|n
ハンバーガー|ハンバーガー|hamburger|n
ピザ|ピザ|pizza|n
サラダ|サラダ|salad|n
スープ|スープ|soup|n
ワイン|ワイン|wine|n
チョコレート|チョコレート|chocolate|n
バター|バター|butter|n
チーズ|チーズ|cheese|n
ミルク|ミルク|milk|n
クラブ|クラブ|club|n
チーム|チーム|team|n
ゲーム|ゲーム|game|n
アニメ|アニメ|anime|n
マンガ|マンガ|manga|n
ドラマ|ドラマ|drama|n
コンサート|コンサート|concert|n
ホームページ|ホームページ|website|n
レポート|レポート|report|n
ページ|ページ|page|n
ボタン|ボタン|button|n
カード|カード|card|n
クレジットカード|クレジットカード|credit card|n
バイト|バイト|part-time job|n
アルバイト|アルバイト|part-time job|n
エアコン|エアコン|air conditioner|n
ドライブ|ドライブ|drive|n
`;
