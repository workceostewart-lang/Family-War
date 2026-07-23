/** @typedef {{ text: string, points: number, aliases?: string[] }} Answer */
/** @typedef {{ prompt: string, answers: Answer[], group: string }} VariationQuestion */

/**
 * Builds five distinct phrasings around one rapid-fire survey theme. Grouping
 * the variants keeps the bank maintainable while every prompt remains unique.
 *
 * @param {string} group
 * @param {string[]} prompts
 * @param {Answer[]} answers
 * @returns {VariationQuestion[]}
 */
const variationSet = (group, prompts, answers) => prompts.map((prompt) => ({
  prompt,
  group,
  answers: answers.map((answer) => ({
    ...answer,
    ...(answer.aliases ? { aliases: [...answer.aliases] } : {}),
  })),
}));

export const SUDDEN_DEATH_VARIATIONS = [
  ...variationSet("morning-alarm", [
    "Name the first thing people do when the morning alarm rings.",
    "Name a common reaction to hearing an alarm clock.",
    "What do people often do right after their wake-up alarm sounds?",
    "Name something people do before getting out of bed in the morning.",
    "Name a habit people have when their alarm wakes them.",
  ], [
    { text: "Hit snooze", points: 48, aliases: ["snooze"] },
    { text: "Get out of bed", points: 35, aliases: ["get up", "wake up"] },
    { text: "Check their phone", points: 26, aliases: ["phone"] },
  ]),
  ...variationSet("forgotten-essentials", [
    "Name something people turn around and go home to get.",
    "Name an essential item people realize they forgot after leaving home.",
    "Name something people check their pockets for before a trip.",
    "Name an item that can ruin the day when left at home.",
    "Name something people hate forgetting on the way to work.",
  ], [
    { text: "Phone", points: 47, aliases: ["cell phone"] },
    { text: "Keys", points: 38, aliases: ["car keys", "house keys"] },
    { text: "Wallet", points: 29, aliases: ["purse", "money"] },
  ]),
  ...variationSet("hotel-room", [
    "Name the first thing travelers inspect in a hotel room.",
    "Name something guests notice when entering a hotel room.",
    "Name the part of a hotel room people check before unpacking.",
    "Name something travelers test soon after checking into a hotel.",
    "Name a hotel-room feature guests look at right away.",
  ], [
    { text: "Bed", points: 44, aliases: ["mattress", "sheets"] },
    { text: "Bathroom", points: 36, aliases: ["shower"] },
    { text: "Window view", points: 25, aliases: ["view", "window"] },
  ]),
  ...variationSet("backyard", [
    "Name something families keep in the backyard.",
    "Name something you expect to find behind a family home.",
    "Name an item people use for fun in their backyard.",
    "Name something that makes a backyard ready for guests.",
    "Name a common piece of backyard equipment.",
  ], [
    { text: "Grill", points: 42, aliases: ["barbecue"] },
    { text: "Patio chairs", points: 34, aliases: ["chairs", "outdoor furniture"] },
    { text: "Play equipment", points: 27, aliases: ["swing set", "trampoline"] },
  ]),
  ...variationSet("school-favorites", [
    "Name a part of the school day children look forward to.",
    "Name something students enjoy more than classwork.",
    "Name a favorite time of day for many schoolchildren.",
    "Name something that makes a school day more fun.",
    "Name a school activity children get excited about.",
  ], [
    { text: "Recess", points: 46, aliases: ["playtime"] },
    { text: "Seeing friends", points: 35, aliases: ["friends"] },
    { text: "Lunch", points: 28, aliases: ["lunchtime"] },
  ]),
  ...variationSet("annoying-sounds", [
    "Name a sound that can quickly annoy an entire family.",
    "Name a noise people wish they could turn off.",
    "Name a sound that makes it hard to concentrate at home.",
    "Name a noise that can spoil a quiet morning.",
    "Name a sound people complain about hearing too often.",
  ], [
    { text: "Alarm", points: 41, aliases: ["alarm clock", "car alarm"] },
    { text: "Construction", points: 34, aliases: ["drilling", "hammering"] },
    { text: "Crying baby", points: 27, aliases: ["baby crying"] },
  ]),
  ...variationSet("bathroom-basics", [
    "Name something every family bathroom needs.",
    "Name a fixture you expect to find in a bathroom.",
    "Name something people use every day in the bathroom.",
    "Name a bathroom item a hotel guest expects to have.",
    "Name something a new bathroom cannot do without.",
  ], [
    { text: "Toilet", points: 51 },
    { text: "Sink", points: 36, aliases: ["wash basin"] },
    { text: "Shower", points: 28, aliases: ["bathtub", "tub"] },
  ]),
  ...variationSet("road-trip-snacks", [
    "Name a snack families bring on a road trip.",
    "Name something people eat during a long car ride.",
    "Name a food passengers reach for on the highway.",
    "Name a snack parents pack to keep road-trip travelers happy.",
    "Name something easy to munch in the car.",
  ], [
    { text: "Chips", points: 43, aliases: ["crisps"] },
    { text: "Candy", points: 35, aliases: ["sweets"] },
    { text: "Fruit", points: 26, aliases: ["apples", "grapes"] },
  ]),
  ...variationSet("open-window", [
    "Name a reason someone opens a window at home.",
    "Name why a family might leave a window open.",
    "Name something that makes people reach for the window latch.",
    "Name a reason to open a bedroom window.",
    "Name why someone might crack open a car window.",
  ], [
    { text: "Cool the room", points: 45, aliases: ["too hot", "cool off"] },
    { text: "Fresh air", points: 37, aliases: ["air out room"] },
    { text: "Bad smell", points: 25, aliases: ["odor", "smell"] },
  ]),
  ...variationSet("checkout-line", [
    "Name something displayed beside a grocery checkout line.",
    "Name an impulse item people buy while waiting to pay.",
    "Name something children ask for at the checkout counter.",
    "Name a small item stores place near the cash register.",
    "Name something shoppers notice while standing in the checkout lane.",
  ], [
    { text: "Candy", points: 52, aliases: ["chocolate"] },
    { text: "Magazines", points: 31, aliases: ["magazine"] },
    { text: "Gum", points: 27, aliases: ["chewing gum"] },
  ]),
  ...variationSet("storm-preparation", [
    "Name something families buy before a major storm.",
    "Name an item people gather when severe weather is coming.",
    "Name something people want ready before the power goes out.",
    "Name a supply that disappears from stores before a storm.",
    "Name something families add to an emergency box during bad weather.",
  ], [
    { text: "Bottled water", points: 48, aliases: ["water"] },
    { text: "Flashlights", points: 35, aliases: ["flashlight", "lantern"] },
    { text: "Batteries", points: 28, aliases: ["battery"] },
  ]),
  ...variationSet("homework-excuses", [
    "Name an excuse a student gives for missing homework.",
    "Name something a child might say when homework is not finished.",
    "Name a classic reason students claim they cannot turn in an assignment.",
    "Name an excuse a teacher hears about forgotten homework.",
    "Name a story children tell when schoolwork is late.",
  ], [
    { text: "The dog ate it", points: 42, aliases: ["dog ate homework"] },
    { text: "Forgot it", points: 37, aliases: ["left it at home", "forgot"] },
    { text: "Did not understand", points: 25, aliases: ["too hard", "confused"] },
  ]),
  ...variationSet("neighbor-borrowing", [
    "Name something a neighbor may borrow for a home project.",
    "Name an item people knock on a neighbor's door to borrow.",
    "Name something neighbors commonly lend each other.",
    "Name a household item someone might return to a neighbor late.",
    "Name something useful to borrow from the family next door.",
  ], [
    { text: "Tools", points: 44, aliases: ["hammer", "drill"] },
    { text: "Sugar", points: 34, aliases: ["food ingredient"] },
    { text: "Ladder", points: 27 },
  ]),
  ...variationSet("rushed-morning", [
    "Name something people do when running late in the morning.",
    "Name a shortcut families take during a rushed morning.",
    "Name something that happens when everyone oversleeps.",
    "Name a morning routine people rush when the clock is ticking.",
    "Name something people forget when hurrying out the door.",
  ], [
    { text: "Skip breakfast", points: 42, aliases: ["no breakfast"] },
    { text: "Get dressed quickly", points: 35, aliases: ["rush dressing"] },
    { text: "Forget something", points: 28, aliases: ["leave something behind"] },
  ]),
  ...variationSet("picnic-problems", [
    "Name something that can ruin a family picnic.",
    "Name a problem people may face while eating outdoors.",
    "Name something that sends a picnic home early.",
    "Name an outdoor surprise nobody wants during lunch in the park.",
    "Name something families hope to avoid on picnic day.",
  ], [
    { text: "Rain", points: 49, aliases: ["bad weather", "storm"] },
    { text: "Bugs", points: 34, aliases: ["ants", "insects"] },
    { text: "Strong wind", points: 25, aliases: ["wind"] },
  ]),
  ...variationSet("pet-mischief", [
    "Name something a mischievous pet might destroy.",
    "Name a mess a pet can make while the family is away.",
    "Name something owners hide from a playful puppy.",
    "Name a household item pets often chew or scratch.",
    "Name something that may reveal the pet was home alone.",
  ], [
    { text: "Trash", points: 41, aliases: ["garbage"] },
    { text: "Shoes", points: 36, aliases: ["slippers"] },
    { text: "Furniture", points: 28, aliases: ["couch", "chair"] },
  ]),
  ...variationSet("gym-bag", [
    "Name something people carry in a gym bag.",
    "Name an item exercisers bring to a workout.",
    "Name something useful to have after finishing at the gym.",
    "Name an item people do not want to forget on fitness day.",
    "Name something found beside a treadmill at the gym.",
  ], [
    { text: "Water bottle", points: 49, aliases: ["water"] },
    { text: "Towel", points: 34 },
    { text: "Headphones", points: 27, aliases: ["earbuds"] },
  ]),
  ...variationSet("holiday-dinner", [
    "Name a food served at a big holiday dinner.",
    "Name something families place in the center of a holiday table.",
    "Name a dish guests expect at a festive family meal.",
    "Name a food people save room for during the holidays.",
    "Name something that creates leftovers after a holiday feast.",
  ], [
    { text: "Turkey", points: 46 },
    { text: "Ham", points: 34 },
    { text: "Pie", points: 29, aliases: ["dessert"] },
  ]),
  ...variationSet("waiting-for-bus", [
    "Name something people do while waiting for a bus.",
    "Name how commuters pass time at a bus stop.",
    "Name something students do before the school bus arrives.",
    "Name an activity people choose when the bus is late.",
    "Name something you might see someone doing at a bus shelter.",
  ], [
    { text: "Check their phone", points: 47, aliases: ["phone"] },
    { text: "Listen to music", points: 34, aliases: ["music"] },
    { text: "Read", points: 25, aliases: ["book", "news"] },
  ]),
  ...variationSet("cleaning-car", [
    "Name something people do when cleaning the family car.",
    "Name a chore that makes a dirty car look better.",
    "Name something drivers clean before a road trip.",
    "Name a part of the car children help clean.",
    "Name something done at a self-service car wash.",
  ], [
    { text: "Vacuum the inside", points: 43, aliases: ["vacuum"] },
    { text: "Wash the outside", points: 38, aliases: ["wash car"] },
    { text: "Clean the windows", points: 26, aliases: ["windows", "windshield"] },
  ]),
  ...variationSet("under-bed", [
    "Name something people discover under a bed.",
    "Name an item that often rolls beneath the bed.",
    "Name something children hide under their bed.",
    "Name something found while cleaning beneath a bed.",
    "Name an item people reach under the bed to retrieve.",
  ], [
    { text: "Shoes", points: 42 },
    { text: "Dust", points: 35, aliases: ["dust bunnies"] },
    { text: "Toys", points: 28, aliases: ["toy"] },
  ]),
  ...variationSet("canceling-plans", [
    "Name a reason someone cancels plans at the last minute.",
    "Name an excuse people use to stay home instead of going out.",
    "Name something that makes a family postpone an outing.",
    "Name a reason a friend might suddenly skip an event.",
    "Name something that can change weekend plans quickly.",
  ], [
    { text: "Feeling sick", points: 46, aliases: ["sick", "illness"] },
    { text: "Too tired", points: 34, aliases: ["tired"] },
    { text: "Family emergency", points: 27, aliases: ["emergency"] },
  ]),
  ...variationSet("work-desk", [
    "Name something people keep on a work desk.",
    "Name an item within reach at an office workstation.",
    "Name something that takes up space on a busy desk.",
    "Name an item people use throughout the workday.",
    "Name something a home-office desk usually holds.",
  ], [
    { text: "Computer", points: 52, aliases: ["laptop", "monitor"] },
    { text: "Phone", points: 31 },
    { text: "Coffee", points: 26, aliases: ["coffee mug", "drink"] },
  ]),
  ...variationSet("pool-day", [
    "Name something families take to the swimming pool.",
    "Name an item children need for a pool day.",
    "Name something found beside a crowded pool.",
    "Name an item people pack before going swimming.",
    "Name something swimmers use before or after getting in the water.",
  ], [
    { text: "Towel", points: 48 },
    { text: "Sunscreen", points: 35, aliases: ["sunblock"] },
    { text: "Goggles", points: 27, aliases: ["swim goggles"] },
  ]),
  ...variationSet("campfire", [
    "Name something families do around a campfire.",
    "Name something people enjoy after lighting a campfire.",
    "Name an activity campers save for after dark.",
    "Name something children remember about sitting by a fire outdoors.",
    "Name something that makes a campfire gathering fun.",
  ], [
    { text: "Roast marshmallows", points: 49, aliases: ["marshmallows", "smores"] },
    { text: "Tell stories", points: 34, aliases: ["stories", "ghost stories"] },
    { text: "Sing songs", points: 25, aliases: ["music", "sing"] },
  ]),
  ...variationSet("power-restored", [
    "Name the first thing people notice when the power comes back on.",
    "Name something families check after an outage ends.",
    "Name something that suddenly starts when electricity returns.",
    "Name a household item people reset after a power outage.",
    "Name something people are happy to use again when power returns.",
  ], [
    { text: "Lights", points: 48 },
    { text: "Appliances", points: 34, aliases: ["television", "refrigerator"] },
    { text: "Clocks", points: 25, aliases: ["clock", "reset time"] },
  ]),
  ...variationSet("home-office", [
    "Name something needed for a useful home office.",
    "Name an item remote workers use every day.",
    "Name something people buy when setting up a workspace at home.",
    "Name an item that makes working from home easier.",
    "Name something commonly seen during a home-office video call.",
  ], [
    { text: "Laptop", points: 49, aliases: ["computer"] },
    { text: "Desk", points: 35, aliases: ["table"] },
    { text: "Headset", points: 26, aliases: ["headphones", "microphone"] },
  ]),
  ...variationSet("airport-security", [
    "Name something travelers remove at airport security.",
    "Name something passengers place in a security tray.",
    "Name an item people have ready before reaching airport screening.",
    "Name something that slows travelers down at a security checkpoint.",
    "Name something airport officers may ask passengers to take out.",
  ], [
    { text: "Shoes", points: 42 },
    { text: "Laptop", points: 36, aliases: ["computer"] },
    { text: "Identification", points: 27, aliases: ["id", "passport"] },
  ]),
  ...variationSet("snack-cabinet", [
    "Name something children hope to find in the snack cabinet.",
    "Name a food families keep for quick snacking.",
    "Name something that disappears quickly from a pantry.",
    "Name a snack people grab between meals.",
    "Name something guests might find in a family's snack drawer.",
  ], [
    { text: "Chips", points: 44 },
    { text: "Cookies", points: 36, aliases: ["cookie"] },
    { text: "Crackers", points: 26 },
  ]),
  ...variationSet("rainy-commute", [
    "Name something commuters wear or carry on a rainy morning.",
    "Name an item people grab before walking into heavy rain.",
    "Name something that keeps a traveler dry on the way to work.",
    "Name rain gear families keep near the front door.",
    "Name something useful when the weather forecast says showers.",
  ], [
    { text: "Umbrella", points: 53 },
    { text: "Raincoat", points: 33, aliases: ["jacket"] },
    { text: "Rain boots", points: 24, aliases: ["boots"] },
  ]),
  ...variationSet("family-group-chat", [
    "Name something families share in a group chat.",
    "Name a message that appears often in a family text thread.",
    "Name something relatives send each other on their phones.",
    "Name something that keeps a family group chat busy.",
    "Name something grandparents enjoy receiving in a family chat.",
  ], [
    { text: "Jokes", points: 39, aliases: ["memes", "funny messages"] },
    { text: "Photos", points: 38, aliases: ["pictures"] },
    { text: "Plans", points: 27, aliases: ["event details", "schedules"] },
  ]),
  ...variationSet("wedding-guests", [
    "Name something guests do at a wedding reception.",
    "Name an activity people enjoy after a wedding ceremony.",
    "Name something relatives look forward to at a wedding.",
    "Name something that keeps wedding guests busy at the reception.",
    "Name something people remember doing at a family wedding.",
  ], [
    { text: "Dance", points: 45, aliases: ["dancing"] },
    { text: "Eat", points: 35, aliases: ["dinner", "food"] },
    { text: "Take photos", points: 27, aliases: ["pictures", "photos"] },
  ]),
  ...variationSet("first-snow", [
    "Name something families do after the first big snow.",
    "Name an activity children want to try on a snowy morning.",
    "Name something neighbors do when the yard turns white.",
    "Name a chore or game that begins after heavy snowfall.",
    "Name something people prepare to do when snow covers the street.",
  ], [
    { text: "Shovel", points: 41, aliases: ["shovel snow"] },
    { text: "Go sledding", points: 35, aliases: ["sled"] },
    { text: "Build a snowman", points: 29, aliases: ["snowman"] },
  ]),
  ...variationSet("school-project", [
    "Name something students make for a school project.",
    "Name a task children complete for a classroom presentation.",
    "Name something parents may help build the night before school.",
    "Name a project students carry carefully into class.",
    "Name something used to show research to classmates.",
  ], [
    { text: "Poster", points: 43, aliases: ["poster board"] },
    { text: "Research report", points: 34, aliases: ["report", "research"] },
    { text: "Model", points: 27, aliases: ["diorama", "display"] },
  ]),
  ...variationSet("birthday-morning", [
    "Name something that makes a birthday morning special.",
    "Name something a child hopes happens after waking up on a birthday.",
    "Name something families do early on someone's birthday.",
    "Name a surprise people enjoy before leaving home on their birthday.",
    "Name something that starts a birthday on a happy note.",
  ], [
    { text: "Open presents", points: 45, aliases: ["gifts", "presents"] },
    { text: "Birthday calls", points: 34, aliases: ["messages", "birthday wishes"] },
    { text: "Special breakfast", points: 27, aliases: ["breakfast"] },
  ]),
  ...variationSet("backyard-party", [
    "Name something that makes a backyard party fun.",
    "Name something hosts prepare for an outdoor family party.",
    "Name something guests expect at a backyard celebration.",
    "Name an activity or feature found at a summer yard party.",
    "Name something people set up before friends arrive in the backyard.",
  ], [
    { text: "Music", points: 39, aliases: ["speaker", "playlist"] },
    { text: "Grill", points: 36, aliases: ["barbecue", "food"] },
    { text: "Games", points: 29, aliases: ["yard games"] },
  ]),
  ...variationSet("restaurant-server", [
    "Name something a restaurant server brings to the table.",
    "Name something diners ask their server for.",
    "Name an item a waiter carries to restaurant guests.",
    "Name something delivered before the main meal arrives.",
    "Name something a server checks on during dinner.",
  ], [
    { text: "Menus", points: 42, aliases: ["menu"] },
    { text: "Food order", points: 36, aliases: ["food", "meal"] },
    { text: "Drinks", points: 28, aliases: ["water", "beverages"] },
  ]),
  ...variationSet("lazy-sunday", [
    "Name something people enjoy doing on a lazy Sunday.",
    "Name an activity families choose when Sunday has no plans.",
    "Name something relaxing people do before the new week begins.",
    "Name a way someone spends a quiet Sunday at home.",
    "Name something that makes Sunday feel restful.",
  ], [
    { text: "Sleep in", points: 46, aliases: ["sleep", "nap"] },
    { text: "Watch television", points: 35, aliases: ["tv", "movies"] },
    { text: "Read", points: 26, aliases: ["book"] },
  ]),
  ...variationSet("moving-day", [
    "Name something families need on moving day.",
    "Name an item that disappears quickly while packing a house.",
    "Name something people buy before moving to a new home.",
    "Name something seen everywhere during a household move.",
    "Name something helpers carry or use on moving day.",
  ], [
    { text: "Boxes", points: 52, aliases: ["cardboard boxes"] },
    { text: "Packing tape", points: 31, aliases: ["tape"] },
    { text: "Moving truck", points: 25, aliases: ["truck", "van"] },
  ]),
  ...variationSet("beach-cleanup", [
    "Name something families clean up after a day at the beach.",
    "Name something people shake out before leaving the shore.",
    "Name something beachgoers gather before heading home.",
    "Name something that follows a family home from the beach.",
    "Name a cleanup task people do after swimming in the ocean.",
  ], [
    { text: "Sand", points: 49, aliases: ["shake off sand"] },
    { text: "Towels", points: 34, aliases: ["wet towels"] },
    { text: "Trash", points: 25, aliases: ["garbage", "rubbish"] },
  ]),
  ...variationSet("new-phone", [
    "Name something people do after buying a new phone.",
    "Name the first accessory people get for a new phone.",
    "Name something that takes time when setting up a new phone.",
    "Name something people move onto a replacement phone.",
    "Name something owners personalize on a brand-new phone.",
  ], [
    { text: "Buy a case", points: 44, aliases: ["phone case", "case"] },
    { text: "Download apps", points: 35, aliases: ["apps"] },
    { text: "Transfer contacts", points: 27, aliases: ["contacts", "transfer data"] },
  ]),
  ...variationSet("hiking-trail", [
    "Name something people carry on a hiking trail.",
    "Name an item families pack before a nature hike.",
    "Name something hikers need before leaving the trailhead.",
    "Name an item that makes a long walk outdoors safer.",
    "Name something found in a day-hiker's pack.",
  ], [
    { text: "Water", points: 49, aliases: ["water bottle"] },
    { text: "Backpack", points: 34, aliases: ["bag"] },
    { text: "Map", points: 26, aliases: ["trail map", "gps"] },
  ]),
  ...variationSet("family-reunion", [
    "Name something relatives do at a family reunion.",
    "Name something that happens when distant family meets again.",
    "Name an activity people remember from a large family gathering.",
    "Name something everyone wants at a reunion.",
    "Name something relatives share when the whole family gets together.",
  ], [
    { text: "Hug", points: 39, aliases: ["hugs", "greet each other"] },
    { text: "Take photos", points: 36, aliases: ["photos", "pictures"] },
    { text: "Eat", points: 29, aliases: ["food", "meal"] },
  ]),
  ...variationSet("movie-night", [
    "Name something families prepare for movie night.",
    "Name something people want within reach during a home movie.",
    "Name an item that makes watching a movie on the couch better.",
    "Name something children gather before the family film starts.",
    "Name something likely to pause a family movie when it goes missing.",
  ], [
    { text: "Popcorn", points: 49, aliases: ["snacks"] },
    { text: "Blanket", points: 33, aliases: ["blankets"] },
    { text: "Remote control", points: 27, aliases: ["remote"] },
  ]),
  ...variationSet("child-bedtime", [
    "Name something a child asks for at bedtime.",
    "Name something parents bring before saying goodnight.",
    "Name something that helps a child settle down for sleep.",
    "Name a request children make after being tucked into bed.",
    "Name something found beside a child's bed at night.",
  ], [
    { text: "Story", points: 45, aliases: ["book", "bedtime story"] },
    { text: "Water", points: 35, aliases: ["drink"] },
    { text: "Nightlight", points: 26, aliases: ["light"] },
  ]),
  ...variationSet("family-garden", [
    "Name something families grow in a garden.",
    "Name something people care for in the backyard garden.",
    "Name something children help plant outside.",
    "Name something found in a well-kept home garden.",
    "Name something gardeners check during the growing season.",
  ], [
    { text: "Flowers", points: 43 },
    { text: "Vegetables", points: 37, aliases: ["tomatoes", "produce"] },
    { text: "Herbs", points: 25, aliases: ["basil", "mint"] },
  ]),
  ...variationSet("mechanic-visit", [
    "Name something a mechanic checks during a car service.",
    "Name a car problem drivers ask a mechanic to inspect.",
    "Name something that may need replacing at an auto shop.",
    "Name a part of the car people worry about before a long drive.",
    "Name something listed on a routine vehicle-service bill.",
  ], [
    { text: "Oil", points: 43, aliases: ["oil change"] },
    { text: "Tires", points: 36, aliases: ["tire pressure"] },
    { text: "Engine", points: 28, aliases: ["motor"] },
  ]),
  ...variationSet("amusement-park", [
    "Name something families expect at an amusement park.",
    "Name something children get excited about at a theme park.",
    "Name something people spend time doing between theme-park attractions.",
    "Name something that makes an amusement-park day memorable.",
    "Name something visitors complain about at a busy theme park.",
  ], [
    { text: "Rides", points: 51, aliases: ["roller coasters"] },
    { text: "Food", points: 31, aliases: ["snacks", "cotton candy"] },
    { text: "Long lines", points: 25, aliases: ["lines", "waiting"] },
  ]),
  ...variationSet("holiday-travel", [
    "Name something families deal with during holiday travel.",
    "Name something travelers carry when visiting relatives for a holiday.",
    "Name something that makes a holiday trip more difficult.",
    "Name something crowded airports are full of during the holidays.",
    "Name something people double-check before a seasonal family trip.",
  ], [
    { text: "Luggage", points: 41, aliases: ["bags", "suitcases"] },
    { text: "Gifts", points: 34, aliases: ["presents"] },
    { text: "Delays", points: 28, aliases: ["traffic", "late flights"] },
  ]),
  ...variationSet("neighborhood-walk", [
    "Name something people do during a walk around the neighborhood.",
    "Name something families may bring on an evening neighborhood walk.",
    "Name something neighbors do when they pass each other outside.",
    "Name a reason people take a walk close to home.",
    "Name something you might see someone doing on a neighborhood sidewalk.",
  ], [
    { text: "Walk the dog", points: 44, aliases: ["dog", "pet"] },
    { text: "Wave to neighbors", points: 34, aliases: ["say hello", "greet neighbors"] },
    { text: "Exercise", points: 27, aliases: ["get fresh air", "fitness"] },
  ]),
  ...variationSet("family-calendar", [
    "Name something families write on a wall calendar.",
    "Name an event parents mark so nobody forgets it.",
    "Name something that fills up a busy family schedule.",
    "Name something people check the family calendar for.",
    "Name a date households often circle on a calendar.",
  ], [
    { text: "Appointments", points: 41, aliases: ["doctor appointments"] },
    { text: "Birthdays", points: 36, aliases: ["birthday"] },
    { text: "School events", points: 28, aliases: ["games", "school activities"] },
  ]),
  ...variationSet("lost-at-home", [
    "Name something family members often search for around the house.",
    "Name an item people accuse someone else of moving.",
    "Name something that always seems to disappear at home.",
    "Name a household item people find in the last place they look.",
    "Name something families waste time trying to locate.",
  ], [
    { text: "Keys", points: 43 },
    { text: "Remote control", points: 37, aliases: ["remote"] },
    { text: "Phone", points: 27, aliases: ["cell phone"] },
  ]),
  ...variationSet("weeknight-dinner", [
    "Name a quick meal families make on a busy weeknight.",
    "Name something parents cook when there is little time for dinner.",
    "Name a meal children are happy to eat after school activities.",
    "Name something families serve when nobody planned dinner.",
    "Name a food that saves the evening when everyone is hungry.",
  ], [
    { text: "Pizza", points: 44 },
    { text: "Pasta", points: 35, aliases: ["spaghetti", "noodles"] },
    { text: "Sandwiches", points: 27, aliases: ["sandwich"] },
  ]),
  ...variationSet("front-porch", [
    "Name something people place on a front porch.",
    "Name something visitors notice before reaching the front door.",
    "Name an item that makes a porch feel welcoming.",
    "Name something families decorate near the entrance of their home.",
    "Name something that may be waiting on the porch after work.",
  ], [
    { text: "Chairs", points: 38, aliases: ["porch swing", "seating"] },
    { text: "Plants", points: 35, aliases: ["flowers"] },
    { text: "Packages", points: 29, aliases: ["delivery", "boxes"] },
  ]),
  ...variationSet("family-breakfast", [
    "Name something served at a relaxed family breakfast.",
    "Name a food people make when everyone is home in the morning.",
    "Name something children ask for at a weekend breakfast.",
    "Name a breakfast food that brings the family to the table.",
    "Name something that smells good on a slow morning at home.",
  ], [
    { text: "Pancakes", points: 44 },
    { text: "Eggs", points: 35 },
    { text: "Bacon", points: 27 },
  ]),
  ...variationSet("playroom", [
    "Name something commonly found on a playroom floor.",
    "Name something children leave scattered after playtime.",
    "Name an item parents step on in a child's play area.",
    "Name something families store in bins in the playroom.",
    "Name something that makes cleaning a playroom take time.",
  ], [
    { text: "Building blocks", points: 42, aliases: ["blocks", "lego"] },
    { text: "Toy cars", points: 34, aliases: ["cars"] },
    { text: "Stuffed animals", points: 29, aliases: ["teddy bears", "plush toys"] },
  ]),
  ...variationSet("family-celebration", [
    "Name something people bring to a family celebration.",
    "Name something that appears at nearly every family party.",
    "Name something guests carry into a relative's celebration.",
    "Name something that helps a family event feel festive.",
    "Name something people share during a special family occasion.",
  ], [
    { text: "Food", points: 43, aliases: ["dish", "meal"] },
    { text: "Gifts", points: 35, aliases: ["presents"] },
    { text: "Photos", points: 27, aliases: ["pictures", "camera"] },
  ]),
  ...variationSet("school-morning", [
    "Name something parents check before children leave for school.",
    "Name something children need ready on a school morning.",
    "Name an item families look for just before the school bus arrives.",
    "Name something that belongs by the door on a school day.",
    "Name something parents remind students to take to class.",
  ], [
    { text: "Backpack", points: 45, aliases: ["school bag"] },
    { text: "Lunch", points: 35, aliases: ["lunch box"] },
    { text: "Homework", points: 27, aliases: ["assignment"] },
  ]),
  ...variationSet("family-photos", [
    "Name an occasion when a family takes lots of photos.",
    "Name a time relatives gather everyone together for a picture.",
    "Name an event that fills a family's camera roll.",
    "Name a moment parents want to capture with a photo.",
    "Name a day when someone is always asking the family to smile.",
  ], [
    { text: "Holiday", points: 42, aliases: ["christmas", "holiday gathering"] },
    { text: "Birthday", points: 36 },
    { text: "Vacation", points: 28, aliases: ["trip"] },
  ]),
  ...variationSet("rainy-weekend", [
    "Name something families do during a rainy weekend at home.",
    "Name an indoor activity that saves a wet Saturday.",
    "Name something children enjoy when rain cancels outdoor plans.",
    "Name a way families stay entertained through a rainy afternoon.",
    "Name something people settle in to do when it rains all day.",
  ], [
    { text: "Watch movies", points: 44, aliases: ["movies", "television"] },
    { text: "Play games", points: 35, aliases: ["board games", "video games"] },
    { text: "Bake", points: 27, aliases: ["cook", "baking"] },
  ]),
  ...variationSet("family-car", [
    "Name something families always keep in the car.",
    "Name an item parents are glad to have during a drive.",
    "Name something children expect to find in the family vehicle.",
    "Name something stored in a car for unexpected moments.",
    "Name an item that makes everyday family driving easier.",
  ], [
    { text: "Tissues", points: 38, aliases: ["napkins"] },
    { text: "Phone charger", points: 35, aliases: ["charger"] },
    { text: "Snacks", points: 29, aliases: ["food"] },
  ]),
  ...variationSet("household-rules", [
    "Name a rule parents make for children at home.",
    "Name something children must do before screen time.",
    "Name a household rule that causes family arguments.",
    "Name something parents often repeat as a house rule.",
    "Name a rule guests might hear in a busy family home.",
  ], [
    { text: "Finish chores", points: 42, aliases: ["chores", "clean room"] },
    { text: "Do homework", points: 35, aliases: ["homework"] },
    { text: "Be home on time", points: 27, aliases: ["curfew"] },
  ]),
  ...variationSet("family-pet-care", [
    "Name something families do to care for a pet.",
    "Name a pet chore children can help with.",
    "Name something a dog or cat needs every day.",
    "Name a responsibility that comes with owning a family pet.",
    "Name something pet owners cannot forget before leaving home.",
  ], [
    { text: "Feed it", points: 47, aliases: ["food", "feeding"] },
    { text: "Give it water", points: 34, aliases: ["water"] },
    { text: "Walk it", points: 27, aliases: ["walk the dog", "exercise"] },
  ]),
  ...variationSet("weekend-errands", [
    "Name an errand families often run on Saturday.",
    "Name something people try to finish before the weekend ends.",
    "Name a stop that appears on many family weekend schedules.",
    "Name something parents do while children are out of school.",
    "Name a chore that can take up part of a free weekend.",
  ], [
    { text: "Grocery shopping", points: 46, aliases: ["groceries", "supermarket"] },
    { text: "Laundry", points: 34 },
    { text: "Clean the house", points: 27, aliases: ["cleaning"] },
  ]),
].slice(0, 250);
