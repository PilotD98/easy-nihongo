// N2 graded readings and listening drills (unit numbers refer to N2 units; 60 units).
export const READINGS = [
  { id: 'read:n2:001', unit: 8, title: '高齢化する町', en: 'An ageing town',
    text: '私の住む町では、高齢化が進む一方だ。若者は仕事を求めて都市へ出ていき、残った住民の多くは六十五歳以上である。商店街の店は次々と閉まり、バスの本数も減った。しかし、この状況を変えようとする動きもある。町は空き家を安く貸し出し、移住者を募集し始めた。昨年は三つの家族が引っ越してきて、小さなカフェも開いた。人口が急に増えるわけではないが、町に新しい顔が見えるようになったことは、住民にとって大きな喜びである。',
    kana: 'わたしのすむまちでは、こうれいかがすすむいっぽうだ。わかものはしごとをもとめてとしへでていき、のこったじゅうみんのおおくはろくじゅうごさいいじょうである。しょうてんがいのみせはつぎつぎとしまり、バスのほんすうもへった。しかし、このじょうきょうをかえようとするうごきもある。まちはあきやをやすくかしだし、いじゅうしゃをぼしゅうしはじめた。さくねんはみっつのかぞくがひっこしてきて、ちいさなカフェもひらいた。じんこうがきゅうにふえるわけではないが、まちにあたらしいかおがみえるようになったことは、じゅうみんにとっておおきなよろこびである。',
    enText: 'In the town where I live, ageing keeps advancing. Young people leave for the cities in search of work, and most of the residents who remain are over sixty-five. The shops in the shopping street close one after another, and bus services have been cut. However, there is also a movement to change this situation. The town began renting out empty houses cheaply and recruiting newcomers. Last year three families moved in and a small cafe opened. The population will not suddenly grow, but seeing new faces in town is a great joy for the residents.',
    questions: [
      { q: '若者はなぜ町を出ていきますか。', qKana: 'わかものはなぜまちをでていきますか。', choices: ['仕事を求めて', '家が高いから', '学校がないから'], answer: 0, why: '若者は仕事を求めて都市へ出ていき…' },
      { q: '町は何を始めましたか。', qKana: 'まちはなにをはじめましたか。', choices: ['新しい駅を作った', '空き家を安く貸して移住者を募集した', 'バスを増やした'], answer: 1, why: '空き家を安く貸し出し、移住者を募集し始めた。' },
      { q: '住民は新しい家族が来たことをどう感じていますか。', qKana: 'じゅうみんはあたらしいかぞくがきたことをどうかんじていますか。', choices: ['大きな喜び', '少し心配', '関心がない'], answer: 0, why: '住民にとって大きな喜びである。' }
    ] },
  { id: 'read:n2:002', unit: 16, title: '働き方の変化', en: 'Changing ways of working',
    text: '近年、働き方が大きく変わりつつある。かつては会社に毎日通うのが当たり前だったが、今では自宅で働く人も珍しくない。通勤時間がなくなった分、家族と過ごす時間が増えたと喜ぶ声がある一方で、仕事と生活の区別がつきにくくなったという悩みも聞かれる。ある調査によると、在宅勤務を経験した人の約七割が「続けたい」と答えたという。ただし、新入社員については、先輩から直接学ぶ機会が減ることを心配する意見も多い。働き方は一つではない。それぞれの事情に応じて選べる仕組みこそが求められている。',
    kana: 'きんねん、はたらきかたがおおきくかわりつつある。かつてはかいしゃにまいにちかようのがあたりまえだったが、いまではじたくではたらくひともめずらしくない。つうきんじかんがなくなったぶん、かぞくとすごすじかんがふえたとよろこぶこえがあるいっぽうで、しごととせいかつのくべつがつきにくくなったというなやみもきかれる。あるちょうさによると、ざいたくきんむをけいけんしたひとのやくななわりが「つづけたい」とこたえたという。ただし、しんにゅうしゃいんについては、せんぱいからちょくせつまなぶきかいがへることをしんぱいするいけんもおおい。はたらきかたはひとつではない。それぞれのじじょうにおうじてえらべるしくみこそがもとめられている。',
    enText: 'In recent years the way people work has been changing greatly. Commuting to the office every day used to be taken for granted, but now people working from home are not unusual. While some are glad that, with no commute, they have more time with their families, others worry that the line between work and life has blurred. According to one survey, about seventy percent of those who tried working from home said they wanted to continue. However, for new employees many voice concern that chances to learn directly from seniors are shrinking. There is no single way to work. What is needed is a system that lets people choose according to their circumstances.',
    questions: [
      { q: '在宅勤務の悩みとして挙げられているのは何ですか。', qKana: 'ざいたくきんむのなやみとしてあげられているのはなんですか。', choices: ['通勤時間が長い', '仕事と生活の区別がつきにくい', '給料が下がる'], answer: 1, why: '仕事と生活の区別がつきにくくなったという悩み…' },
      { q: '在宅勤務を続けたい人はどのくらいですか。', qKana: 'ざいたくきんむをつづけたいひとはどのくらいですか。', choices: ['約三割', '約五割', '約七割'], answer: 2, why: '約七割が「続けたい」と答えた。' },
      { q: '筆者が求めているのはどんな仕組みですか。', qKana: 'ひっしゃがもとめているのはどんなしくみですか。', choices: ['全員が在宅で働く仕組み', '事情に応じて選べる仕組み', '毎日会社に通う仕組み'], answer: 1, why: 'それぞれの事情に応じて選べる仕組みこそが求められている。' }
    ] },
  { id: 'read:n2:003', unit: 24, title: '災害に備える', en: 'Preparing for disasters',
    text: '日本は地震や台風などの災害が多い国である。にもかかわらず、日頃から十分に備えている家庭は意外に少ない。市の調査では、三日分の水と食料を用意している世帯は四割にすぎなかった。災害が起きてからでは、店の商品はすぐに売り切れてしまう。だからこそ、普段から準備しておくことが大切なのだ。備えといっても、特別なことをする必要はない。少し多めに食料を買い、古いものから食べて、減った分を買い足す。この習慣を続けるだけで、いざという時に慌てずに済む。家族で避難場所と連絡方法を確認しておくことも忘れてはならない。',
    kana: 'にほんはじしんやたいふうなどのさいがいがおおいくにである。にもかかわらず、ひごろからじゅうぶんにそなえているかていはいがいにすくない。しのちょうさでは、みっかぶんのみずとしょくりょうをよういしているせたいはよんわりにすぎなかった。さいがいがおきてからでは、みせのしょうひんはすぐにうりきれてしまう。だからこそ、ふだんからじゅんびしておくことがたいせつなのだ。そなえといっても、とくべつなことをするひつようはない。すこしおおめにしょくりょうをかい、ふるいものからたべて、へったぶんをかいたす。このしゅうかんをつづけるだけで、いざというときにあわてずにすむ。かぞくでひなんばしょとれんらくほうほうをかくにんしておくこともわすれてはならない。',
    enText: 'Japan is a country with many disasters such as earthquakes and typhoons. Nevertheless, surprisingly few households are well prepared in daily life. In a city survey, only forty percent of households had three days\' worth of water and food ready. Once a disaster strikes, goods in shops sell out immediately. That is precisely why preparing in normal times matters. Preparation does not mean doing anything special. Buy a little extra food, eat the oldest first, and replace what you use. Simply keeping this habit means you will not panic when it counts. Do not forget to confirm evacuation sites and ways of contacting each other as a family.',
    questions: [
      { q: '三日分の水と食料を用意している世帯はどのくらいですか。', qKana: 'みっかぶんのみずとしょくりょうをよういしているせたいはどのくらいですか。', choices: ['二割', '四割', '七割'], answer: 1, why: '四割にすぎなかった。' },
      { q: '筆者が勧めている備え方は何ですか。', qKana: 'ひっしゃがすすめているそなえかたはなんですか。', choices: ['特別な食料を買う', '少し多めに買って古いものから食べる', '災害の後に急いで買う'], answer: 1, why: '少し多めに食料を買い、古いものから食べて、減った分を買い足す。' },
      { q: '家族で確認しておくべきことは何ですか。', qKana: 'かぞくでかくにんしておくべきことはなんですか。', choices: ['避難場所と連絡方法', '店の営業時間', '台風の名前'], answer: 0, why: '避難場所と連絡方法を確認しておくことも忘れてはならない。' }
    ] },
  { id: 'read:n2:004', unit: 32, title: '言葉の変化', en: 'How language changes',
    text: '言葉は生きているとよく言われる。若者の間で生まれた新しい表現が、やがて辞書に載ることも珍しくない。一方で、「正しい日本語が乱れている」と嘆く人も多い。しかし、言葉の変化そのものを止めることはできない。例えば「全然」は、かつては否定の言葉とともに使うものだったが、今では「全然大丈夫」のように肯定でも使われる。これを誤りと見るか、自然な変化と見るかは意見が分かれる。大切なのは、場面に応じて言葉を選ぶ力ではないだろうか。友達との会話で許される表現が、面接や公式の文書でも通じるとは限らないからだ。',
    kana: 'ことばはいきているとよくいわれる。わかもののあいだでうまれたあたらしいひょうげんが、やがてじしょにのることもめずらしくない。いっぽうで、「ただしいにほんごがみだれている」となげくひともおおい。しかし、ことばのへんかそのものをとめることはできない。たとえば「ぜんぜん」は、かつてはひていのことばとともにつかうものだったが、いまでは「ぜんぜんだいじょうぶ」のようにこうていでもつかわれる。これをあやまりとみるか、しぜんなへんかとみるかはいけんがわかれる。たいせつなのは、ばめんにおうじてことばをえらぶちからではないだろうか。ともだちとのかいわでゆるされるひょうげんが、めんせつやこうしきのぶんしょでもつうじるとはかぎらないからだ。',
    enText: 'It is often said that language is alive. New expressions born among young people frequently end up in dictionaries. On the other hand, many lament that "correct Japanese is deteriorating". But change in language itself cannot be stopped. For example, "zenzen" used to be used with negatives, but now it also appears in affirmative uses like "zenzen daijoubu". Whether to see this as an error or as natural change is a matter of opinion. What matters, surely, is the ability to choose words according to the situation. An expression acceptable among friends will not necessarily pass in an interview or an official document.',
    questions: [
      { q: '「全然」について何が書かれていますか。', qKana: '「ぜんぜん」についてなにがかかれていますか。', choices: ['今は肯定でも使われる', '辞書から消えた', '若者は使わない'], answer: 0, why: '今では「全然大丈夫」のように肯定でも使われる。' },
      { q: '筆者が大切だと考えているのは何ですか。', qKana: 'ひっしゃがたいせつだとかんがえているのはなんですか。', choices: ['新しい言葉を使わないこと', '場面に応じて言葉を選ぶ力', '言葉の変化を止めること'], answer: 1, why: '場面に応じて言葉を選ぶ力ではないだろうか。' },
      { q: '言葉の変化について筆者はどう考えていますか。', qKana: 'ことばのへんかについてひっしゃはどうかんがえていますか。', choices: ['止めるべきだ', '止めることはできない', '若者のせいだ'], answer: 1, why: '言葉の変化そのものを止めることはできない。' }
    ] },
  { id: 'read:n2:005', unit: 40, title: '祖母の手紙', en: 'My grandmother\'s letters',
    text: '祖母は八十を過ぎた今も、月に一度必ず手紙をくれる。電話やメールのほうが早いと言っても、「手で書いてこそ気持ちが伝わる」と譲らない。手紙には季節の花のこと、畑で取れた野菜のこと、近所の猫のことなどが、丁寧な字で書かれている。正直に言えば、若いころの私はその手紙をろくに読まずに引き出しにしまっていた。しかし、仕事で失敗して落ち込んでいた時、ふと古い手紙を読み返し、涙が止まらなくなった。どの手紙にも、私を信じ、見守る言葉があったからだ。それ以来、私も返事を書くようになった。字は下手だが、祖母は「上手になったね」と喜んでくれる。',
    kana: 'そぼははちじゅうをすぎたいまも、つきにいちどかならずてがみをくれる。でんわやメールのほうがはやいといっても、「てでかいてこそきもちがつたわる」とゆずらない。てがみにはきせつのはなのこと、はたけでとれたやさいのこと、きんじょのねこのことなどが、ていねいなじでかかれている。しょうじきにいえば、わかいころのわたしはそのてがみをろくによまずにひきだしにしまっていた。しかし、しごとでしっぱいしておちこんでいたとき、ふとふるいてがみをよみかえし、なみだがとまらなくなった。どのてがみにも、わたしをしんじ、みまもることばがあったからだ。それいらい、わたしもへんじをかくようになった。じはへただが、そぼは「じょうずになったね」とよろこんでくれる。',
    enText: 'Even now, past eighty, my grandmother sends me a letter without fail once a month. When I say phone or email would be faster, she will not budge: "Only by writing by hand are feelings conveyed." Her letters tell of seasonal flowers, vegetables from her field and the neighbourhood cat, in careful handwriting. To be honest, when I was young I barely read them and tucked them in a drawer. But once, when I was down after a failure at work, I happened to reread the old letters and could not stop crying. In every one were words of belief in me and of watching over me. Since then I have written replies too. My handwriting is poor, but my grandmother is pleased and says it has improved.',
    questions: [
      { q: '祖母はなぜ手紙を書きますか。', qKana: 'そぼはなぜてがみをかきますか。', choices: ['電話が苦手だから', '手で書いてこそ気持ちが伝わると思うから', 'メールを知らないから'], answer: 1, why: '「手で書いてこそ気持ちが伝わる」と譲らない。' },
      { q: '筆者はいつ手紙を読み返しましたか。', qKana: 'ひっしゃはいつてがみをよみかえしましたか。', choices: ['仕事で失敗して落ち込んでいた時', '祖母が病気になった時', '引っ越しの時'], answer: 0, why: '仕事で失敗して落ち込んでいた時、ふと古い手紙を読み返し…' },
      { q: 'それ以来、筆者はどうしましたか。', qKana: 'それいらい、ひっしゃはどうしましたか。', choices: ['電話をかけるようになった', '返事を書くようになった', '手紙を捨てた'], answer: 1, why: 'それ以来、私も返事を書くようになった。' }
    ] },
  { id: 'read:n2:006', unit: 48, title: '食品ロスを減らす', en: 'Reducing food waste',
    text: '日本では、まだ食べられるのに捨てられる食品が年間五百万トンを超えるという。これは国民一人あたり、毎日茶碗一杯分のご飯を捨てている計算になる。原因は家庭だけにあるわけではない。店では見た目の悪い野菜が売れ残り、期限の近い商品は棚から下ろされる。こうした状況を受けて、形の悪い野菜を安く売る店や、売れ残りを必要な人に届ける活動が広がりつつある。消費者にできることも多い。買い物の前に冷蔵庫を確認する、食べきれる量だけ注文する、賞味期限と消費期限の違いを知る。どれも小さなことだが、積み重ねれば大きな効果になる。食べ物を粗末にしないという当たり前の心こそ、今の社会に求められているのではないだろうか。',
    kana: 'にほんでは、まだたべられるのにすてられるしょくひんがねんかんごひゃくまんトンをこえるという。これはこくみんひとりあたり、まいにちちゃわんいっぱいぶんのごはんをすてているけいさんになる。げんいんはかていだけにあるわけではない。みせではみためのわるいやさいがうれのこり、きげんのちかいしょうひんはたなからおろされる。こうしたじょうきょうをうけて、かたちのわるいやさいをやすくうるみせや、うれのこりをひつようなひとにとどけるかつどうがひろがりつつある。しょうひしゃにできることもおおい。かいもののまえにれいぞうこをかくにんする、たべきれるりょうだけちゅうもんする、しょうみきげんとしょうひきげんのちがいをしる。どれもちいさなことだが、つみかさねればおおきなこうかになる。たべものをそまつにしないというあたりまえのこころこそ、いまのしゃかいにもとめられているのではないだろうか。',
    enText: 'In Japan, more than five million tonnes of food that could still be eaten is thrown away each year. That works out to every citizen discarding a bowl of rice every day. The cause does not lie only in households. In shops, unattractive vegetables go unsold and products near their date are taken off the shelves. In response, shops selling misshapen vegetables cheaply and activities delivering unsold food to those in need are spreading. Consumers can do a lot too: check the fridge before shopping, order only what you can finish, and learn the difference between best-before and use-by dates. Each is small, but together they add up to a big effect. Surely the ordinary attitude of not wasting food is exactly what today\'s society needs.',
    questions: [
      { q: '捨てられる食品はどのくらいですか。', qKana: 'すてられるしょくひんはどのくらいですか。', choices: ['年間五十万トン', '年間五百万トン以上', '年間五千トン'], answer: 1, why: '年間五百万トンを超えるという。' },
      { q: '店で起きている問題は何ですか。', qKana: 'みせでおきているもんだいはなんですか。', choices: ['見た目の悪い野菜が売れ残る', '野菜が足りない', '値段が高すぎる'], answer: 0, why: '見た目の悪い野菜が売れ残り…' },
      { q: '消費者にできることとして挙げられていないものはどれですか。', qKana: 'しょうひしゃにできることとしてあげられていないものはどれですか。', choices: ['冷蔵庫を確認する', '食べきれる量だけ注文する', '毎日外食する'], answer: 2, why: '外食は挙げられていない。' }
    ] },
  { id: 'read:n2:007', unit: 56, title: '企業の社会的責任', en: 'Corporate social responsibility',
    text: '企業の目的は利益を上げることだと長く考えられてきた。しかし近年、利益のみならず、社会に対する責任を果たすことも企業の重要な役割だという考えが広がっている。環境に配慮した製品を作る、従業員の働きやすさを高める、地域の活動に貢献するといった取り組みである。こうした活動は短期的には費用がかかるものの、長い目で見れば企業の信頼を高め、結果として利益につながるとされる。実際、ある調査では、消費者の六割以上が「社会的責任を果たしている企業の商品を選びたい」と答えた。もちろん、宣伝のためだけの活動は、かえって信頼を失いかねない。本当に大切なのは、言葉ではなく行動が伴っているかどうかである。',
    kana: 'きぎょうのもくてきはりえきをあげることだとながくかんがえられてきた。しかしきんねん、りえきのみならず、しゃかいにたいするせきにんをはたすこともきぎょうのじゅうようなやくわりだというかんがえがひろがっている。かんきょうにはいりょしたせいひんをつくる、じゅうぎょういんのはたらきやすさをたかめる、ちいきのかつどうにこうけんするといったとりくみである。こうしたかつどうはたんきてきにはひようがかかるものの、ながいめでみればきぎょうのしんらいをたかめ、けっかとしてりえきにつながるとされる。じっさい、あるちょうさでは、しょうひしゃのろくわりいじょうが「しゃかいてきせきにんをはたしているきぎょうのしょうひんをえらびたい」とこたえた。もちろん、せんでんのためだけのかつどうは、かえってしんらいをうしないかねない。ほんとうにたいせつなのは、ことばではなくこうどうがともなっているかどうかである。',
    enText: 'For a long time it was thought that a company\'s purpose is to make a profit. In recent years, however, the view has spread that fulfilling responsibilities to society, not only profit, is also an important role of a company: making environmentally considerate products, improving conditions for employees, contributing to local activities. Such activities cost money in the short term, but in the long run they are said to raise trust in the company and ultimately lead to profit. Indeed, in one survey more than sixty percent of consumers said they wanted to choose products from companies that fulfil their social responsibility. Of course, activities done purely for publicity may well lose trust instead. What really matters is whether actions, not just words, accompany the claims.',
    questions: [
      { q: '企業の社会的責任の例として挙げられていないものはどれですか。', qKana: 'きぎょうのしゃかいてきせきにんのれいとしてあげられていないものはどれですか。', choices: ['環境に配慮した製品を作る', '税金を払わない', '地域の活動に貢献する'], answer: 1, why: '税金の話は出ていない。' },
      { q: '社会的責任を果たす活動は長い目で見るとどうなりますか。', qKana: 'しゃかいてきせきにんをはたすかつどうはながいめでみるとどうなりますか。', choices: ['費用がかかるだけだ', '信頼を高め利益につながる', '従業員が減る'], answer: 1, why: '企業の信頼を高め、結果として利益につながるとされる。' },
      { q: '筆者が本当に大切だと言っているのは何ですか。', qKana: 'ひっしゃがほんとうにたいせつだといっているのはなんですか。', choices: ['宣伝をたくさんすること', '行動が伴っていること', '利益だけを考えること'], answer: 1, why: '言葉ではなく行動が伴っているかどうかである。' }
    ] }
];

export const LISTENING = [
  { id: 'listen:n2:001', unit: 4, type: 'dictation', title: 'Dictation: business phrases', items: [
    { text: '詳細につきましては、後ほどご連絡いたします。', kana: 'しょうさいにつきましては、のちほどごれんらくいたします。', en: 'Regarding the details, we will contact you later.' },
    { text: 'ご都合のよろしい日時をお知らせください。', kana: 'ごつごうのよろしいにちじをおしらせください。', en: 'Please let us know a convenient date and time.' },
    { text: '恐れ入りますが、少々お待ちいただけますか。', kana: 'おそれいりますが、しょうしょうおまちいただけますか。', en: 'I am sorry, but could you wait a moment?' }
  ] },
  { id: 'listen:n2:002', unit: 12, type: 'comprehension', title: 'Station announcement', items: [
    { text: 'ご乗車の皆様にお知らせいたします。強風の影響により、現在、特急列車は三十分ほど遅れて運転しております。お急ぎのところ、大変ご迷惑をおかけしております。なお、普通列車は通常通り運転しております。', kana: 'ごじょうしゃのみなさまにおしらせいたします。きょうふうのえいきょうにより、げんざい、とっきゅうれっしゃはさんじゅっぷんほどおくれてうんてんしております。おいそぎのところ、たいへんごめいわくをおかけしております。なお、ふつうれっしゃはつうじょうどおりうんてんしております。', en: 'Attention passengers. Due to strong winds, limited express trains are currently running about thirty minutes late. We apologise for the inconvenience to those in a hurry. Local trains are running as normal.',
      questions: [{ q: '特急列車はどのくらい遅れていますか。', qKana: 'とっきゅうれっしゃはどのくらいおくれていますか。', choices: ['十分', '三十分', '一時間'], answer: 1, why: '三十分ほど遅れて運転しております。' }, { q: '遅れの原因は何ですか。', qKana: 'おくれのげんいんはなんですか。', choices: ['強風', '大雪', '事故'], answer: 0, why: '強風の影響により…' }, { q: '普通列車はどうなっていますか。', qKana: 'ふつうれっしゃはどうなっていますか。', choices: ['止まっている', '遅れている', '通常通り運転している'], answer: 2, why: '普通列車は通常通り運転しております。' }] }
  ] },
  { id: 'listen:n2:003', unit: 20, type: 'shadow', title: 'Shadowing: giving opinions', items: [
    { text: 'その案には賛成ですが、費用の面で検討が必要だと思います。', kana: 'そのあんにはさんせいですが、ひようのめんでけんとうがひつようだとおもいます。', en: 'I agree with that proposal, but I think it needs consideration in terms of cost.' },
    { text: '確かにおっしゃる通りですが、別の見方もあるのではないでしょうか。', kana: 'たしかにおっしゃるとおりですが、べつのみかたもあるのではないでしょうか。', en: 'You are certainly right, but might there not be another way of looking at it?' },
    { text: '結論を急ぐより、まず現状を把握すべきではないでしょうか。', kana: 'けつろんをいそぐより、まずげんじょうをはあくすべきではないでしょうか。', en: 'Rather than rushing to a conclusion, should we not first grasp the current situation?' }
  ] },
  { id: 'listen:n2:004', unit: 28, type: 'dictation', title: 'Dictation: news headlines', items: [
    { text: '政府は来年度の予算案を発表しました。', kana: 'せいふはらいねんどのよさんあんをはっぴょうしました。', en: 'The government announced the budget proposal for next fiscal year.' },
    { text: '台風の接近に伴い、各地で避難が呼びかけられています。', kana: 'たいふうのせっきんにともない、かくちでひなんがよびかけられています。', en: 'As the typhoon approaches, evacuation is being urged in various areas.' },
    { text: '新しい制度は四月から実施される予定です。', kana: 'あたらしいせいどはしがつからじっしされるよていです。', en: 'The new system is scheduled to be implemented from April.' }
  ] },
  { id: 'listen:n2:005', unit: 36, type: 'comprehension', title: 'A phone message', items: [
    { text: 'もしもし、山田です。明日の打ち合わせの件ですが、急な出張が入ってしまい、伺えなくなりました。申し訳ありません。代わりに木曜日の午後はいかがでしょうか。資料は本日中にメールでお送りしますので、ご確認の上、ご都合をお知らせください。', kana: 'もしもし、やまだです。あしたのうちあわせのけんですが、きゅうなしゅっちょうがはいってしまい、うかがえなくなりました。もうしわけありません。かわりにもくようびのごごはいかがでしょうか。しりょうはほんじつちゅうにメールでおおくりしますので、ごかくにんのうえ、ごつごうをおしらせください。', en: 'Hello, this is Yamada. About tomorrow\'s meeting: a sudden business trip has come up and I will not be able to come. I am sorry. Would Thursday afternoon suit instead? I will email the materials today, so please check them and let me know your availability.',
      questions: [{ q: '山田さんはなぜ明日行けませんか。', qKana: 'やまださんはなぜあしたいけませんか。', choices: ['病気になった', '急な出張が入った', '資料ができていない'], answer: 1, why: '急な出張が入ってしまい…' }, { q: '代わりにいつを提案していますか。', qKana: 'かわりにいつをていあんしていますか。', choices: ['水曜日の午前', '木曜日の午後', '金曜日の午後'], answer: 1, why: '木曜日の午後はいかがでしょうか。' }, { q: '資料はどうやって送られますか。', qKana: 'しりょうはどうやっておくられますか。', choices: ['メールで', '郵便で', '直接持って行く'], answer: 0, why: '本日中にメールでお送りします。' }] }
  ] },
  { id: 'listen:n2:006', unit: 44, type: 'shadow', title: 'Shadowing: formal requests', items: [
    { text: 'お忙しいところ恐縮ですが、ご確認いただけますでしょうか。', kana: 'おいそがしいところきょうしゅくですが、ごかくにんいただけますでしょうか。', en: 'I am sorry to trouble you when you are busy, but could you please check this?' },
    { text: '差し支えなければ、理由をお聞かせ願えますか。', kana: 'さしつかえなければ、りゆうをおきかせねがえますか。', en: 'If it is no trouble, could you tell me the reason?' },
    { text: '本日はお越しいただき、誠にありがとうございました。', kana: 'ほんじつはおこしいただき、まことにありがとうございました。', en: 'Thank you very much for coming today.' }
  ] }
];
