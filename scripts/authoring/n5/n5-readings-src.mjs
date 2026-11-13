// N5 graded readings and listening drills. Each reading belongs to a unit and
// uses only vocabulary and grammar taught by the end of that unit. The build
// script wraps kanji not yet taught as {漢字|かんじ} using the kana reading.
// questions: { q, qKana, choices, answer (index), why }
export const READINGS = [
  { id: 'read:n5:001', unit: 3, title: '私の家族', en: 'My family',
    text: '私は学生です。私の家族は四人です。父と母と兄と私です。父は会社員です。母は先生です。兄は大学生です。犬もいます。名前はポチです。',
    kana: 'わたしはがくせいです。わたしのかぞくはよにんです。ちちとははとあにとわたしです。ちちはかいしゃいんです。はははせんせいです。あにはだいがくせいです。いぬもいます。なまえはポチです。',
    enText: 'I am a student. My family is four people: my father, my mother, my older brother and me. My father is a company employee. My mother is a teacher. My brother is a university student. We also have a dog. Its name is Pochi.',
    questions: [
      { q: '家族は何人ですか。', qKana: 'かぞくはなんにんですか。', choices: ['三人', '四人', '五人'], answer: 1, why: '四人です (four people), plus the dog.' },
      { q: '母は何ですか。', qKana: 'はははなんですか。', choices: ['会社員', '先生', '学生'], answer: 1, why: '母は先生です。' },
      { q: 'ポチは何ですか。', qKana: 'ポチはなんですか。', choices: ['兄', '猫', '犬'], answer: 2, why: '犬もいます。名前はポチです。' }
    ] },
  { id: 'read:n5:002', unit: 4, title: '私の一日', en: 'My day',
    text: '私は毎朝六時に起きます。七時に朝ご飯を食べます。八時に家を出ます。電車で学校に行きます。九時から三時まで勉強します。四時に家に帰ります。晩ご飯の後で、テレビを見ます。十一時に寝ます。',
    kana: 'わたしはまいあさろくじにおきます。しちじにあさごはんをたべます。はちじにいえをでます。でんしゃでがっこうにいきます。くじからさんじまでべんきょうします。よじにいえにかえります。ばんごはんのあとで、テレビをみます。じゅういちじにねます。',
    enText: 'I get up at six every morning. I eat breakfast at seven. I leave home at eight. I go to school by train. I study from nine to three. I come home at four. After dinner I watch TV. I go to bed at eleven.',
    questions: [
      { q: '何時に起きますか。', qKana: 'なんじにおきますか。', choices: ['六時', '七時', '八時'], answer: 0, why: '六時に起きます。' },
      { q: '何で学校に行きますか。', qKana: 'なんでがっこうにいきますか。', choices: ['バス', '電車', '車'], answer: 1, why: '電車で学校に行きます。' },
      { q: '晩ご飯の後で何をしますか。', qKana: 'ばんごはんのあとでなにをしますか。', choices: ['テレビを見ます', '勉強します', '寝ます'], answer: 0, why: 'テレビを見ます。' }
    ] },
  { id: 'read:n5:003', unit: 6, title: '私の町', en: 'My town',
    text: '私の町は小さいです。でも、きれいです。駅の前に銀行と郵便局があります。駅の後ろに大きい公園があります。公園の中に池があります。池に魚がたくさんいます。町の北に山があります。山は高くないです。春、山の花はとてもきれいです。',
    kana: 'わたしのまちはちいさいです。でも、きれいです。えきのまえにぎんこうとゆうびんきょくがあります。えきのうしろにおおきいこうえんがあります。こうえんのなかにいけがあります。いけにさかながたくさんいます。まちのきたにやまがあります。やまはたかくないです。はる、やまのはなはとてもきれいです。',
    enText: 'My town is small, but pretty. In front of the station there is a bank and a post office. Behind the station there is a big park. In the park there is a pond. There are many fish in the pond. To the north of the town there is a mountain. The mountain is not high. In spring, the flowers on the mountain are very pretty.',
    questions: [
      { q: '駅の前に何がありますか。', qKana: 'えきのまえになにがありますか。', choices: ['公園', '銀行と郵便局', '山'], answer: 1, why: '駅の前に銀行と郵便局があります。' },
      { q: '山は高いですか。', qKana: 'やまはたかいですか。', choices: ['はい、高いです', 'いいえ、高くないです'], answer: 1, why: '山は高くないです。' },
      { q: '池に何がいますか。', qKana: 'いけになにがいますか。', choices: ['鳥', '犬', '魚'], answer: 2, why: '池に魚がたくさんいます。' }
    ] },
  { id: 'read:n5:004', unit: 8, title: '週末', en: 'The weekend',
    text: '先週の土曜日、私は友達と映画を見ました。映画はとても面白かったです。映画の後で、レストランで晩ご飯を食べました。私はカレーを食べました。友達はすしを食べました。日曜日は家で休みました。本を読みました。音楽も聞きました。いい週末でした。',
    kana: 'せんしゅうのどようび、わたしはともだちとえいがをみました。えいがはとてもおもしろかったです。えいがのあとで、レストランでばんごはんをたべました。わたしはカレーをたべました。ともだちはすしをたべました。にちようびはいえでやすみました。ほんをよみました。おんがくもききました。いいしゅうまつでした。',
    enText: 'Last Saturday I saw a film with a friend. The film was very interesting. After the film we had dinner at a restaurant. I had curry. My friend had sushi. On Sunday I rested at home. I read a book. I also listened to music. It was a good weekend.',
    questions: [
      { q: '土曜日に何をしましたか。', qKana: 'どようびになにをしましたか。', choices: ['本を読みました', '映画を見ました', '家で休みました'], answer: 1, why: '友達と映画を見ました。' },
      { q: '映画はどうでしたか。', qKana: 'えいがはどうでしたか。', choices: ['面白かったです', 'つまらなかったです'], answer: 0, why: 'とても面白かったです。' },
      { q: '友達は何を食べましたか。', qKana: 'ともだちはなにをたべましたか。', choices: ['カレー', 'すし', 'パン'], answer: 1, why: '友達はすしを食べました。' }
    ] },
  { id: 'read:n5:005', unit: 10, title: '手紙', en: 'A letter',
    text: '田中さん、お元気ですか。私は今、東京に住んでいます。毎日日本語を勉強しています。日本語は難しいですが、面白いです。先生はとても親切です。週末は友達と町を歩いたり、買い物をしたりします。東京は人が多くて、にぎやかです。来月、京都へ旅行に行きます。写真を撮って、送ります。',
    kana: 'たなかさん、おげんきですか。わたしはいま、とうきょうにすんでいます。まいにちにほんごをべんきょうしています。にほんごはむずかしいですが、おもしろいです。せんせいはとてもしんせつです。しゅうまつはともだちとまちをあるいたり、かいものをしたりします。とうきょうはひとがおおくて、にぎやかです。らいげつ、きょうとへりょこうにいきます。しゃしんをとって、おくります。',
    enText: 'Dear Mr Tanaka, how are you? I am living in Tokyo now. I study Japanese every day. Japanese is difficult, but interesting. The teacher is very kind. At weekends I walk around town with friends, go shopping and so on. Tokyo has many people and is lively. Next month I will travel to Kyoto. I will take photos and send them.',
    questions: [
      { q: '今どこに住んでいますか。', qKana: 'いまどこにすんでいますか。', choices: ['京都', '東京', '大阪'], answer: 1, why: '東京に住んでいます。' },
      { q: '日本語はどうですか。', qKana: 'にほんごはどうですか。', choices: ['易しいです', '難しいですが、面白いです', 'つまらないです'], answer: 1, why: '難しいですが、面白いです。' },
      { q: '来月何をしますか。', qKana: 'らいげつなにをしますか。', choices: ['買い物をします', '京都へ行きます', '友達に会います'], answer: 1, why: '来月、京都へ旅行に行きます。' }
    ] },
  { id: 'read:n5:006', unit: 12, title: '病院で', en: 'At the hospital',
    text: '昨日から頭が痛いです。熱もあります。今日は会社を休んで、病院に行きました。病院は駅の近くにあります。医者は「風邪ですね。薬を飲んで、ゆっくり休んでください。お酒を飲んではいけません。」と言いました。薬は一日に三回、ご飯の後で飲まなければなりません。明日も会社に行きません。',
    kana: 'きのうからあたまがいたいです。ねつもあります。きょうはかいしゃをやすんで、びょういんにいきました。びょういんはえきのちかくにあります。いしゃは「かぜですね。くすりをのんで、ゆっくりやすんでください。おさけをのんではいけません。」といいました。くすりはいちにちにさんかい、ごはんのあとでのまなければなりません。あしたもかいしゃにいきません。',
    enText: 'I have had a headache since yesterday. I also have a fever. Today I took the day off work and went to the hospital. The hospital is near the station. The doctor said, "It\'s a cold. Take the medicine and rest well. You must not drink alcohol." I have to take the medicine three times a day, after meals. I will not go to work tomorrow either.',
    questions: [
      { q: 'どこが痛いですか。', qKana: 'どこがいたいですか。', choices: ['お腹', '頭', '足'], answer: 1, why: '頭が痛いです。' },
      { q: '薬は一日に何回飲みますか。', qKana: 'くすりはいちにちになんかいのみますか。', choices: ['一回', '二回', '三回'], answer: 2, why: '一日に三回。' },
      { q: '何をしてはいけませんか。', qKana: 'なにをしてはいけませんか。', choices: ['薬を飲む', 'お酒を飲む', '休む'], answer: 1, why: 'お酒を飲んではいけません。' }
    ] },
  { id: 'read:n5:007', unit: 14, title: '駅で', en: 'At the station',
    text: 'すみません、東京へ行きたいんですが、どの電車に乗ればいいですか。「東京ですか。三番のホームから出る電車に乗ってください。次の電車は十時十五分に出ます。」ありがとうございます。切符はいくらですか。「八百円です。あそこで買うことができます。」分かりました。どうもありがとうございました。',
    kana: 'すみません、とうきょうへいきたいんですが、どのでんしゃにのればいいですか。「とうきょうですか。さんばんのホームからでるでんしゃにのってください。つぎのでんしゃはじゅうじじゅうごふんにでます。」ありがとうございます。きっぷはいくらですか。「はっぴゃくえんです。あそこでかうことができます。」わかりました。どうもありがとうございました。',
    enText: 'Excuse me, I want to go to Tokyo; which train should I take? "Tokyo? Please take the train that leaves from platform three. The next train leaves at 10:15." Thank you. How much is a ticket? "800 yen. You can buy one over there." I see. Thank you very much.',
    questions: [
      { q: '電車は何番のホームから出ますか。', qKana: 'でんしゃはなんばんのホームからでますか。', choices: ['一番', '二番', '三番'], answer: 2, why: '三番のホームから出る電車。' },
      { q: '次の電車は何時に出ますか。', qKana: 'つぎのでんしゃはなんじにでますか。', choices: ['十時', '十時十五分', '十時五十分'], answer: 1, why: '十時十五分に出ます。' },
      { q: '切符はいくらですか。', qKana: 'きっぷはいくらですか。', choices: ['六百円', '八百円', '千円'], answer: 1, why: '八百円です。' }
    ] },
  { id: 'read:n5:008', unit: 16, title: '新しい友達', en: 'A new friend',
    text: '先月、新しい友達ができました。名前はマリアさんです。マリアさんはスペインから来ました。日本語がとても上手です。私より上手だと思います。マリアさんは料理が好きで、よく日本料理を作ります。先週、私の家でてんぷらを作ってくれました。とてもおいしかったです。今度は私がスペイン料理を習いたいです。',
    kana: 'せんげつ、あたらしいともだちができました。なまえはマリアさんです。マリアさんはスペインからきました。にほんごがとてもじょうずです。わたしよりじょうずだとおもいます。マリアさんはりょうりがすきで、よくにほんりょうりをつくります。せんしゅう、わたしのいえでてんぷらをつくってくれました。とてもおいしかったです。こんどはわたしがスペインりょうりをならいたいです。',
    enText: 'Last month I made a new friend. Her name is Maria. Maria came from Spain. Her Japanese is very good. I think she is better than me. Maria likes cooking and often makes Japanese food. Last week she made tempura for me at my house. It was delicious. Next time I want to learn Spanish cooking.',
    questions: [
      { q: 'マリアさんはどこから来ましたか。', qKana: 'マリアさんはどこからきましたか。', choices: ['日本', 'スペイン', 'アメリカ'], answer: 1, why: 'スペインから来ました。' },
      { q: 'マリアさんは何が好きですか。', qKana: 'マリアさんはなにがすきですか。', choices: ['料理', '音楽', 'スポーツ'], answer: 0, why: '料理が好きで…' },
      { q: '先週、何を作りましたか。', qKana: 'せんしゅう、なにをつくりましたか。', choices: ['すし', 'カレー', 'てんぷら'], answer: 2, why: 'てんぷらを作ってくれました。' }
    ] },
  { id: 'read:n5:009', unit: 19, title: '日本の四季', en: 'Japan\'s four seasons',
    text: '日本には春、夏、秋、冬があります。春は暖かくて、花がきれいです。多くの人が公園で花を見ながらお弁当を食べます。夏はとても暑いです。海や山に行く人が多いです。秋は涼しくて、食べ物がおいしいです。冬は寒いです。北の町では雪がたくさん降ります。私は秋が一番好きです。あなたはどの季節が好きですか。',
    kana: 'にほんにははる、なつ、あき、ふゆがあります。はるはあたたかくて、はながきれいです。おおくのひとがこうえんではなをみながらおべんとうをたべます。なつはとてもあついです。うみやまにいくひとがおおいです。あきはすずしくて、たべものがおいしいです。ふゆはさむいです。きたのまちではゆきがたくさんふります。わたしはあきがいちばんすきです。あなたはどのきせつがすきですか。',
    enText: 'Japan has spring, summer, autumn and winter. Spring is warm and the flowers are beautiful. Many people eat boxed lunches in parks while looking at the flowers. Summer is very hot. Many people go to the sea or the mountains. Autumn is cool and the food is delicious. Winter is cold. In northern towns a lot of snow falls. I like autumn best. Which season do you like?',
    questions: [
      { q: '春はどうですか。', qKana: 'はるはどうですか。', choices: ['暑いです', '暖かいです', '寒いです'], answer: 1, why: '春は暖かくて…' },
      { q: '冬に北の町で何が降りますか。', qKana: 'ふゆにきたのまちでなにがふりますか。', choices: ['雨', '雪', '花'], answer: 1, why: '雪がたくさん降ります。' },
      { q: 'この人はどの季節が一番好きですか。', qKana: 'このひとはどのきせつがいちばんすきですか。', choices: ['春', '夏', '秋'], answer: 2, why: '秋が一番好きです。' }
    ] },
  { id: 'read:n5:010', unit: 21, title: '来年の計画', en: 'Plans for next year',
    text: '来年、私は日本へ行くつもりです。日本で日本語の学校に入って、一年勉強したいです。お金が必要ですから、今アルバイトをしています。週に三回、レストランで働いています。大変ですが、楽しいです。日本に着いたら、まず京都へ行きたいです。古いお寺や神社を見たいです。それから、日本の友達をたくさん作りたいです。日本語が上手になったら、日本の会社で働きたいと思っています。',
    kana: 'らいねん、わたしはにほんへいくつもりです。にほんでにほんごのがっこうにはいって、いちねんべんきょうしたいです。おかねがひつようですから、いまアルバイトをしています。しゅうにさんかい、レストランではたらいています。たいへんですが、たのしいです。にほんについたら、まずきょうとへいきたいです。ふるいおてらやじんじゃをみたいです。それから、にほんのともだちをたくさんつくりたいです。にほんごがじょうずになったら、にほんのかいしゃではたらきたいとおもっています。',
    enText: 'Next year I intend to go to Japan. I want to enter a Japanese language school and study for a year. I need money, so I am doing a part-time job now. I work at a restaurant three times a week. It is hard but fun. When I arrive in Japan I want to go to Kyoto first. I want to see old temples and shrines. Then I want to make many Japanese friends. Once my Japanese is good, I am thinking of working at a Japanese company.',
    questions: [
      { q: 'この人は来年何をするつもりですか。', qKana: 'このひとはらいねんなにをするつもりですか。', choices: ['日本で働きます', '日本語の学校で勉強します', '京都に住みます'], answer: 1, why: '日本語の学校に入って、一年勉強したいです。' },
      { q: '今、何をしていますか。', qKana: 'いま、なにをしていますか。', choices: ['アルバイトをしています', '日本に住んでいます', '会社で働いています'], answer: 0, why: '今アルバイトをしています。' },
      { q: '日本に着いたら、まずどこへ行きたいですか。', qKana: 'にほんについたら、まずどこへいきたいですか。', choices: ['東京', '京都', '会社'], answer: 1, why: 'まず京都へ行きたいです。' }
    ] }
];

// Listening drills: dictation (type what you hear), comprehension (question after a short passage), shadow (speak along).
export const LISTENING = [
  { id: 'listen:n5:001', unit: 3, type: 'dictation', title: 'Dictation: introductions', items: [
    { text: '私は学生です。', kana: 'わたしはがくせいです。', en: 'I am a student.' },
    { text: '田中さんは先生です。', kana: 'たなかさんはせんせいです。', en: 'Mr Tanaka is a teacher.' },
    { text: 'これは私の本です。', kana: 'これはわたしのほんです。', en: 'This is my book.' },
    { text: '家族は四人です。', kana: 'かぞくはよにんです。', en: 'My family is four people.' }
  ] },
  { id: 'listen:n5:002', unit: 5, type: 'dictation', title: 'Dictation: times and numbers', items: [
    { text: '七時に起きます。', kana: 'しちじにおきます。', en: 'I get up at seven.' },
    { text: '九時から五時まで働きます。', kana: 'くじからごじまではたらきます。', en: 'I work from nine to five.' },
    { text: 'りんごを三つください。', kana: 'りんごをみっつください。', en: 'Three apples, please.' },
    { text: 'この本は千円です。', kana: 'このほんはせんえんです。', en: 'This book is 1,000 yen.' }
  ] },
  { id: 'listen:n5:003', unit: 7, type: 'comprehension', title: 'Where is it?', items: [
    { text: '銀行は駅の前にあります。郵便局は銀行の隣です。', kana: 'ぎんこうはえきのまえにあります。ゆうびんきょくはぎんこうのとなりです。', en: 'The bank is in front of the station. The post office is next to the bank.',
      questions: [{ q: '郵便局はどこですか。', qKana: 'ゆうびんきょくはどこですか。', choices: ['駅の前', '銀行の隣', '駅の中'], answer: 1, why: '郵便局は銀行の隣です。' }] },
    { text: '猫は椅子の下にいます。犬は庭にいます。', kana: 'ねこはいすのしたにいます。いぬはにわにいます。', en: 'The cat is under the chair. The dog is in the garden.',
      questions: [{ q: '犬はどこにいますか。', qKana: 'いぬはどこにいますか。', choices: ['椅子の下', '庭', '部屋'], answer: 1, why: '犬は庭にいます。' }] }
  ] },
  { id: 'listen:n5:004', unit: 9, type: 'shadow', title: 'Shadowing: requests', items: [
    { text: 'ここに名前を書いてください。', kana: 'ここになまえをかいてください。', en: 'Please write your name here.' },
    { text: 'ちょっと待ってください。', kana: 'ちょっとまってください。', en: 'Please wait a moment.' },
    { text: 'もう一度言ってください。', kana: 'もういちどいってください。', en: 'Please say it once more.' },
    { text: 'ゆっくり話してください。', kana: 'ゆっくりはなしてください。', en: 'Please speak slowly.' }
  ] },
  { id: 'listen:n5:005', unit: 11, type: 'comprehension', title: 'A phone call', items: [
    { text: 'もしもし、田中です。明日の会議は十時からです。九時半に会社に来てください。', kana: 'もしもし、たなかです。あしたのかいぎはじゅうじからです。くじはんにかいしゃにきてください。', en: 'Hello, this is Tanaka. Tomorrow\'s meeting starts at ten. Please come to the office at nine thirty.',
      questions: [{ q: '会議は何時からですか。', qKana: 'かいぎはなんじからですか。', choices: ['九時', '九時半', '十時'], answer: 2, why: '会議は十時からです。' }, { q: '何時に会社に来ますか。', qKana: 'なんじにかいしゃにきますか。', choices: ['九時', '九時半', '十時'], answer: 1, why: '九時半に来てください。' }] }
  ] },
  { id: 'listen:n5:006', unit: 13, type: 'dictation', title: 'Dictation: daily life', items: [
    { text: '寝る前に歯を磨きます。', kana: 'ねるまえにはをみがきます。', en: 'I brush my teeth before bed.' },
    { text: '日本に行ったことがあります。', kana: 'にほんにいったことがあります。', en: 'I have been to Japan.' },
    { text: '休みの日は本を読んだり、映画を見たりします。', kana: 'やすみのひはほんをよんだり、えいがをみたりします。', en: 'On days off I read, watch films and so on.' }
  ] },
  { id: 'listen:n5:007', unit: 17, type: 'comprehension', title: 'Weather forecast', items: [
    { text: '明日の天気です。東京は朝は雨が降るでしょう。午後は晴れるでしょう。寒くなりますから、暖かい服を着てください。', kana: 'あしたのてんきです。とうきょうはあさはあめがふるでしょう。ごごははれるでしょう。さむくなりますから、あたたかいふくをきてください。', en: 'Tomorrow\'s weather. In Tokyo it will probably rain in the morning. In the afternoon it will clear up. It will get cold, so please wear warm clothes.',
      questions: [{ q: '明日の午後はどうなりますか。', qKana: 'あしたのごごはどうなりますか。', choices: ['雨が降ります', '晴れます', '雪が降ります'], answer: 1, why: '午後は晴れるでしょう。' }] }
  ] },
  { id: 'listen:n5:008', unit: 20, type: 'shadow', title: 'Shadowing: opinions and plans', items: [
    { text: '明日は雨が降ると思います。', kana: 'あしたはあめがふるとおもいます。', en: 'I think it will rain tomorrow.' },
    { text: '来年日本へ行くつもりです。', kana: 'らいねんにほんへいくつもりです。', en: 'I intend to go to Japan next year.' },
    { text: '日本語が上手になりました。', kana: 'にほんごがじょうずになりました。', en: 'My Japanese has become good.' }
  ] }
];
