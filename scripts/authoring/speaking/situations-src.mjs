// Real-world speaking sets: situations a visitor or new resident meets in Japan.
// Lines are written in kana (what the recogniser compares by sound); `alt`
// gives the usual kanji spelling the recogniser may return. Built into
// data/situations.json by build-situations.mjs.
//
// Role-play turn: [who, kana, romaji, en, altKanji?]   who = 'p' (partner) | 'y' (you)
// Shadow / repeat item: [kana, romaji, en, altKanji?]
// Question item: [questionKana, qRomaji, qEn, modelKana, modelRomaji, en, altKanji?]

export const SETS = [
  // ---------- Arrival and transport ----------
  { id: 'spk:real:rp-airport', mode: 'roleplay', level: 'n5', title: 'Airport: immigration and customs', summary: 'The officer asks the three standard questions. Short answers are perfect.', partner: 'Officer',
    tips: ['Keep answers short: purpose, length of stay, where you stay. Nobody expects full sentences.', 'かんこう (sightseeing), しごと (work), りゅうがく (study) cover almost every purpose.'],
    turns: [
      ['p', 'にゅうこくのもくてきはなんですか。', 'nyuukoku no mokuteki wa nan desu ka.', 'What is the purpose of your visit?'],
      ['y', 'かんこうです。', 'kankou desu.', 'Sightseeing.', '観光です。'],
      ['p', 'どのくらいたいざいしますか。', 'dono kurai taizai shimasu ka.', 'How long will you stay?'],
      ['y', 'いっしゅうかんです。', 'isshuukan desu.', 'One week.', '一週間です。'],
      ['p', 'どこにとまりますか。', 'doko ni tomarimasu ka.', 'Where will you be staying?'],
      ['y', 'しんじゅくのホテルです。', 'shinjuku no hoteru desu.', 'A hotel in Shinjuku.', '新宿のホテルです。'],
      ['p', 'しんこくするものはありますか。', 'shinkoku suru mono wa arimasu ka.', 'Anything to declare?'],
      ['y', 'いいえ、ありません。', 'iie, arimasen.', 'No, nothing.'],
      ['p', 'はい、けっこうです。どうぞ。', 'hai, kekkou desu. douzo.', 'That is fine. Go ahead.']
    ] },
  { id: 'spk:real:rp-train', mode: 'roleplay', level: 'n5', title: 'Station: tickets and platforms', summary: 'Buy a ticket at the counter and find the right platform.', partner: 'Staff',
    tips: ['Most people use an IC card (Suica, PASMO): tap in, tap out, no ticket needed.', 'ホーム is a platform; のりかえ is a transfer; かたみち one way, おうふく return.'],
    turns: [
      ['y', 'すみません、きょうとまでかたみちいちまいおねがいします。', 'sumimasen, kyouto made katamichi ichimai onegai shimasu.', 'Excuse me, one one-way ticket to Kyoto, please.', 'すみません、京都まで片道一枚お願いします。'],
      ['p', 'していせきとじゆうせき、どちらにしますか。', 'shiteiseki to jiyuuseki, dochira ni shimasu ka.', 'Reserved or non-reserved seat?'],
      ['y', 'じゆうせきでおねがいします。', 'jiyuuseki de onegai shimasu.', 'Non-reserved, please.', '自由席でお願いします。'],
      ['p', 'はい、いちまんさんぜんえんです。', 'hai, ichiman sanzen en desu.', 'That is 13,000 yen.'],
      ['y', 'カードでいいですか。', 'kaado de ii desu ka.', 'Is card OK?'],
      ['p', 'はい、だいじょうぶです。', 'hai, daijoubu desu.', 'Yes, that is fine.'],
      ['y', 'なんばんせんですか。', 'nanbansen desu ka.', 'Which platform?', '何番線ですか。'],
      ['p', 'じゅうよんばんせんです。あちらのエスカレーターをあがってください。', 'juuyon bansen desu. achira no esukareetaa o agatte kudasai.', 'Platform 14. Take that escalator up.'],
      ['y', 'ありがとうございます。', 'arigatou gozaimasu.', 'Thank you.']
    ] },
  { id: 'spk:real:rp-taxi', mode: 'roleplay', level: 'n5', title: 'Taxi', summary: 'Give a destination, ask the fare, pay.', partner: 'Driver',
    tips: ['Doors open and close automatically; do not touch them.', 'Showing the address on your phone is normal and welcome.'],
    turns: [
      ['p', 'どちらまでですか。', 'dochira made desu ka.', 'Where to?'],
      ['y', 'とうきょうえきまでおねがいします。', 'toukyou eki made onegai shimasu.', 'To Tokyo Station, please.', '東京駅までお願いします。'],
      ['p', 'はい、わかりました。', 'hai, wakarimashita.', 'Certainly.'],
      ['y', 'どのくらいかかりますか。', 'dono kurai kakarimasu ka.', 'How long will it take?'],
      ['p', 'にじゅっぷんくらいですね。', 'nijuppun kurai desu ne.', 'About twenty minutes.'],
      ['y', 'ここでとめてください。', 'koko de tomete kudasai.', 'Please stop here.', 'ここで止めてください。'],
      ['p', 'にせんさんびゃくえんです。', 'nisen sanbyaku en desu.', 'That is 2,300 yen.'],
      ['y', 'りょうしゅうしょをおねがいします。', 'ryoushuusho o onegai shimasu.', 'A receipt, please.', '領収書をお願いします。']
    ] },
  { id: 'spk:real:rp-directions', mode: 'roleplay', level: 'n5', title: 'Asking the way', summary: 'Stop someone politely and follow the directions they give.', partner: 'Passer-by',
    tips: ['Start with すみません and a slight bow; people are very willing to help.', 'Listen for まっすぐ (straight), みぎ (right), ひだり (left), しんごう (traffic light), かど (corner).'],
    turns: [
      ['y', 'すみません、ちょっとおききしてもいいですか。', 'sumimasen, chotto okiki shite mo ii desu ka.', 'Excuse me, may I ask you something?', 'すみません、ちょっとお聞きしてもいいですか。'],
      ['p', 'はい、どうぞ。', 'hai, douzo.', 'Yes, go ahead.'],
      ['y', 'ゆうびんきょくはどこですか。', 'yuubinkyoku wa doko desu ka.', 'Where is the post office?', '郵便局はどこですか。'],
      ['p', 'このみちをまっすぐいって、ふたつめのしんごうをみぎにまがってください。', 'kono michi o massugu itte, futatsume no shingou o migi ni magatte kudasai.', 'Go straight along this road and turn right at the second light.'],
      ['y', 'ふたつめのしんごうをみぎですね。', 'futatsume no shingou o migi desu ne.', 'Right at the second light, yes?', '二つ目の信号を右ですね。'],
      ['p', 'はい。ひだりがわにあります。あるいてごふんくらいです。', 'hai. hidarigawa ni arimasu. aruite gofun kurai desu.', 'Yes. It is on the left, about five minutes on foot.'],
      ['y', 'わかりました。どうもありがとうございます。', 'wakarimashita. doumo arigatou gozaimasu.', 'Got it. Thank you very much.']
    ] },
  // ---------- Shops and food ----------
  { id: 'spk:real:rp-konbini', mode: 'roleplay', level: 'n5', title: 'Convenience store', summary: 'The checkout script you will hear ten times a day.', partner: 'Clerk',
    tips: ['Clerks speak fast and formally. You only need はい, いいえ, けっこうです (no thanks) and おねがいします.', 'ふくろ is a bag (charged); あたためる is to heat food; ポイントカード is a loyalty card.'],
    turns: [
      ['p', 'いらっしゃいませ。ポイントカードはおもちですか。', 'irasshaimase. pointo kaado wa omochi desu ka.', 'Welcome. Do you have a point card?'],
      ['y', 'いいえ、ないです。', 'iie, nai desu.', 'No, I do not.'],
      ['p', 'おべんとう、あたためますか。', 'obentou, atatamemasu ka.', 'Shall I heat the bento?'],
      ['y', 'はい、おねがいします。', 'hai, onegai shimasu.', 'Yes, please.', 'はい、お願いします。'],
      ['p', 'ふくろはごりようですか。', 'fukuro wa goriyou desu ka.', 'Would you like a bag?'],
      ['y', 'いいえ、けっこうです。', 'iie, kekkou desu.', 'No, thank you.', 'いいえ、結構です。'],
      ['p', 'おしはらいはどうなさいますか。', 'oshiharai wa dou nasaimasu ka.', 'How would you like to pay?'],
      ['y', 'カードでおねがいします。', 'kaado de onegai shimasu.', 'By card, please.', 'カードでお願いします。'],
      ['p', 'ありがとうございました。', 'arigatou gozaimashita.', 'Thank you very much.']
    ] },
  { id: 'spk:real:rp-restaurant', mode: 'roleplay', level: 'n5', title: 'Restaurant: from door to bill', summary: 'Party size, ordering, recommendations and paying.', partner: 'Server',
    tips: ['You are asked なんめいさま (how many): answer ひとり, ふたり, さんにん… or hold up fingers.', 'Press the table button or say すみません to call staff; it is not rude.', 'おかいけい おねがいします gets the bill; pay at the register near the door.'],
    turns: [
      ['p', 'いらっしゃいませ。なんめいさまですか。', 'irasshaimase. nanmeisama desu ka.', 'Welcome. How many?'],
      ['y', 'ふたりです。', 'futari desu.', 'Two.', '二人です。'],
      ['p', 'こちらへどうぞ。おきまりになりましたらおよびください。', 'kochira e douzo. okimari ni narimashitara oyobi kudasai.', 'This way. Call me when you have decided.'],
      ['y', 'すみません、おすすめはなんですか。', 'sumimasen, osusume wa nan desu ka.', 'Excuse me, what do you recommend?', 'すみません、おすすめは何ですか。'],
      ['p', 'きょうはさばのていしょくがおすすめです。', 'kyou wa saba no teishoku ga osusume desu.', 'Today the mackerel set meal is recommended.'],
      ['y', 'じゃあ、それをふたつおねがいします。', 'jaa, sore o futatsu onegai shimasu.', 'Then two of those, please.', 'じゃあ、それを二つお願いします。'],
      ['p', 'おのみものはいかがですか。', 'onomimono wa ikaga desu ka.', 'Anything to drink?'],
      ['y', 'おみずでだいじょうぶです。', 'omizu de daijoubu desu.', 'Water is fine.', 'お水で大丈夫です。'],
      ['y', 'すみません、おかいけいおねがいします。', 'sumimasen, okaikei onegai shimasu.', 'Excuse me, the bill please.', 'すみません、お会計お願いします。'],
      ['p', 'はい、レジでおねがいします。', 'hai, reji de onegai shimasu.', 'Yes, please pay at the register.']
    ] },
  { id: 'spk:real:rp-izakaya', mode: 'roleplay', level: 'n5', title: 'Izakaya evening', summary: 'The pub routine: the table charge, a first round, refills.', partner: 'Server',
    tips: ['おとおし is a small appetiser that doubles as a seating charge; it is not a mistake.', 'とりあえず ビール "a beer to start" is the classic opening line.', 'Say おかわり for a refill of the same thing.'],
    turns: [
      ['p', 'いらっしゃいませ。おのみものからおうかがいします。', 'irasshaimase. onomimono kara oukagai shimasu.', 'Welcome. Let me take your drink order first.'],
      ['y', 'とりあえず、なまビールをふたつおねがいします。', 'toriaezu, nama biiru o futatsu onegai shimasu.', 'To start, two draught beers please.', 'とりあえず、生ビールを二つお願いします。'],
      ['p', 'かしこまりました。こちら、おとおしです。', 'kashikomarimashita. kochira, otooshi desu.', 'Certainly. Here is the appetiser.'],
      ['y', 'すみません、からあげとえだまめもください。', 'sumimasen, karaage to edamame mo kudasai.', 'Excuse me, fried chicken and edamame too, please.', 'すみません、唐揚げと枝豆もください。'],
      ['p', 'はい、しょうしょうおまちください。', 'hai, shoushou omachi kudasai.', 'Yes, one moment please.'],
      ['y', 'おかわりおねがいします。', 'okawari onegai shimasu.', 'Another one, please.', 'おかわりお願いします。'],
      ['p', 'おなじものでよろしいですか。', 'onaji mono de yoroshii desu ka.', 'The same again?'],
      ['y', 'はい、おなじので。', 'hai, onaji no de.', 'Yes, the same.', 'はい、同じので。']
    ] },
  { id: 'spk:real:rp-shopping', mode: 'roleplay', level: 'n5', title: 'Clothes shop', summary: 'Try something on, ask for another size or colour, ask about tax-free.', partner: 'Shop assistant',
    tips: ['しちゃく is trying on; the fitting room is しちゃくしつ. Take your shoes off if there is a step.', 'めんぜい (tax free) needs your passport and usually a minimum spend.'],
    turns: [
      ['y', 'すみません、これ、しちゃくしてもいいですか。', 'sumimasen, kore, shichaku shite mo ii desu ka.', 'Excuse me, may I try this on?', 'すみません、これ、試着してもいいですか。'],
      ['p', 'はい、しちゃくしつはあちらです。', 'hai, shichakushitsu wa achira desu.', 'Yes, the fitting room is over there.'],
      ['y', 'すこしおおきいです。ひとつしたのサイズはありますか。', 'sukoshi ookii desu. hitotsu shita no saizu wa arimasu ka.', 'It is a little big. Do you have one size down?', '少し大きいです。一つ下のサイズはありますか。'],
      ['p', 'はい、おもちします。', 'hai, omochi shimasu.', 'Yes, I will bring one.'],
      ['y', 'いろちがいもありますか。', 'irochigai mo arimasu ka.', 'Do you have it in another colour?', '色違いもありますか。'],
      ['p', 'くろとしろがございます。', 'kuro to shiro ga gozaimasu.', 'We have black and white.'],
      ['y', 'じゃあ、くろにします。めんぜいできますか。', 'jaa, kuro ni shimasu. menzei dekimasu ka.', 'Then black. Can I get it tax free?', 'じゃあ、黒にします。免税できますか。'],
      ['p', 'はい、パスポートをおねがいします。', 'hai, pasupooto o onegai shimasu.', 'Yes, your passport please.']
    ] },
  // ---------- Staying ----------
  { id: 'spk:real:rp-hotel', mode: 'roleplay', level: 'n5', title: 'Hotel check-in', summary: 'Check in, ask about breakfast, Wi-Fi and checkout time.', partner: 'Receptionist',
    tips: ['よやく is a reservation. Have the booking name ready.', 'ちょうしょく breakfast, チェックアウト checkout; most hotels check out at 10 or 11.'],
    turns: [
      ['y', 'チェックインをおねがいします。よやくした[name]です。', 'chekkuin o onegai shimasu. yoyaku shita [name] desu.', 'I would like to check in. I have a reservation under [name].', 'チェックインをお願いします。予約した[name]です。'],
      ['p', 'おまたせしました。パスポートをおねがいします。', 'omatase shimashita. pasupooto o onegai shimasu.', 'Thank you for waiting. Your passport, please.'],
      ['y', 'はい、どうぞ。', 'hai, douzo.', 'Here you are.'],
      ['p', 'おへやはななかいのななまるにごうしつです。', 'oheya wa nanakai no nana maru ni goushitsu desu.', 'Your room is 702 on the seventh floor.'],
      ['y', 'ちょうしょくはなんじからですか。', 'choushoku wa nanji kara desu ka.', 'What time is breakfast from?', '朝食は何時からですか。'],
      ['p', 'あさろくじはんからじゅうじまで、にかいのレストランです。', 'asa rokuji han kara juuji made, nikai no resutoran desu.', 'From 6:30 to 10, in the restaurant on the second floor.'],
      ['y', 'ワイファイのパスワードをおしえてください。', 'waifai no pasuwaado o oshiete kudasai.', 'Could you tell me the Wi-Fi password?', 'Wi-Fiのパスワードを教えてください。'],
      ['p', 'こちらにかいてあります。チェックアウトはじゅういちじです。', 'kochira ni kaite arimasu. chekkuauto wa juuichiji desu.', 'It is written here. Checkout is at 11.'],
      ['y', 'わかりました。ありがとうございます。', 'wakarimashita. arigatou gozaimasu.', 'Understood. Thank you.']
    ] },
  { id: 'spk:real:rp-ryokan', mode: 'roleplay', level: 'n5', title: 'Ryokan and onsen', summary: 'Dinner time, the bath, and the questions staff ask.', partner: 'Staff',
    tips: ['Wash thoroughly at the seated showers before entering the bath; no swimwear, no towels in the water.', 'ゆかた is worn left side over right. Tattoos may need covering: ask タトゥーはだいじょうぶですか.'],
    turns: [
      ['p', 'ごゆうしょくはろくじとななじ、どちらになさいますか。', 'goyuushoku wa rokuji to nanaji, dochira ni nasaimasu ka.', 'Dinner at six or seven, which would you like?'],
      ['y', 'ななじでおねがいします。', 'nanaji de onegai shimasu.', 'Seven, please.', '七時でお願いします。'],
      ['p', 'おふろはいっかいです。にじゅうよじかんごりようになれます。', 'ofuro wa ikkai desu. nijuuyojikan goriyou ni naremasu.', 'The bath is on the first floor and open 24 hours.'],
      ['y', 'タトゥーがあるんですが、だいじょうぶですか。', 'tatuu ga aru n desu ga, daijoubu desu ka.', 'I have a tattoo; is that all right?'],
      ['p', 'ちいさいものでしたら、シールでかくしていただければだいじょうぶです。', 'chiisai mono deshitara, shiiru de kakushite itadakereba daijoubu desu.', 'If it is small, it is fine if you cover it with a sticker.'],
      ['y', 'わかりました。ゆかたはどこにありますか。', 'wakarimashita. yukata wa doko ni arimasu ka.', 'Understood. Where are the yukata?', '分かりました。浴衣はどこにありますか。'],
      ['p', 'おへやのおしいれにございます。', 'oheya no oshiire ni gozaimasu.', 'In the closet in your room.'],
      ['y', 'ありがとうございます。たのしみです。', 'arigatou gozaimasu. tanoshimi desu.', 'Thank you. I am looking forward to it.', 'ありがとうございます。楽しみです。']
    ] },
  { id: 'spk:real:rp-trouble', mode: 'roleplay', level: 'n5', title: 'Hotel room problem', summary: 'Report a problem politely and ask for a fix.', partner: 'Front desk',
    tips: ['〜んですが softens a complaint: エアコンが つかないんですが "the air conditioning will not come on…".', 'Add すみませんが to any request to sound reasonable rather than demanding.'],
    turns: [
      ['y', 'すみません、ななまるにごうしつですが、エアコンがつかないんですが。', 'sumimasen, nana maru ni goushitsu desu ga, eakon ga tsukanai n desu ga.', 'Excuse me, room 702; the air conditioning will not come on.', 'すみません、702号室ですが、エアコンがつかないんですが。'],
      ['p', 'もうしわけございません。すぐにかかりのものがうかがいます。', 'moushiwake gozaimasen. sugu ni kakari no mono ga ukagaimasu.', 'I am very sorry. Someone will come right away.'],
      ['y', 'それから、タオルをもういちまいもらえますか。', 'sorekara, taoru o mou ichimai moraemasu ka.', 'Also, could I have one more towel?', 'それから、タオルをもう一枚もらえますか。'],
      ['p', 'かしこまりました。いっしょにおもちします。', 'kashikomarimashita. issho ni omochi shimasu.', 'Certainly. I will bring it at the same time.'],
      ['y', 'おねがいします。', 'onegai shimasu.', 'Please.', 'お願いします。']
    ] },
  // ---------- Health and help ----------
  { id: 'spk:real:rp-pharmacy', mode: 'roleplay', level: 'n5', title: 'Pharmacy', summary: 'Describe a symptom and get the right medicine.', partner: 'Pharmacist',
    tips: ['あたまがいたい headache, おなかがいたい stomach ache, ねつがある fever, せきがでる cough, のどがいたい sore throat.', 'アレルギー is allergy; say the thing + アレルギーがあります.'],
    turns: [
      ['p', 'いらっしゃいませ。どうされましたか。', 'irasshaimase. dou saremashita ka.', 'Welcome. What seems to be the trouble?'],
      ['y', 'きのうからあたまがいたくて、ねつもあります。', 'kinou kara atama ga itakute, netsu mo arimasu.', 'I have had a headache since yesterday and a fever too.', '昨日から頭が痛くて、熱もあります。'],
      ['p', 'なにかアレルギーはありますか。', 'nanika arerugii wa arimasu ka.', 'Do you have any allergies?'],
      ['y', 'いいえ、ありません。', 'iie, arimasen.', 'No, none.'],
      ['p', 'では、こちらのかぜぐすりをどうぞ。いちにちさんかい、しょくごにのんでください。', 'dewa, kochira no kazegusuri o douzo. ichinichi sankai, shokugo ni nonde kudasai.', 'Then take this cold medicine: three times a day, after meals.'],
      ['y', 'ねむくなりますか。', 'nemuku narimasu ka.', 'Will it make me drowsy?', '眠くなりますか。'],
      ['p', 'すこしねむくなることがあります。', 'sukoshi nemuku naru koto ga arimasu.', 'It may make you a little drowsy.'],
      ['y', 'わかりました。これをください。', 'wakarimashita. kore o kudasai.', 'Understood. I will take this.', '分かりました。これをください。']
    ] },
  { id: 'spk:real:rp-clinic', mode: 'roleplay', level: 'n5', title: 'Clinic reception', summary: 'Register at a clinic and describe why you came.', partner: 'Receptionist',
    tips: ['ほけんしょう is the health insurance card; without one you pay full price, so bring travel insurance papers.', 'もんしんひょう is the intake form; ask for an English one: えいごのもんしんひょうはありますか.'],
    turns: [
      ['p', 'こんにちは。きょうはどうされましたか。', 'konnichiwa. kyou wa dou saremashita ka.', 'Hello. What brings you in today?'],
      ['y', 'おとといから、おなかがいたいんです。', 'ototoi kara, onaka ga itai n desu.', 'My stomach has hurt since the day before yesterday.', '一昨日から、お腹が痛いんです。'],
      ['p', 'ほけんしょうはおもちですか。', 'hokenshou wa omochi desu ka.', 'Do you have your insurance card?'],
      ['y', 'いいえ、りょこうほけんだけです。', 'iie, ryokou hoken dake desu.', 'No, only travel insurance.', 'いいえ、旅行保険だけです。'],
      ['p', 'わかりました。こちらのもんしんひょうにきにゅうしてください。', 'wakarimashita. kochira no monshinhyou ni kinyuu shite kudasai.', 'I see. Please fill in this intake form.'],
      ['y', 'えいごのもんしんひょうはありますか。', 'eigo no monshinhyou wa arimasu ka.', 'Do you have an English form?', '英語の問診票はありますか。'],
      ['p', 'はい、こちらです。おなまえをよばれるまでおかけください。', 'hai, kochira desu. onamae o yobareru made okake kudasai.', 'Yes, here. Please take a seat until your name is called.']
    ] },
  { id: 'spk:real:rp-lost', mode: 'roleplay', level: 'n5', title: 'Lost property at the police box', summary: 'Report a lost wallet at a こうばん.', partner: 'Police officer',
    tips: ['こうばん (police boxes) handle lost property, directions and minor help; they are everywhere.', 'Lost items are very often handed in. Say what, where and when.'],
    turns: [
      ['y', 'すみません、さいふをなくしてしまったんですが。', 'sumimasen, saifu o nakushite shimatta n desu ga.', 'Excuse me, I have lost my wallet.', 'すみません、財布をなくしてしまったんですが。'],
      ['p', 'どこでなくしましたか。', 'doko de nakushimashita ka.', 'Where did you lose it?'],
      ['y', 'たぶん、でんしゃのなかだとおもいます。やまのてせんです。', 'tabun, densha no naka da to omoimasu. yamanotesen desu.', 'Probably on the train, I think. The Yamanote line.', 'たぶん、電車の中だと思います。山手線です。'],
      ['p', 'いつごろですか。', 'itsu goro desu ka.', 'Around when?'],
      ['y', 'いちじかんくらいまえです。くろいかわのさいふです。', 'ichijikan kurai mae desu. kuroi kawa no saifu desu.', 'About an hour ago. It is a black leather wallet.', '一時間くらい前です。黒い革の財布です。'],
      ['p', 'わかりました。こちらのしょるいにれんらくさきをかいてください。', 'wakarimashita. kochira no shorui ni renrakusaki o kaite kudasai.', 'I see. Please write your contact details on this form.'],
      ['y', 'はい。みつかったられんらくをもらえますか。', 'hai. mitsukattara renraku o moraemasu ka.', 'Yes. Could you contact me if it is found?', 'はい。見つかったら連絡をもらえますか。'],
      ['p', 'はい、ごれんらくします。', 'hai, gorenraku shimasu.', 'Yes, we will contact you.']
    ] },
  { id: 'spk:real:rp-repeat', mode: 'roleplay', level: 'n5', title: 'When you do not understand', summary: 'The rescue phrases: slower, again, in English, write it down.', partner: 'Station staff',
    tips: ['Nobody minds being asked to repeat. Use these early, before you are lost.', 'Showing a map or asking someone to write the word (かいて ください) solves most problems.'],
    turns: [
      ['p', 'このれっしゃはつぎのえきでかいそくにれんらくしますのでおのりかえください。', 'kono ressha wa tsugi no eki de kaisoku ni renraku shimasu node onorikae kudasai.', 'This train connects with the rapid service at the next station, so please change there.'],
      ['y', 'すみません、もういちどゆっくりおねがいします。', 'sumimasen, mou ichido yukkuri onegai shimasu.', 'Sorry, once more, slowly please.', 'すみません、もう一度ゆっくりお願いします。'],
      ['p', 'つぎのえきで、のりかえてください。', 'tsugi no eki de, norikaete kudasai.', 'At the next station, please change trains.'],
      ['y', 'つぎのえきでのりかえですね。えきのなまえをかいてもらえますか。', 'tsugi no eki de norikae desu ne. eki no namae o kaite moraemasu ka.', 'Change at the next station, right? Could you write the station name for me?', '次の駅で乗り換えですね。駅の名前を書いてもらえますか。'],
      ['p', 'はい、どうぞ。', 'hai, douzo.', 'Yes, here.'],
      ['y', 'えいごがはなせるひとはいますか。', 'eigo ga hanaseru hito wa imasu ka.', 'Is there anyone who speaks English?', '英語が話せる人はいますか。'],
      ['p', 'しょうしょうおまちください。', 'shoushou omachi kudasai.', 'One moment, please.'],
      ['y', 'たすかります。ありがとうございます。', 'tasukarimasu. arigatou gozaimasu.', 'That helps. Thank you.', '助かります。ありがとうございます。']
    ] },
  // ---------- People ----------
  { id: 'spk:real:rp-smalltalk', mode: 'roleplay', level: 'n5', title: 'Small talk with a colleague', summary: 'Weather, weekends and the little exchanges that build relationships.', partner: 'Colleague',
    tips: ['Weather is the universal opener: あついですね, さむいですね, いいてんきですね.', 'Answer with そうですね first, then add one detail. Agreement before information is the rhythm of Japanese small talk.'],
    turns: [
      ['p', 'おはようございます。きょうはあついですね。', 'ohayou gozaimasu. kyou wa atsui desu ne.', 'Good morning. Hot today, isn\'t it?'],
      ['y', 'そうですね。ほんとうにあついですね。', 'sou desu ne. hontou ni atsui desu ne.', 'It is. Really hot.', 'そうですね。本当に暑いですね。'],
      ['p', 'しゅうまつはなにかしましたか。', 'shuumatsu wa nanika shimashita ka.', 'Did you do anything at the weekend?'],
      ['y', 'ともだちとかまくらにいきました。', 'tomodachi to kamakura ni ikimashita.', 'I went to Kamakura with a friend.', '友達と鎌倉に行きました。'],
      ['p', 'いいですね。どうでしたか。', 'ii desu ne. dou deshita ka.', 'Nice. How was it?'],
      ['y', 'ひとがおおかったですが、たのしかったです。', 'hito ga ookatta desu ga, tanoshikatta desu.', 'It was crowded, but fun.', '人が多かったですが、楽しかったです。'],
      ['p', 'それはよかったですね。', 'sore wa yokatta desu ne.', 'That is good to hear.'],
      ['y', 'たなかさんは？', 'tanaka san wa?', 'And you, Tanaka-san?', '田中さんは？'],
      ['p', 'わたしはいえでゆっくりしていました。', 'watashi wa ie de yukkuri shite imashita.', 'I just relaxed at home.']
    ] },
  { id: 'spk:real:rp-friends', mode: 'roleplay', level: 'n5', title: 'Casual chat with a friend', summary: 'Plain forms, contractions and the particles friends actually use.', partner: 'Yuki',
    tips: ['Friends drop です/ます: いく instead of いきます, たべた instead of たべました.', 'Listen for 〜てる (〜ている), 〜ちゃった (〜てしまった), じゃん, かな, よね.'],
    turns: [
      ['p', 'ねえ、いまなにしてる？', 'nee, ima nani shiteru?', 'Hey, what are you up to?'],
      ['y', 'べつに。ひまだよ。', 'betsu ni. hima da yo.', 'Nothing much. I\'m free.', '別に。暇だよ。'],
      ['p', 'じゃあ、ラーメンたべにいかない？', 'jaa, raamen tabe ni ikanai?', 'Then wanna go eat ramen?'],
      ['y', 'いいね。どこいく？', 'ii ne. doko iku?', 'Sounds good. Where to?', 'いいね。どこ行く？'],
      ['p', 'えきまえのあたらしいみせ。けっこうおいしいらしいよ。', 'ekimae no atarashii mise. kekkou oishii rashii yo.', 'The new place by the station. Apparently it\'s pretty good.'],
      ['y', 'まじで？じゃあ、いこう。なんじにする？', 'maji de? jaa, ikou. nanji ni suru?', 'Really? Let\'s go then. What time?', 'まじで？じゃあ、行こう。何時にする？'],
      ['p', 'ななじくらいでいい？', 'nanaji kurai de ii?', 'Around seven OK?'],
      ['y', 'オッケー。ちょっとおくれるかも。', 'okkee. chotto okureru kamo.', 'OK. I might be a bit late.', 'オッケー。ちょっと遅れるかも。'],
      ['p', 'りょうかい。じゃ、あとでね。', 'ryoukai. ja, ato de ne.', 'Got it. See you later.']
    ] },
  { id: 'spk:real:rp-visit', mode: 'roleplay', level: 'n5', title: 'Visiting someone\'s home', summary: 'The fixed phrases at the door, with a gift, at the table and when leaving.', partner: 'Host',
    tips: ['おじゃまします on entering, いただきます before eating, ごちそうさまでした after, おじゃましました when leaving. Say them every time.', 'Bring a small gift and hand it over with つまらないものですが or the plainer これ、よかったらどうぞ.'],
    turns: [
      ['p', 'いらっしゃい。どうぞあがって。', 'irasshai. douzo agatte.', 'Welcome. Please come in.'],
      ['y', 'おじゃまします。', 'ojama shimasu.', 'Thank you for having me (literally: I am intruding).'],
      ['y', 'これ、よかったらどうぞ。', 'kore, yokattara douzo.', 'Here, this is for you, if you like.'],
      ['p', 'わあ、ありがとう。きをつかわなくていいのに。', 'waa, arigatou. ki o tsukawanakute ii noni.', 'Oh, thank you. You didn\'t have to.'],
      ['p', 'さあ、たべて。', 'saa, tabete.', 'Come on, eat.'],
      ['y', 'いただきます。', 'itadakimasu.', 'Thank you for the meal (said before eating).'],
      ['y', 'ごちそうさまでした。とてもおいしかったです。', 'gochisousama deshita. totemo oishikatta desu.', 'Thank you for the meal. It was delicious.', 'ごちそうさまでした。とても美味しかったです。'],
      ['p', 'おそまつさまでした。', 'osomatsusama deshita.', 'It was nothing (host\'s modest reply).'],
      ['y', 'きょうはありがとうございました。おじゃましました。', 'kyou wa arigatou gozaimashita. ojama shimashita.', 'Thank you for today. Goodbye (literally: I intruded).', '今日はありがとうございました。おじゃましました。']
    ] },
  { id: 'spk:real:rp-work', mode: 'roleplay', level: 'n5', title: 'First day at work', summary: 'Introduce yourself to the team and ask for guidance.', partner: 'Manager',
    tips: ['A workplace self-introduction is: name, where from, one line of enthusiasm, よろしくおねがいします.', 'Say おさきにしつれいします when leaving before others and おつかれさまです as the all-purpose greeting.'],
    turns: [
      ['p', 'みなさん、きょうからいっしょにはたらく[name]さんです。', 'minasan, kyou kara issho ni hataraku [name] san desu.', 'Everyone, this is [name], who starts with us today.'],
      ['y', 'はじめまして。[place]からきました[name]ともうします。', 'hajimemashite. [place] kara kimashita [name] to moushimasu.', 'How do you do. My name is [name]; I come from [place].', '初めまして。[place]から来ました[name]と申します。'],
      ['y', 'はやくしごとになれるようにがんばります。よろしくおねがいします。', 'hayaku shigoto ni nareru you ni ganbarimasu. yoroshiku onegai shimasu.', 'I will do my best to get used to the work quickly. I look forward to working with you.', '早く仕事に慣れるように頑張ります。よろしくお願いします。'],
      ['p', 'こちらこそ。わからないことがあったら、なんでもきいてください。', 'kochira koso. wakaranai koto ga attara, nandemo kiite kudasai.', 'Likewise. If anything is unclear, ask anything.'],
      ['y', 'ありがとうございます。さっそくですが、このしりょうはどこにありますか。', 'arigatou gozaimasu. sassoku desu ga, kono shiryou wa doko ni arimasu ka.', 'Thank you. Straight away then, where is this document?', 'ありがとうございます。早速ですが、この資料はどこにありますか。'],
      ['p', 'きょうゆうフォルダにはいっています。あとでおくりますね。', 'kyouyuu foruda ni haitte imasu. ato de okurimasu ne.', 'It is in the shared folder. I will send it later.'],
      ['y', 'おねがいします。きょうはおさきにしつれいします。', 'onegai shimasu. kyou wa osaki ni shitsurei shimasu.', 'Please. I will head off first today.', 'お願いします。今日はお先に失礼します。'],
      ['p', 'おつかれさまでした。', 'otsukaresama deshita.', 'Good work today.']
    ] },
  // ---------- Shadowing: how people really talk ----------
  { id: 'spk:real:sh-casual', mode: 'shadow', level: 'n5', title: 'Casual contractions', summary: 'The shortened forms you hear far more than the textbook ones.',
    items: [
      ['いま、なにしてる？', 'ima, nani shiteru?', 'What are you doing now? (している → してる)', '今、何してる？'],
      ['もうたべちゃった。', 'mou tabechatta.', 'I already ate it (all up). (たべてしまった → たべちゃった)', 'もう食べちゃった。'],
      ['さきにかっとくね。', 'saki ni kattoku ne.', 'I\'ll buy it in advance. (かっておく → かっとく)', '先に買っとくね。'],
      ['いかなきゃ。', 'ikanakya.', 'I\'ve gotta go. (いかなければ → いかなきゃ)', '行かなきゃ。'],
      ['それ、たかくない？', 'sore, takaku nai?', 'Isn\'t that expensive?', 'それ、高くない？'],
      ['すごいじゃん。', 'sugoi jan.', 'That\'s amazing, isn\'t it. (じゃん = じゃない)'],
      ['あれ、なんだっけ？', 'are, nan dakke?', 'Wait, what was it again?', 'あれ、何だっけ？'],
      ['いくかな。', 'iku kana.', 'I wonder if I\'ll go. / Maybe I\'ll go.', '行くかな。'],
      ['なんかつかれた。', 'nanka tsukareta.', 'I\'m kind of tired. (なんか = sort of)', 'なんか疲れた。'],
      ['それな。', 'sore na.', 'Exactly. / So true. (slang agreement)'],
      ['やばい、おくれる。', 'yabai, okureru.', 'Oh no, I\'m going to be late. (やばい = uh-oh / wow)', 'やばい、遅れる。'],
      ['ってか、おなかすいた。', 'tte ka, onaka suita.', 'Anyway, I\'m hungry. (っていうか → ってか)', 'ってか、お腹すいた。']
    ] },
  { id: 'spk:real:sh-aizuchi', mode: 'shadow', level: 'n5', title: 'Reactions and back-channels', summary: 'The sounds that show you are listening. Without them, conversations die.',
    items: [
      ['うん、うん。', 'un, un.', 'Mm-hm. (casual listening signal)'],
      ['はい、はい。', 'hai, hai.', 'Yes, yes. (polite listening signal; not "yes" to a question)'],
      ['そうなんだ。', 'sou nanda.', 'Oh, I see. / Is that so. (casual)'],
      ['そうなんですか。', 'sou nan desu ka.', 'Oh really? (polite)'],
      ['なるほど。', 'naruhodo.', 'I see. / That makes sense.'],
      ['へえ、しらなかった。', 'hee, shiranakatta.', 'Huh, I didn\'t know that.', 'へえ、知らなかった。'],
      ['えっ、ほんとに？', 'e, honto ni?', 'What, really?', 'えっ、本当に？'],
      ['まじで？', 'maji de?', 'Seriously? (casual)'],
      ['たしかに。', 'tashika ni.', 'True. / Good point.', '確かに。'],
      ['いいですね。', 'ii desu ne.', 'That sounds nice.'],
      ['たいへんでしたね。', 'taihen deshita ne.', 'That must have been tough.', '大変でしたね。'],
      ['それで？', 'sore de?', 'And then? (keeps the story going)']
    ] },
  { id: 'spk:real:sh-staff', mode: 'shadow', level: 'n5', title: 'What staff say to you', summary: 'Service Japanese is formulaic. Learn the formulas and shops stop being stressful.',
    items: [
      ['いらっしゃいませ。', 'irasshaimase.', 'Welcome. (no reply needed)'],
      ['おまたせしました。', 'omatase shimashita.', 'Sorry to keep you waiting.', 'お待たせしました。'],
      ['こちらでおめしあがりですか。', 'kochira de omeshiagari desu ka.', 'Eating in? (おもちかえり = take-away)', 'こちらでお召し上がりですか。'],
      ['ごちゅうもんはいじょうでよろしいでしょうか。', 'gochuumon wa ijou de yoroshii deshou ka.', 'Is that everything for your order?', 'ご注文は以上でよろしいでしょうか。'],
      ['しょうしょうおまちください。', 'shoushou omachi kudasai.', 'One moment, please.', '少々お待ちください。'],
      ['ふくろはごりようですか。', 'fukuro wa goriyou desu ka.', 'Would you like a bag?', '袋はご利用ですか。'],
      ['レシートはごりようですか。', 'reshiito wa goriyou desu ka.', 'Would you like the receipt?'],
      ['おしはらいはいっかつでよろしいですか。', 'oshiharai wa ikkatsu de yoroshii desu ka.', 'Pay in one instalment? (card question; say はい)', 'お支払いは一括でよろしいですか。'],
      ['こちらにサインをおねがいします。', 'kochira ni sain o onegai shimasu.', 'Please sign here.', 'こちらにサインをお願いします。'],
      ['せんえんおあずかりします。', 'sen en oazukari shimasu.', 'Out of a thousand yen. (taking your cash)', '千円お預かりします。'],
      ['にひゃくえんのおかえしです。', 'nihyaku en no okaeshi desu.', '200 yen change.', '二百円のお返しです。'],
      ['またおこしくださいませ。', 'mata okoshi kudasaimase.', 'Please come again.', 'またお越しくださいませ。']
    ] },
  { id: 'spk:real:sh-announce', mode: 'shadow', level: 'n5', title: 'Train and store announcements', summary: 'Natural-speed announcements, so the real ones stop being noise.',
    items: [
      ['まもなく、いちばんせんにでんしゃがまいります。', 'mamonaku, ichibansen ni densha ga mairimasu.', 'A train is arriving shortly at platform 1.', 'まもなく、一番線に電車が参ります。'],
      ['きいろいせんのうちがわまでおさがりください。', 'kiiroi sen no uchigawa made osagari kudasai.', 'Please stand behind the yellow line.', '黄色い線の内側までお下がりください。'],
      ['つぎはしぶや、しぶやです。', 'tsugi wa shibuya, shibuya desu.', 'The next stop is Shibuya.', '次は渋谷、渋谷です。'],
      ['おでぐちはみぎがわです。', 'odeguchi wa migigawa desu.', 'The doors on the right will open.', 'お出口は右側です。'],
      ['このでんしゃはかくえきていしゃです。', 'kono densha wa kakueki teisha desu.', 'This train stops at every station.', 'この電車は各駅停車です。'],
      ['ドアがしまります。ごちゅういください。', 'doa ga shimarimasu. gochuui kudasai.', 'The doors are closing. Please take care.', 'ドアが閉まります。ご注意ください。'],
      ['おわすれものにごちゅういください。', 'owasuremono ni gochuui kudasai.', 'Please make sure you have all your belongings.', 'お忘れ物にご注意ください。'],
      ['ほんじつはごらいてんいただき、ありがとうございます。', 'honjitsu wa goraiten itadaki, arigatou gozaimasu.', 'Thank you for visiting our store today.', '本日はご来店いただき、ありがとうございます。'],
      ['へいてんじかんはよるくじです。', 'heiten jikan wa yoru kuji desu.', 'Closing time is 9 pm.', '閉店時間は夜九時です。']
    ] },
  { id: 'spk:real:sh-soft', mode: 'shadow', level: 'n5', title: 'Softening requests', summary: 'How to ask for things without sounding like an order.',
    items: [
      ['すみません、ちょっといいですか。', 'sumimasen, chotto ii desu ka.', 'Excuse me, do you have a moment?'],
      ['これ、おねがいできますか。', 'kore, onegai dekimasu ka.', 'Could I ask you to do this?', 'これ、お願いできますか。'],
      ['みずをもらえますか。', 'mizu o moraemasu ka.', 'Could I get some water? (casual-polite)', '水をもらえますか。'],
      ['しゃしんをとっていただけますか。', 'shashin o totte itadakemasu ka.', 'Could you take a photo for me? (very polite)', '写真を撮っていただけますか。'],
      ['もうすこしやすくなりませんか。', 'mou sukoshi yasuku narimasen ka.', 'Could it be a little cheaper?', 'もう少し安くなりませんか。'],
      ['あした、やすんでもいいでしょうか。', 'ashita, yasunde mo ii deshou ka.', 'Would it be all right if I took tomorrow off?', '明日、休んでもいいでしょうか。'],
      ['ちょっとむずかしいかもしれません。', 'chotto muzukashii kamo shiremasen.', 'That might be a little difficult. (= no)', 'ちょっと難しいかもしれません。'],
      ['けっこうです。', 'kekkou desu.', 'No, thank you. / I\'m fine.', '結構です。'],
      ['だいじょうぶです。', 'daijoubu desu.', 'It\'s fine. / No thanks. (context decides)', '大丈夫です。'],
      ['おてすうですが、よろしくおねがいします。', 'otesuu desu ga, yoroshiku onegai shimasu.', 'Sorry for the trouble; I would appreciate it.', 'お手数ですが、よろしくお願いします。']
    ] },
  // ---------- Questions you will be asked ----------
  { id: 'spk:real:qa-travel', mode: 'question', level: 'n5', title: 'Questions you will be asked in shops', summary: 'The questions staff fire at you, and the one-line answers.',
    items: [
      ['なんめいさまですか。', 'nanmeisama desu ka.', 'How many people?', 'ふたりです。', 'futari desu.', 'Two.', '二人です。'],
      ['おしはらいはどうなさいますか。', 'oshiharai wa dou nasaimasu ka.', 'How will you pay?', 'げんきんでおねがいします。', 'genkin de onegai shimasu.', 'Cash, please.', '現金でお願いします。'],
      ['こちらでおめしあがりですか。', 'kochira de omeshiagari desu ka.', 'Eating in?', 'もちかえりでおねがいします。', 'mochikaeri de onegai shimasu.', 'Take-away, please.', '持ち帰りでお願いします。'],
      ['ふくろはごりようですか。', 'fukuro wa goriyou desu ka.', 'Would you like a bag?', 'いいえ、だいじょうぶです。', 'iie, daijoubu desu.', 'No, I\'m fine.', 'いいえ、大丈夫です。'],
      ['ポイントカードはおもちですか。', 'pointo kaado wa omochi desu ka.', 'Do you have a point card?', 'もっていません。', 'motte imasen.', 'I don\'t have one.', '持っていません。'],
      ['サイズはいかがですか。', 'saizu wa ikaga desu ka.', 'How is the size?', 'ちょうどいいです。', 'choudo ii desu.', 'It\'s just right.'],
      ['よやくはされていますか。', 'yoyaku wa sarete imasu ka.', 'Do you have a reservation?', 'いいえ、していません。', 'iie, shite imasen.', 'No, I don\'t.'],
      ['おきまりですか。', 'okimari desu ka.', 'Have you decided?', 'もうすこしまってください。', 'mou sukoshi matte kudasai.', 'Please give me a little longer.', 'もう少し待ってください。']
    ] },
  { id: 'spk:real:qa-casual', mode: 'question', level: 'n5', title: 'Questions friends ask', summary: 'Casual questions with natural casual answers.',
    items: [
      ['しゅうまつなにしてた？', 'shuumatsu nani shiteta?', 'What did you do at the weekend?', 'ともだちとえいがみてた。', 'tomodachi to eiga miteta.', 'I was watching a film with a friend.', '友達と映画見てた。'],
      ['にほんのたべものでなにがすき？', 'nihon no tabemono de nani ga suki?', 'What Japanese food do you like?', 'ラーメンがいちばんすき。', 'raamen ga ichiban suki.', 'I like ramen best.', 'ラーメンが一番好き。'],
      ['にほんごはどのくらいべんきょうしてるの？', 'nihongo wa dono kurai benkyou shiteru no?', 'How long have you been studying Japanese?', 'いちねんくらいかな。', 'ichinen kurai kana.', 'About a year, I guess.', '一年くらいかな。'],
      ['こんどいっしょにごはんいかない？', 'kondo issho ni gohan ikanai?', 'Want to go eat together sometime?', 'いいね、いこう。', 'ii ne, ikou.', 'Sure, let\'s go.', 'いいね、行こう。'],
      ['どこにすんでるの？', 'doko ni sunderu no?', 'Where do you live?', '[place]にすんでる。', '[place] ni sunderu.', 'I live in [place].', '[place]に住んでる。'],
      ['さむくない？', 'samuku nai?', 'Aren\'t you cold?', 'ちょっとさむいかも。', 'chotto samui kamo.', 'Maybe a little.', 'ちょっと寒いかも。'],
      ['それ、どこでかったの？', 'sore, doko de katta no?', 'Where did you buy that?', 'えきまえのみせでかった。', 'ekimae no mise de katta.', 'At the shop in front of the station.', '駅前の店で買った。']
    ] }
];
