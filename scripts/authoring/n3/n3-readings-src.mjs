// N3 graded readings and listening drills (unit numbers refer to N3 units; 60 units).
export const READINGS = [
  { id: 'read:n3:001', unit: 8, title: '市の選挙', en: 'The city election',
    text: '来月、私の住んでいる市で市長選挙が行われる。候補者は三人で、それぞれが交通や教育について意見を述べている。実は、私はまだ誰に投票するか決めていない。駅前で配られた資料を読んだり、演説を聞いたりして、よく考えて選ぶつもりだ。選挙は、市民が自分の意見を示す大切な機会だと思う。',
    kana: 'らいげつ、わたしのすんでいるしでしちょうせんきょがおこなわれる。こうほしゃはさんにんで、それぞれがこうつうやきょういくについていけんをのべている。じつは、わたしはまだだれにとうひょうするかきめていない。えきまえでくばられたしりょうをよんだり、えんぜつをきいたりして、よくかんがえてえらぶつもりだ。せんきょは、しみんがじぶんのいけんをしめすたいせつなきかいだとおもう。',
    enText: 'Next month a mayoral election will be held in the city where I live. There are three candidates, and each is stating opinions about transport and education. Actually, I have not yet decided whom to vote for. I intend to read the materials handed out in front of the station, listen to the speeches, think carefully and choose. I believe an election is an important opportunity for citizens to show their opinions.',
    questions: [
      { q: '候補者は何人いますか。', qKana: 'こうほしゃはなんにんいますか。', choices: ['二人', '三人', '四人'], answer: 1, why: '候補者は三人で…' },
      { q: 'この人は誰に投票しますか。', qKana: 'このひとはだれにとうひょうしますか。', choices: ['まだ決めていない', '一番目の候補者', '友達と同じ人'], answer: 0, why: 'まだ誰に投票するか決めていない。' },
      { q: 'この人は選挙をどう思っていますか。', qKana: 'このひとはせんきょをどうおもっていますか。', choices: ['面倒だ', '大切な機会だ', '意味がない'], answer: 1, why: '大切な機会だと思う。' }
    ] },
  { id: 'read:n3:002', unit: 16, title: '会議の報告', en: 'A meeting report',
    text: '本日の会議では、新しい商品の販売計画について話し合った。担当者からは、価格を少し下げれば売り上げが増えるという提案があった。一方で、品質を保つためには費用がかかるという意見も出た。結局、来週までに費用と効果を調査し、改めて判断することになった。各部署は資料を準備して、金曜日までに提出すること。',
    kana: 'ほんじつのかいぎでは、あたらしいしょうひんのはんばいけいかくについてはなしあった。たんとうしゃからは、かかくをすこしさげればうりあげがふえるというていあんがあった。いっぽうで、ひんしつをたもつためにはひようがかかるといういけんもでた。けっきょく、らいしゅうまでにひようとこうかをちょうさし、あらためてはんだんすることになった。かくぶしょはしりょうをじゅんびして、きんようびまでにていしゅつすること。',
    enText: 'At today\'s meeting we discussed the sales plan for the new product. The person in charge proposed that lowering the price a little would increase sales. On the other hand, the opinion was raised that maintaining quality costs money. In the end, it was decided to investigate costs and effects by next week and judge again. Each department is to prepare materials and submit them by Friday.',
    questions: [
      { q: '担当者は何を提案しましたか。', qKana: 'たんとうしゃはなにをていあんしましたか。', choices: ['価格を上げる', '価格を少し下げる', '品質を下げる'], answer: 1, why: '価格を少し下げれば売り上げが増える…' },
      { q: '結局、どうなりましたか。', qKana: 'けっきょく、どうなりましたか。', choices: ['すぐに価格を下げる', '来週までに調査する', '計画を中止する'], answer: 1, why: '来週までに費用と効果を調査し…' },
      { q: '各部署はいつまでに資料を出しますか。', qKana: 'かくぶしょはいつまでにしりょうをだしますか。', choices: ['今日', '金曜日', '来月'], answer: 1, why: '金曜日までに提出すること。' }
    ] },
  { id: 'read:n3:003', unit: 24, title: '環境のために', en: 'For the environment',
    text: '最近、ごみを減らす活動が盛んになってきた。私の町でも、資源ごみを分けて出すことが義務になり、買い物の際にはレジ袋の代わりに自分の袋を持って行く人が増えた。小さなことのように見えるが、一人一人が続ければ大きな効果がある。環境を守るのは政府だけの責任ではなく、私たち一人一人の責任でもあるのだ。',
    kana: 'さいきん、ごみをへらすかつどうがさかんになってきた。わたしのまちでも、しげんごみをわけてだすことがぎむになり、かいもののさいにはレジぶくろのかわりにじぶんのふくろをもっていくひとがふえた。ちいさなことのようにみえるが、ひとりひとりがつづければおおきなこうかがある。かんきょうをまもるのはせいふだけのせきにんではなく、わたしたちひとりひとりのせきにんでもあるのだ。',
    enText: 'Recently, activities to reduce waste have become widespread. In my town too, separating recyclable waste has become an obligation, and more people bring their own bags when shopping instead of plastic bags. It looks like a small thing, but if each person keeps it up there is a big effect. Protecting the environment is not only the government\'s responsibility but each of ours as well.',
    questions: [
      { q: '町で義務になったことは何ですか。', qKana: 'まちでぎむになったことはなんですか。', choices: ['レジ袋を買うこと', '資源ごみを分けて出すこと', '買い物をしないこと'], answer: 1, why: '資源ごみを分けて出すことが義務になり…' },
      { q: '筆者は小さな活動についてどう考えていますか。', qKana: 'ひっしゃはちいさなかつどうについてどうかんがえていますか。', choices: ['効果がない', '続ければ大きな効果がある', '政府がやるべきだ'], answer: 1, why: '一人一人が続ければ大きな効果がある。' },
      { q: '環境を守る責任は誰にありますか。', qKana: 'かんきょうをまもるせきにんはだれにありますか。', choices: ['政府だけ', '私たち一人一人にも', '会社だけ'], answer: 1, why: '私たち一人一人の責任でもある。' }
    ] },
  { id: 'read:n3:004', unit: 32, title: '新入社員へのアドバイス', en: 'Advice to new employees',
    text: '新しい職場では、まず挨拶をきちんとすることが大切だ。上司や先輩の指示はメモを取り、分からないことは早めに確認すること。失敗を恐れる必要はないが、同じ失敗を繰り返さないように、原因を考える習慣をつけてほしい。また、仕事の進め方で迷ったときは、一人で悩まず、周りに相談することだ。信頼は、こうした小さな行動の積み重ねによって生まれる。',
    kana: 'あたらしいしょくばでは、まずあいさつをきちんとすることがたいせつだ。じょうしやせんぱいのしじはメモをとり、わからないことははやめにかくにんすること。しっぱいをおそれるひつようはないが、おなじしっぱいをくりかえさないように、げんいんをかんがえるしゅうかんをつけてほしい。また、しごとのすすめかたでまよったときは、ひとりでなやまず、まわりにそうだんすることだ。しんらいは、こうしたちいさなこうどうのつみかさねによってうまれる。',
    enText: 'In a new workplace, the first important thing is to greet people properly. Take notes of instructions from your boss and seniors, and check anything you do not understand early. There is no need to fear failure, but I want you to form the habit of thinking about causes so that you do not repeat the same mistake. Also, when unsure how to proceed with work, do not agonise alone; consult those around you. Trust is born from the accumulation of such small actions.',
    questions: [
      { q: '分からないことがあったらどうしますか。', qKana: 'わからないことがあったらどうしますか。', choices: ['後で考える', '早めに確認する', '黙っている'], answer: 1, why: '分からないことは早めに確認すること。' },
      { q: '失敗についてどう書いてありますか。', qKana: 'しっぱいについてどうかいてありますか。', choices: ['絶対にしてはいけない', '恐れる必要はないが原因を考える', '気にしなくていい'], answer: 1, why: '恐れる必要はないが…原因を考える習慣をつけてほしい。' },
      { q: '信頼は何によって生まれますか。', qKana: 'しんらいはなにによってうまれますか。', choices: ['小さな行動の積み重ね', '大きな成功', '長い経験だけ'], answer: 0, why: '小さな行動の積み重ねによって生まれる。' }
    ] },
  { id: 'read:n3:005', unit: 40, title: '祖父の畑', en: 'My grandfather\'s field',
    text: '祖父は八十歳になった今も、毎朝畑に出て野菜を育てている。若いころは会社員だったが、退職してから農業を始めたそうだ。「土に触れていると、気持ちが落ち着く」と祖父は言う。私は休みの日に手伝いに行くことがあるが、思ったより体力が必要で、いつも疲れてしまう。それでも、自分で収穫した野菜の味は格別だ。祖父の元気の理由が、少し分かった気がする。',
    kana: 'そふははちじゅっさいになったいまも、まいあさはたけにでてやさいをそだてている。わかいころはかいしゃいんだったが、たいしょくしてからのうぎょうをはじめたそうだ。「つちにふれていると、きもちがおちつく」とそふはいう。わたしはやすみのひにてつだいにいくことがあるが、おもったよりたいりょくがひつようで、いつもつかれてしまう。それでも、じぶんでしゅうかくしたやさいのあじはかくべつだ。そふのげんきのりゆうが、すこしわかったきがする。',
    enText: 'Even now at eighty, my grandfather goes out to his field every morning to grow vegetables. When he was young he was a company employee, but I hear he started farming after retiring. "Touching the soil calms me," he says. I sometimes go to help on my days off, but it needs more stamina than I thought and I always end up exhausted. Even so, the taste of vegetables you harvested yourself is special. I feel I understand a little the reason my grandfather is so well.',
    questions: [
      { q: '祖父は若いころ何をしていましたか。', qKana: 'そふはわかいころなにをしていましたか。', choices: ['農業', '会社員', '教師'], answer: 1, why: '若いころは会社員だった…' },
      { q: '祖父はどうして畑に出ますか。', qKana: 'そふはどうしてはたけにでますか。', choices: ['お金のため', '気持ちが落ち着くから', '家族に頼まれたから'], answer: 1, why: '「土に触れていると、気持ちが落ち着く」' },
      { q: '筆者は手伝いをどう感じていますか。', qKana: 'ひっしゃはてつだいをどうかんじていますか。', choices: ['楽だ', '疲れるが野菜はおいしい', 'つまらない'], answer: 1, why: 'いつも疲れてしまう。それでも…味は格別だ。' }
    ] },
  { id: 'read:n3:006', unit: 48, title: '日本の伝統と現代', en: 'Tradition and modernity in Japan',
    text: '日本には古い伝統と新しい文化が同時に存在している。例えば、京都では千年以上前に建てられた寺の隣に、最新の設備を備えたホテルが建っている。若い世代の中には、着物を着る機会がほとんどない人も多いが、一方で、伝統的な技術を現代のデザインに生かそうとする職人も増えている。伝統を守ることと、時代に合わせて変えることの両方が、文化を生き続けさせるのだろう。',
    kana: 'にほんにはふるいでんとうとあたらしいぶんかがどうじにそんざいしている。たとえば、きょうとではせんねんいじょうまえにたてられたてらのとなりに、さいしんのせつびをそなえたホテルがたっている。わかいせだいのなかには、きものをきるきかいがほとんどないひともおおいが、いっぽうで、でんとうてきなぎじゅつをげんだいのデザインにいかそうとするしょくにんもふえている。でんとうをまもることと、じだいにあわせてかえることのりょうほうが、ぶんかをいきつづけさせるのだろう。',
    enText: 'In Japan, old traditions and new culture exist at the same time. For example, in Kyoto a hotel equipped with the latest facilities stands next to a temple built more than a thousand years ago. Among the younger generation many people have almost no occasion to wear a kimono, but on the other hand, craftspeople trying to apply traditional techniques to modern design are increasing. Both protecting tradition and changing with the times are probably what keep a culture alive.',
    questions: [
      { q: '京都の例で、寺の隣に何がありますか。', qKana: 'きょうとのれいで、てらのとなりになにがありますか。', choices: ['古い家', '最新の設備を備えたホテル', '学校'], answer: 1, why: '最新の設備を備えたホテルが建っている。' },
      { q: '増えているのはどんな職人ですか。', qKana: 'ふえているのはどんなしょくにんですか。', choices: ['伝統的な技術を現代のデザインに生かす職人', '着物だけを作る職人', '外国で働く職人'], answer: 0, why: '伝統的な技術を現代のデザインに生かそうとする職人も増えている。' },
      { q: '筆者は文化を生き続けさせるために何が必要だと考えていますか。', qKana: 'ひっしゃはぶんかをいきつづけさせるためになにがひつようだとかんがえていますか。', choices: ['伝統を守ることだけ', '時代に合わせて変えることだけ', '守ることと変えることの両方'], answer: 2, why: '両方が、文化を生き続けさせるのだろう。' }
    ] },
  { id: 'read:n3:007', unit: 56, title: '健康診断の結果', en: 'Health check results',
    text: '先週受けた健康診断の結果が届いた。体重と血圧がやや高めで、医師からは「このままだと将来、病気になる可能性が高まります」と注意された。原因は明らかで、残業が続いて運動する時間がなく、夜遅くに食事をとる日が多かったからだ。そこで、まず週に二回は歩いて通勤し、夕食は九時までに済ませることにした。無理な目標を立てても続かないので、できることから少しずつ始めるつもりだ。',
    kana: 'せんしゅううけたけんこうしんだんのけっかがとどいた。たいじゅうとけつあつがややたかめで、いしからは「このままだとしょうらい、びょうきになるかのうせいがたかまります」とちゅういされた。げんいんはあきらかで、ざんぎょうがつづいてうんどうするじかんがなく、よるおそくにしょくじをとるひがおおかったからだ。そこで、まずしゅうににかいはあるいてつうきんし、ゆうしょくはくじまでにすませることにした。むりなもくひょうをたててもつづかないので、できることからすこしずつはじめるつもりだ。',
    enText: 'The results of the health check I had last week arrived. My weight and blood pressure are somewhat high, and the doctor warned me, "If this continues, the possibility of illness in the future will rise." The cause is clear: with continuous overtime I had no time to exercise, and there were many days when I ate late at night. So I decided to walk to work at least twice a week and to finish dinner by nine. Unreasonable goals do not last, so I intend to start little by little with what I can do.',
    questions: [
      { q: '診断の結果、何が高めでしたか。', qKana: 'しんだんのけっか、なにがたかめでしたか。', choices: ['体温', '体重と血圧', '視力'], answer: 1, why: '体重と血圧がやや高めで…' },
      { q: '原因は何ですか。', qKana: 'げんいんはなんですか。', choices: ['運動のしすぎ', '残業が続いて運動できず、夜遅く食事をした', '睡眠のとりすぎ'], answer: 1, why: '残業が続いて運動する時間がなく、夜遅くに食事をとる日が多かった。' },
      { q: 'この人はどんな目標を立てましたか。', qKana: 'このひとはどんなもくひょうをたてましたか。', choices: ['毎日走る', '週に二回歩いて通勤し、九時までに夕食を済ませる', '残業をやめる'], answer: 1, why: '週に二回は歩いて通勤し、夕食は九時までに済ませることにした。' }
    ] }
];

export const LISTENING = [
  { id: 'listen:n3:001', unit: 4, type: 'dictation', title: 'Dictation: formal statements', items: [
    { text: '会議は来週に延期することになりました。', kana: 'かいぎはらいしゅうにえんきすることになりました。', en: 'The meeting has been postponed to next week.' },
    { text: '詳しい内容は資料をご覧ください。', kana: 'くわしいないようはしりょうをごらんください。', en: 'Please see the materials for details.' },
    { text: '結果が出次第、ご連絡いたします。', kana: 'けっかがでしだい、ごれんらくいたします。', en: 'We will contact you as soon as the results are out.' }
  ] },
  { id: 'listen:n3:002', unit: 12, type: 'comprehension', title: 'Announcement at a store', items: [
    { text: 'お客様にお知らせいたします。本日は雨のため、屋上の催しは中止とさせていただきます。代わりに三階のホールで午後二時から開催いたしますので、どうぞお越しください。', kana: 'おきゃくさまにおしらせいたします。ほんじつはあめのため、おくじょうのもよおしはちゅうしとさせていただきます。かわりにさんがいのホールでごごにじからかいさいいたしますので、どうぞおこしください。', en: 'Attention customers. Because of rain, today\'s rooftop event is cancelled. Instead it will be held in the third-floor hall from 2 p.m., so please come along.',
      questions: [{ q: '催しはどこで行われますか。', qKana: 'もよおしはどこでおこなわれますか。', choices: ['屋上', '三階のホール', '一階の入口'], answer: 1, why: '三階のホールで午後二時から開催いたします。' }, { q: 'どうして場所が変わりましたか。', qKana: 'どうしてばしょがかわりましたか。', choices: ['雨のため', '工事のため', '人が多いため'], answer: 0, why: '本日は雨のため…' }] }
  ] },
  { id: 'listen:n3:003', unit: 20, type: 'shadow', title: 'Shadowing: opinions', items: [
    { text: '私は賛成ですが、費用の問題を解決する必要があると思います。', kana: 'わたしはさんせいですが、ひようのもんだいをかいけつするひつようがあるとおもいます。', en: 'I agree, but I think we need to solve the cost problem.' },
    { text: '一方で、反対の意見も少なくありません。', kana: 'いっぽうで、はんたいのいけんもすくなくありません。', en: 'On the other hand, there are quite a few opposing opinions.' },
    { text: '要するに、まだ結論は出ていないということです。', kana: 'ようするに、まだけつろんはでていないということです。', en: 'In short, no conclusion has been reached yet.' }
  ] },
  { id: 'listen:n3:004', unit: 28, type: 'comprehension', title: 'A conversation at work', items: [
    { text: '女：この報告書、明日までに直せますか。男：すみません、今日は会議が続いていて…。明後日の朝でもよろしいでしょうか。女：分かりました。では、朝一番でお願いします。', kana: 'おんな：このほうこくしょ、あしたまでになおせますか。おとこ：すみません、きょうはかいぎがつづいていて…。あさってのあさでもよろしいでしょうか。おんな：わかりました。では、あさいちばんでおねがいします。', en: 'Woman: Can you correct this report by tomorrow? Man: Sorry, I have meetings all day today… Would the morning of the day after tomorrow be all right? Woman: Understood. Then first thing in the morning, please.',
      questions: [{ q: '男の人はいつ報告書を直しますか。', qKana: 'おとこのひとはいつほうこくしょをなおしますか。', choices: ['今日', '明日', '明後日の朝'], answer: 2, why: '明後日の朝でもよろしいでしょうか。…朝一番でお願いします。' }] }
  ] },
  { id: 'listen:n3:005', unit: 44, type: 'dictation', title: 'Dictation: daily situations', items: [
    { text: '念のため、傘を持って行ったほうがいいですよ。', kana: 'ねんのため、かさをもっていったほうがいいですよ。', en: 'Just in case, you had better take an umbrella.' },
    { text: 'せっかく来たのだから、ゆっくり見ていきましょう。', kana: 'せっかくきたのだから、ゆっくりみていきましょう。', en: 'Since we came all this way, let\'s take our time looking around.' },
    { text: 'どうしても今日中に終わらせなければなりません。', kana: 'どうしてもきょうじゅうにおわらせなければなりません。', en: 'I absolutely must finish it today.' }
  ] },
  { id: 'listen:n3:006', unit: 52, type: 'comprehension', title: 'News: the weather and traffic', items: [
    { text: '台風の影響で、明日の午前中は各地で強い雨が降る見込みです。電車やバスの運行に遅れが出る可能性がありますので、お出かけの際は最新の情報をご確認ください。', kana: 'たいふうのえいきょうで、あしたのごぜんちゅうはかくちでつよいあめがふるみこみです。でんしゃやバスのうんこうにおくれがでるかのうせいがありますので、おでかけのさいはさいしんのじょうほうをごかくにんください。', en: 'Because of the typhoon, heavy rain is expected in many areas tomorrow morning. Trains and buses may be delayed, so please check the latest information before going out.',
      questions: [{ q: '明日の午前中はどうなる見込みですか。', qKana: 'あしたのごぜんちゅうはどうなるみこみですか。', choices: ['晴れる', '強い雨が降る', '雪が降る'], answer: 1, why: '各地で強い雨が降る見込みです。' }, { q: '出かける前に何をするように言っていますか。', qKana: 'でかけるまえになにをするようにいっていますか。', choices: ['傘を買う', '最新の情報を確認する', '会社に電話する'], answer: 1, why: '最新の情報をご確認ください。' }] }
  ] }
];
