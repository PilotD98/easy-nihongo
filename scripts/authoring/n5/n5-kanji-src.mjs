// N5 kanji in teaching order (units of five), with original mnemonics.
// Readings, meanings and stroke counts come from KANJIDIC2 at build time.
export const UNIT_TITLES = ['Numbers 1–5', 'Numbers 6–10', 'Big numbers, money, year', 'Days: sun, moon, fire, water, tree', 'Gold, earth, book, person', 'Size and place', 'Nature and body', 'Body and people', 'Family', 'School', 'Time', 'Before, after, every', 'Directions and countries', 'Movement', 'Perception', 'Actions', 'Transport and places', 'Society and weather', 'Colours and sky', 'Living things', 'Standing, town, safety'];

export const KANJI = [
  // Unit 1: numbers
  ['一', 'One line: one.'],
  ['二', 'Two lines: two.'],
  ['三', 'Three lines: three.'],
  ['四', 'A box with legs inside: four legs on a table.'],
  ['五', 'A five-bar gate seen from the side.'],
  // Unit 2
  ['六', 'A hat with two legs underneath: six, a person with a hat.'],
  ['七', 'An upside-down seven with a cross: seven.'],
  ['八', 'Two strokes spreading apart: eight, like a volcano\'s slopes.'],
  ['九', 'A hook with a tail: nine, a bent elbow.'],
  ['十', 'A cross: ten, like the Roman X turned straight.'],
  // Unit 3: big numbers, money, year
  ['百', 'One (一) over a white field (白): a hundred.'],
  ['千', 'A ten (十) with a slash on top: a thousand.'],
  ['万', 'Ten thousand: a bird\'s wing with a hook, counting more than you can see.'],
  ['円', 'A coin seen through a window frame: yen, circle.'],
  ['年', 'A rice plant bending under a new year of grain.'],
  // Unit 4: days of the week part 1
  ['日', 'The sun as a window with one bar: day, sun.'],
  ['月', 'A crescent moon with two lines inside: moon, month.'],
  ['火', 'A person with sparks flying off: fire.'],
  ['水', 'A stream splashing to both sides: water.'],
  ['木', 'A tree with branches and roots: tree, wood.'],
  // Unit 5
  ['金', 'A roof over two nuggets in the ground: gold, money.'],
  ['土', 'A plant sprouting from the ground: earth, soil.'],
  ['本', 'A tree (木) with a mark at its root: origin; a book.'],
  ['人', 'A person walking, seen from the side: person.'],
  ['中', 'A line through the middle of a box: inside, middle.'],
  // Unit 6: size and place
  ['大', 'A person with arms stretched wide: big.'],
  ['小', 'A hook with two small drops: small.'],
  ['上', 'A mark above the line: up, above.'],
  ['下', 'A mark below the line: down, below.'],
  ['山', 'Three peaks: mountain.'],
  // Unit 7: nature and body
  ['川', 'Three flowing lines: river.'],
  ['田', 'A field divided into paddies: rice field.'],
  ['口', 'An open mouth: mouth, opening.'],
  ['目', 'An eye turned on its side, with the pupil lines: eye.'],
  ['耳', 'An ear with its lobe hanging down: ear.'],
  // Unit 8: body and people
  ['手', 'A hand with fingers spread: hand.'],
  ['足', 'A mouth (口) over a leg stepping out: foot, leg; to be enough.'],
  ['力', 'A flexed arm: power, strength.'],
  ['女', 'A figure kneeling gracefully: woman.'],
  ['男', 'Power (力) in the rice field (田): man.'],
  // Unit 9: family
  ['子', 'A child with arms out and legs wrapped: child.'],
  ['父', 'Crossed sticks held in two hands: father.'],
  ['母', 'A woman with two dots: mother.'],
  ['友', 'Two hands reaching for each other: friend.'],
  ['名', 'In the evening (夕) you call out with your mouth (口): name.'],
  // Unit 10: school
  ['先', 'A person stepping ahead of the ground line: ahead, previous.'],
  ['生', 'A plant growing from the earth: life, to be born; raw.'],
  ['学', 'A child (子) under a roof of learning: study.'],
  ['校', 'Wood (木) crossed (交) into a building: school.'],
  ['語', 'Words (言) five (五) mouths (口) speak: language.'],
  // Unit 11: time
  ['今', 'A roof over a now-mark: now.'],
  ['時', 'The sun (日) at the temple (寺): time, hour.'],
  ['分', 'Eight (八) cuts with a sword (刀): to divide; minute.'],
  ['半', 'A thing cut down the middle: half.'],
  ['間', 'The sun (日) seen through a gate (門): interval, between.'],
  // Unit 12: before, after, every
  ['前', 'A boat under the moon with a blade: in front, before.'],
  ['後', 'A short step (彳) with a thread trailing behind: after, behind.'],
  ['午', 'A pestle standing at noon: noon.'],
  ['毎', 'A mother (母) with a hat: every (every day, every week).'],
  ['何', 'A person (亻) carrying something you cannot (可) identify: what.'],
  // Unit 13: directions
  ['東', 'The sun (日) rising behind a tree (木): east.'],
  ['西', 'A bird settling into its nest at sunset: west.'],
  ['南', 'A warm shelter with a plant inside: south.'],
  ['北', 'Two people sitting back to back, facing away from the cold: north.'],
  ['外', 'Evening (夕) divination (卜) done outside: outside.'],
  ['国', 'A jewel (玉) inside borders (囗): country.'],
  // Unit 14: movement
  ['右', 'A hand with a mouth: right (the hand you eat with).'],
  ['左', 'A hand with a carpenter\'s ruler (工): left.'],
  ['来', 'Grain coming in from the field: to come.'],
  ['行', 'A crossroads: to go.'],
  ['出', 'A mountain on top of a mountain, climbing out: to go out, to exit.'],
  // Unit 15: perception
  ['入', 'An arrow entering a tent: to enter.'],
  ['見', 'An eye (目) on legs: to see.'],
  ['聞', 'An ear (耳) at the gate (門): to hear, to listen, to ask.'],
  ['読', 'Words (言) being sold (売): to read.'],
  ['書', 'A brush over a field of paper: to write.'],
  // Unit 16: actions
  ['食', 'A roof over a bowl with a spoon: to eat, food.'],
  ['飲', 'Food (食) and a person yawning (欠) with an open mouth: to drink.'],
  ['話', 'Words (言) from a tongue (舌): to speak, story.'],
  ['買', 'A net (罒) over shells (貝), the old money: to buy.'],
  ['休', 'A person (亻) resting against a tree (木): to rest.'],
  // Unit 17: transport and places
  ['車', 'A cart seen from above, with its axle: car, vehicle.'],
  ['電', 'Rain (雨) with lightning striking down: electricity.'],
  ['駅', 'A horse (馬) and a measure (尺): a post station, a train station.'],
  ['道', 'A head (首) moving along a road (辶): road, way.'],
  ['店', 'A roof (广) over a fortune-teller (占) who set up shop: shop.'],
  // Unit 18: society and weather
  ['社', 'An altar (礻) on the earth (土): shrine; company.'],
  ['会', 'People gathering under a roof: to meet; meeting.'],
  ['気', 'Steam rising from cooking rice: spirit, air, mood.'],
  ['天', 'A big (大) person with the sky above: heaven, sky.'],
  ['雨', 'Raindrops falling behind a window: rain.'],
  // Unit 19: colours and sky
  ['白', 'The sun with a ray of light: white.'],
  ['青', 'A plant growing over a well of clear water: blue, green.'],
  ['赤', 'A person over a fire, glowing: red.'],
  ['黒', 'A chimney blackened by fire (灬): black.'],
  ['空', 'A hole (穴) with nothing but work (工) in it: sky; empty.'],
  // Unit 20: living things and adjectives
  ['花', 'Grass (艹) that changes (化) into a flower: flower.'],
  ['犬', 'A big (大) animal with a dot for its ear: dog.'],
  ['魚', 'A fish with a head, scales and a tail (灬): fish.'],
  ['高', 'A tall tower with a window at the top: tall, high, expensive.'],
  ['長', 'An old man with long hair and a cane: long; chief.'],
  // Unit 21: more places
  ['立', 'A person standing on the ground: to stand.'],
  ['町', 'A rice field (田) with a street (丁): town.'],
  ['安', 'A woman (女) under a roof: peaceful, safe; cheap.']
];
