// N2 vocabulary source, part 1 (beyond N5–N3), grouped by the kanji units. surface|reading|meaning|pos
// Readings and meanings are verified against JMdict by check-vocab.mjs.
import { VOCAB2 } from './n2-vocab-src-2.mjs';
import { VOCAB3 } from './n2-vocab-src-3.mjs';

const VOCAB1 = `
# --- Units 1-6: age, surroundings, crossing, treatment, people, reliance, marriage
歳月|さいげつ|time; years|n
二十歳|はたち|twenty years old|n
与党|よとう|ruling party|n
違反|いはん|violation|n
間違い|まちがい|mistake|n
環境問題|かんきょうもんだい|environmental problem|n
循環|じゅんかん|circulation; cycle|n
欧米|おうべい|Europe and America; the West|n
被害者|ひがいしゃ|victim|n
渡航|とこう|voyage; travelling abroad|n
含有|がんゆう|containing|n
不況|ふきょう|recession|n
突然|とつぜん|suddenly|adv
衝突|しょうとつ|collision; conflict|n
湾|わん|bay; gulf|n
捜査|そうさ|criminal investigation|n
超過|ちょうか|excess|n
治療|ちりょう|medical treatment|n
医療|いりょう|medical care|n
逮捕|たいほ|arrest|n
介護|かいご|nursing care|n
紹介状|しょうかいじょう|letter of introduction|n
歓迎|かんげい|welcome|n
迎え|むかえ|meeting; going to pick someone up|n
販売|はんばい|sales; selling|n
自動販売機|じどうはんばいき|vending machine|n
幅|はば|width|n
彼ら|かれら|they|n
一般的|いっぱんてき|general; typical|adj-na
全般|ぜんぱん|the whole; in general|n
舞台|ぶたい|stage|n
転換|てんかん|conversion; switch|n
占める|しめる|to occupy; to account for|v1
占い|うらない|fortune-telling|n
信頼|しんらい|trust; reliance|n
依頼|いらい|request; commission|n
用途|ようと|use; purpose|n
抜く|ぬく|to pull out; to omit|v5
抜ける|ぬける|to come out; to fall out|v1
爆発|ばくはつ|explosion|n
普及|ふきゅう|spread; popularisation|n
普段|ふだん|usual; everyday|n
改善|かいぜん|improvement|n
善意|ぜんい|good intentions|n
結婚式|けっこんしき|wedding ceremony|n
離婚|りこん|divorce|n
厚生|こうせい|welfare; public welfare|n
高齢|こうれい|advanced age|n
高齢化|こうれいか|ageing (of a population)|n
範囲|はんい|range; scope|n
# --- Units 7-12: graduation, ranks, finishing, orders, recruiting, building
戦略|せんりゃく|strategy|n
承知|しょうち|consent; knowledge|n
承認|しょうにん|approval; recognition|n
浮く|うく|to float|v5
絶える|たえる|to die out; to cease|v1
上級|じょうきゅう|advanced level|n
高級|こうきゅう|high class|adj-na
岩|いわ|rock|n
練習試合|れんしゅうじあい|practice match|n
訓練|くんれん|training|n
押さえる|おさえる|to hold down; to press|v1
完了|かんりょう|completion|n
了解|りょうかい|understanding; roger|n
県庁|けんちょう|prefectural office|n
平等|びょうどう|equality|adj-na
等しい|ひとしい|equal; equivalent|adj-i
救う|すくう|to rescue; to save|v5
救急車|きゅうきゅうしゃ|ambulance|n
層|そう|layer; stratum|n
高層|こうそう|high-rise|n
出版|しゅっぱん|publication|n
版|はん|edition; version|n
老人|ろうじん|elderly person|n
老化|ろうか|ageing|n
角度|かくど|angle|n
四角い|しかくい|square|adj-i
連絡先|れんらくさき|contact address|n
損|そん|loss; disadvantage|adj-na
損害|そんがい|damage; loss|n
募集|ぼしゅう|recruitment; collection|n
募金|ぼきん|fund-raising|n
作曲|さっきょく|composition (music)|n
裏側|うらがわ|the back; the other side|n
支払い|しはらい|payment|n
払い戻す|はらいもどす|to refund|v5
家庭的|かていてき|homely; domestic|adj-na
徒歩|とほ|walking; going on foot|n
仏教|ぶっきょう|Buddhism|n
業績|ぎょうせき|achievement; business performance|n
建築|けんちく|architecture; construction|n
築く|きずく|to build; to establish|v5
貨物|かもつ|cargo; freight|n
通貨|つうか|currency|n
志望|しぼう|wish; aspiration|n
意志|いし|will; volition|n
混雑|こんざつ|congestion; crowding|n
混乱|こんらん|confusion; chaos|n
# --- Units 13-18: rising, invitations, magazines, renewal, crime, wishes
上昇|じょうしょう|rise; ascent|n
血液|けつえき|blood|n
出血|しゅっけつ|bleeding|n
遅れ|おくれ|delay|n
居間|いま|living room|n
住居|じゅうきょ|dwelling; residence|n
温暖|おんだん|warm; mild|adj-na
季節|きせつ|season|n
四季|しき|the four seasons|n
永遠|えいえん|eternity|n
永久|えいきゅう|permanent; eternal|n
著者|ちょしゃ|author|n
著しい|いちじるしい|remarkable; striking|adj-i
日誌|にっし|journal; log|n
車庫|しゃこ|garage|n
金庫|きんこ|safe; vault|n
朝刊|ちょうかん|morning paper|n
週刊誌|しゅうかんし|weekly magazine|n
現像|げんぞう|developing (film)|n
香り|かおり|fragrance|n
香水|こうすい|perfume|n
欠点|けってん|fault; weak point|n
欠ける|かける|to be lacking; to chip|v1
変更|へんこう|change; modification|n
更新|こうしん|renewal; update|n
坂道|さかみち|hill road|n
時刻|じこく|time; point in time|n
深刻|しんこく|serious; grave|adj-na
底|そこ|bottom|n
徹底|てってい|thoroughness|n
賛成者|さんせいしゃ|supporter|n
犯罪|はんざい|crime|n
犯人|はんにん|culprit|n
布|ぬの|cloth|n
恐ろしい|おそろしい|terrible; dreadful|adj-i
恐縮|きょうしゅく|feeling obliged; sorry to trouble you|n
休息|きゅうそく|rest|n
巨大|きょだい|huge; gigantic|adj-na
願い|ねがい|wish; request|n
希望者|きぼうしゃ|applicant|n
越える|こえる|to cross; to exceed|v1
引っ越し|ひっこし|moving house|n
# --- Units 19-24: desire, mail, likeness, searching, dreams, wages
欲しがる|ほしがる|to want (third person)|v5
欲望|よくぼう|desire|n
痛み|いたみ|pain|n
頭痛|ずつう|headache|n
依存|いぞん|dependence|n
汚れる|よごれる|to get dirty|v1
笑顔|えがお|smiling face|n
お互い|おたがい|each other|n
複数|ふくすう|plural; several|n
郵便|ゆうびん|mail; post|n
約束事|やくそくごと|promise; agreement|n
束|たば|bundle|n
仲間|なかま|companion; colleague|n
仲良し|なかよし|close friend|n
仲|なか|relationship|n
繁栄|はんえい|prosperity|n
札|さつ|banknote|n
改札|かいさつ|ticket gate|n
似合う|にあう|to suit|v5
知恵|ちえ|wisdom|n
板|いた|board; plank|n
列|れつ|row; line; queue|n
行列|ぎょうれつ|queue; procession|n
列車|れっしゃ|train|n
探検|たんけん|exploration|n
季節的|きせつてき|seasonal|adj-na
骨折|こっせつ|bone fracture|n
傾向|けいこう|tendency|n
迷惑|めいわく|trouble; nuisance|n
夢中|むちゅう|absorbed in; crazy about|adj-na
巻く|まく|to wind; to roll|v5
君|きみ|you (familiar)|pn
燃やす|もやす|to burn (something)|v5
燃料|ねんりょう|fuel|n
一緒|いっしょ|together|n
運賃|うんちん|fare|n
折る|おる|to fold; to break|v5
折れる|おれる|to break; to give in|v1
雇用|こよう|employment|n
# --- Units 25-30: daily life, organs, thin groups, weather, purity, comfort
暮らし|くらし|life; living|n
替える|かえる|to replace; to exchange|v1
着替える|きがえる|to change clothes|v1
両替|りょうがえ|currency exchange|n
預ける|あずける|to entrust; to deposit|v1
預かる|あずかる|to look after; to take charge of|v5
焼ける|やける|to be burnt; to be baked|v1
簡潔|かんけつ|concise|adj-na
内臓|ないぞう|internal organs|n
心臓|しんぞう|heart (organ)|n
規律|きりつ|discipline; rules|n
贈る|おくる|to give (a present)|v5
照明|しょうめい|illumination; lighting|n
日本酒|にほんしゅ|sake|n
酒|さけ|alcohol; sake|n
薄める|うすめる|to dilute|v1
群れ|むれ|group; flock|n
悲劇|ひげき|tragedy|n
秒|びょう|second (time)|n
操作|そうさ|operation; handling|n
体操|たいそう|gymnastics|n
缶詰|かんづめ|canned food|n
双子|ふたご|twins|n
到達|とうたつ|reaching; attainment|n
仮|かり|temporary; provisional|n
仮定|かてい|assumption; supposition|n
純粋|じゅんすい|pure; genuine|adj-na
強盗|ごうとう|robbery; robber|n
吸収|きゅうしゅう|absorption|n
看板|かんばん|signboard|n
翌日|よくじつ|the next day|n
翌年|よくねん|the following year|n
陽気|ようき|cheerful; weather|adj-na
快適|かいてき|comfortable; pleasant|adj-na
快晴|かいせい|clear sky|n
片方|かたほう|one side; one of a pair|n
尊敬|そんけい|respect|n
敬語|けいご|honorific language|n
悩み|なやみ|worry; trouble|n
泉|いずみ|spring; fountain|n
# --- Units 31-36: honour, skin, teeth, snow, treasure, mistakes, fields
御飯|ごはん|cooked rice; meal|n
制御|せいぎょ|control|n
皮|かわ|skin; peel; leather|n
皮膚|ひふ|skin|n
漁業|ぎょぎょう|fishing industry|n
漁師|りょうし|fisherman|n
荒い|あらい|rough; wild|adj-i
貯蔵|ちょぞう|storage|n
歯科|しか|dentistry|n
柱|はしら|pillar|n
袋|ふくろ|bag; sack|n
手袋|てぶくろ|gloves|n
大雪|おおゆき|heavy snow|n
筆|ふで|writing brush|n
筆者|ひっしゃ|writer; author|n
教訓|きょうくん|lesson; moral|n
入浴|にゅうよく|bathing|n
童話|どうわ|fairy tale|n
宝|たから|treasure|n
宝石|ほうせき|jewel; gem|n
胸|むね|chest; breast|n
誤り|あやまり|error|n
誤解|ごかい|misunderstanding|n
腕時計|うでどけい|wristwatch|n
比較的|ひかくてき|comparatively|adv
兆|ちょう|trillion|num
畑|はたけ|field (for crops)|n
習慣的|しゅうかんてき|habitual|adj-na
毛|け|hair; fur|n
尊重|そんちょう|respect; esteem|n
祝う|いわう|to celebrate|v5
祝日|しゅくじつ|national holiday|n
お祝い|おいわい|celebration|n
# --- Units 37-42: rites, liquids, swimming, colours, digging, sounds
礼儀|れいぎ|manners; courtesy|n
お礼|おれい|thanks; gratitude|n
窓口|まどぐち|counter; window (service)|n
液体|えきたい|liquid|n
貧乏|びんぼう|poverty|adj-na
衣服|いふく|clothes|n
衣類|いるい|clothing|n
零|れい|zero|n
乾杯|かんぱい|toast; cheers|n
甘やかす|あまやかす|to spoil (a child)|v5
大臣|だいじん|minister (government)|n
掃く|はく|to sweep|v5
皆|みんな|everyone|n
柔軟|じゅうなん|flexible|adj-na
沈む|しずむ|to sink|v5
冷凍|れいとう|freezing|n
腹|はら|belly; stomach|n
煙|けむり|smoke|n
煙草|たばこ|tobacco; cigarette|n
恋|こい|romantic love|n
恋人|こいびと|lover; sweetheart|n
# --- Units 43-48: crimson, sleep, lakes, printing, tears, paint
紅葉|こうよう|autumn leaves|n
口紅|くちべに|lipstick|n
郊外|こうがい|suburbs|n
炭|すみ|charcoal|n
石炭|せきたん|coal|n
喫煙|きつえん|smoking|n
干す|ほす|to dry|v5
頂上|ちょうじょう|summit|n
鉱山|こうざん|mine|n
孫|まご|grandchild|n
軒|のき|eaves|n
毒|どく|poison|n
# --- Units 49-54: ice, powder, copper, skin, lamps, names
乾燥|かんそう|dryness|n
棒|ぼう|stick; pole|n
祈る|いのる|to pray|v5
髪の毛|かみのけ|hair (on the head)|n
粉|こな|powder; flour|n
綿|わた|cotton|n
才能|さいのう|talent|n
天才|てんさい|genius|n
銅|どう|copper|n
湿気|しっけ|humidity; moisture|n
脂肪|しぼう|fat|n
蒸し暑い|むしあつい|humid and hot|adj-i
蒸気|じょうき|steam|n
耕す|たがやす|to plough; to till|v5
恥|はじ|shame|n
泥|どろ|mud|n
隅|すみ|corner; nook|n
灯り|あかり|light; lamp|n
電灯|でんとう|electric light|n
磨く|みがく|to polish; to brush (teeth)|v5
姓|せい|surname|n
筒|つつ|tube; pipe|n
粒|つぶ|grain; drop|n
歌詞|かし|lyrics|n
# --- Units 55-60: stomach, towers, boats, livestock, drops, hiding
洗濯機|せんたくき|washing machine|n
塔|とう|tower; pagoda|n
灰|はい|ash|n
灰色|はいいろ|grey|n
舟|ふね|boat|n
貝|かい|shellfish|n
肯定|こうてい|affirmation|n
家畜|かちく|livestock|n
坊や|ぼうや|little boy|n
挟む|はさむ|to insert; to pinch|v5
曇る|くもる|to become cloudy|v5
水滴|すいてき|drop of water|n
企業|きぎょう|enterprise; company|n
企画|きかく|planning; project|n
株|かぶ|stock; share|n
株式|かぶしき|stocks; shares|n
機嫌|きげん|mood; humour|n
揺れる|ゆれる|to shake; to sway|v1
攻撃|こうげき|attack|n
繰り返す|くりかえす|to repeat|v5
派遣|はけん|dispatch; temporary staff|n
`;

export const VOCAB = VOCAB1 + VOCAB2 + VOCAB3;
