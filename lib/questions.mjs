import { SUDDEN_DEATH_VARIATIONS } from "./sudden-death-variations.mjs";

/** @typedef {{ text: string, points: number, aliases?: string[] }} Answer */
/** @typedef {{ prompt: string, answers: Answer[], group?: string }} Question */

/** @type {Question[]} */
export const QUESTIONS = [
  {
    prompt: "Name something families always seem to run out of.",
    answers: [
      { text: "Toilet paper", points: 34, aliases: ["bathroom tissue", "tp"] },
      { text: "Milk", points: 22 },
      { text: "Money", points: 16, aliases: ["cash"] },
      { text: "Patience", points: 12 },
      { text: "Snacks", points: 9, aliases: ["food"] },
      { text: "Hot water", points: 7 },
    ],
  },
  {
    prompt: "Name something people do while waiting for food to arrive.",
    answers: [
      { text: "Check their phone", points: 38, aliases: ["use phone", "phone"] },
      { text: "Talk", points: 25, aliases: ["chat", "conversation"] },
      { text: "Drink", points: 14, aliases: ["have a drink"] },
      { text: "Look at the menu", points: 10, aliases: ["read menu"] },
      { text: "People-watch", points: 8, aliases: ["watch people"] },
      { text: "Complain", points: 5 },
    ],
  },
  {
    prompt: "Name a reason a kid tries to stay up past bedtime.",
    answers: [
      { text: "Watch TV", points: 32, aliases: ["television", "tv"] },
      { text: "Play games", points: 24, aliases: ["video games", "gaming"] },
      { text: "Not tired", points: 18, aliases: ["wide awake"] },
      { text: "Read", points: 11, aliases: ["read a book"] },
      { text: "Get a snack", points: 9, aliases: ["snack", "eat"] },
      { text: "Avoid tomorrow", points: 6, aliases: ["school tomorrow"] },
    ],
  },
  {
    prompt: "Name something you might find between couch cushions.",
    answers: [
      { text: "Coins", points: 36, aliases: ["money", "change"] },
      { text: "Food crumbs", points: 25, aliases: ["crumbs", "food"] },
      { text: "Remote control", points: 17, aliases: ["remote"] },
      { text: "Phone", points: 9, aliases: ["cell phone"] },
      { text: "Keys", points: 8 },
      { text: "Toy", points: 5, aliases: ["toys"] },
    ],
  },
  {
    prompt: "Name something that can turn a calm family trip into chaos.",
    answers: [
      { text: "Traffic", points: 31, aliases: ["traffic jam"] },
      { text: "Getting lost", points: 23, aliases: ["wrong directions", "lost"] },
      { text: "Car trouble", points: 18, aliases: ["flat tire", "breakdown"] },
      { text: "Hungry kids", points: 12, aliases: ["hunger", "hungry"] },
      { text: "Bad weather", points: 10, aliases: ["rain", "storm"] },
      { text: "Forgotten bags", points: 6, aliases: ["forgot luggage", "luggage"] },
    ],
  },
  {
    prompt: "Name something people celebrate with cake.",
    answers: [
      { text: "Birthday", points: 48, aliases: ["birthdays"] },
      { text: "Wedding", points: 19, aliases: ["marriage"] },
      { text: "Graduation", points: 12 },
      { text: "Anniversary", points: 9 },
      { text: "Retirement", points: 7 },
      { text: "New baby", points: 5, aliases: ["baby shower"] },
    ],
  },
  {
    prompt: "Name the first thing people do after waking up.",
    answers: [
      { text: "Check their phone", points: 28, aliases: ["phone"] },
      { text: "Use the bathroom", points: 23, aliases: ["bathroom"] },
      { text: "Make coffee", points: 18, aliases: ["coffee"] },
      { text: "Get dressed", points: 13, aliases: ["dress"] },
      { text: "Eat breakfast", points: 11, aliases: ["breakfast"] },
      { text: "Turn off the alarm", points: 7, aliases: ["alarm"] },
    ],
  },
  {
    prompt: "Name a chore kids try hardest to avoid.",
    answers: [
      { text: "Wash dishes", points: 27, aliases: ["dishes"] },
      { text: "Do laundry", points: 22, aliases: ["laundry"] },
      { text: "Clean their room", points: 18, aliases: ["clean room"] },
      { text: "Take out trash", points: 14, aliases: ["trash", "garbage"] },
      { text: "Vacuum", points: 11, aliases: ["vacuuming"] },
      { text: "Yard work", points: 8, aliases: ["mow lawn"] },
    ],
  },
  {
    prompt: "Name something a family brings to a picnic.",
    answers: [
      { text: "Sandwiches", points: 28, aliases: ["sandwich"] },
      { text: "Drinks", points: 22, aliases: ["water", "soda"] },
      { text: "Chips", points: 18 },
      { text: "Fruit", points: 14 },
      { text: "Blanket", points: 10, aliases: ["picnic blanket"] },
      { text: "Sunscreen", points: 8, aliases: ["sunblock"] },
    ],
  },
  {
    prompt: "Name a reason someone arrives late to work or school.",
    answers: [
      { text: "Traffic", points: 35 },
      { text: "Overslept", points: 24, aliases: ["slept in"] },
      { text: "Car trouble", points: 14, aliases: ["car broke down"] },
      { text: "Alarm did not ring", points: 11, aliases: ["alarm"] },
      { text: "Family delay", points: 9, aliases: ["kids", "children"] },
      { text: "Bad weather", points: 7, aliases: ["weather", "snow"] },
    ],
  },
  {
    prompt: "Name something people bring to the beach.",
    answers: [
      { text: "Towel", points: 27, aliases: ["beach towel"] },
      { text: "Sunscreen", points: 22, aliases: ["sunblock"] },
      { text: "Swimsuit", points: 18, aliases: ["bathing suit"] },
      { text: "Cooler", points: 14, aliases: ["food", "drinks"] },
      { text: "Beach chair", points: 11, aliases: ["chair"] },
      { text: "Umbrella", points: 8 },
    ],
  },
  {
    prompt: "Name a favorite family activity on a rainy day.",
    answers: [
      { text: "Watch movies", points: 29, aliases: ["movie", "tv"] },
      { text: "Play games", points: 22, aliases: ["board games", "video games"] },
      { text: "Read", points: 17, aliases: ["books"] },
      { text: "Bake", points: 13, aliases: ["cook"] },
      { text: "Take naps", points: 11, aliases: ["sleep", "nap"] },
      { text: "Play in puddles", points: 8, aliases: ["puddles"] },
    ],
  },
  {
    prompt: "Name something that makes a dog bark.",
    answers: [
      { text: "A stranger", points: 32, aliases: ["strangers", "person"] },
      { text: "Doorbell", points: 22, aliases: ["door bell"] },
      { text: "Another dog", points: 17, aliases: ["dogs"] },
      { text: "A squirrel", points: 12, aliases: ["squirrel", "animal"] },
      { text: "Loud noise", points: 10, aliases: ["noise"] },
      { text: "Wants to go out", points: 7, aliases: ["go outside"] },
    ],
  },
  {
    prompt: "Name a reason someone opens the refrigerator door.",
    answers: [
      { text: "Looking for food", points: 34, aliases: ["hungry", "eat"] },
      { text: "They are bored", points: 21, aliases: ["bored"] },
      { text: "Get a drink", points: 17, aliases: ["thirsty", "drink"] },
      { text: "Cool down", points: 11, aliases: ["hot"] },
      { text: "Check leftovers", points: 9, aliases: ["leftovers"] },
      { text: "See the light", points: 8, aliases: ["light"] },
    ],
  },
  {
    prompt: "Name something you expect to see at a child's birthday party.",
    answers: [
      { text: "Cake", points: 31 },
      { text: "Presents", points: 25, aliases: ["gifts"] },
      { text: "Balloons", points: 16 },
      { text: "Games", points: 12 },
      { text: "Candles", points: 10 },
      { text: "Music", points: 6 },
    ],
  },
  {
    prompt: "Name something people often forget to pack for a trip.",
    answers: [
      { text: "Toothbrush", points: 25, aliases: ["toothpaste"] },
      { text: "Phone charger", points: 22, aliases: ["charger"] },
      { text: "Underwear", points: 18 },
      { text: "Socks", points: 14 },
      { text: "Medicine", points: 12, aliases: ["medication"] },
      { text: "Pajamas", points: 9, aliases: ["sleepwear"] },
    ],
  },
  {
    prompt: "Name a smell that helps people wake up in the morning.",
    answers: [
      { text: "Coffee", points: 36 },
      { text: "Breakfast", points: 22, aliases: ["food"] },
      { text: "Toast", points: 16 },
      { text: "Bacon", points: 12 },
      { text: "Soap", points: 8, aliases: ["shampoo"] },
      { text: "Fresh air", points: 6 },
    ],
  },
  {
    prompt: "Name something a bad houseguest might do.",
    answers: [
      { text: "Leave a mess", points: 28, aliases: ["messy"] },
      { text: "Eat all the food", points: 22, aliases: ["eat food"] },
      { text: "Stay too long", points: 19, aliases: ["overstay"] },
      { text: "Be too loud", points: 13, aliases: ["loud"] },
      { text: "Hog the bathroom", points: 10, aliases: ["bathroom"] },
      { text: "Snore", points: 8, aliases: ["snoring"] },
    ],
  },
  {
    prompt: "Name something you see on a car dashboard.",
    answers: [
      { text: "Gas gauge", points: 31, aliases: ["fuel gauge", "gas"] },
      { text: "Check engine light", points: 25, aliases: ["engine light"] },
      { text: "Speedometer", points: 17, aliases: ["speed"] },
      { text: "Clock", points: 10, aliases: ["time"] },
      { text: "Temperature gauge", points: 9, aliases: ["temperature"] },
      { text: "Navigation", points: 8, aliases: ["gps", "map"] },
    ],
  },
  {
    prompt: "Name a place where people expect to wait in line.",
    answers: [
      { text: "Theme park", points: 27, aliases: ["amusement park"] },
      { text: "Grocery store", points: 24, aliases: ["store", "supermarket"] },
      { text: "Airport", points: 18 },
      { text: "Bank", points: 12 },
      { text: "Concert", points: 11 },
      { text: "DMV", points: 8, aliases: ["motor vehicles"] },
    ],
  },
  {
    prompt: "Name a topic families avoid at a big reunion.",
    answers: [
      { text: "Politics", points: 26 },
      { text: "Money", points: 21, aliases: ["finances"] },
      { text: "Old arguments", points: 18, aliases: ["family drama"] },
      { text: "Relationships", points: 14, aliases: ["dating", "marriage"] },
      { text: "Health", points: 12 },
      { text: "Work", points: 9, aliases: ["jobs"] },
    ],
  },
  {
    prompt: "Name a game families play together at home.",
    answers: [
      { text: "Board games", points: 30, aliases: ["board game"] },
      { text: "Cards", points: 25, aliases: ["card games"] },
      { text: "Video games", points: 16, aliases: ["gaming"] },
      { text: "Trivia", points: 13 },
      { text: "Charades", points: 9 },
      { text: "Hide-and-seek", points: 7, aliases: ["hide and seek"] },
    ],
  },
  {
    prompt: "Name something people do to cool off on a hot day.",
    answers: [
      { text: "Turn on air conditioning", points: 34, aliases: ["air conditioning", "ac"] },
      { text: "Drink something cold", points: 25, aliases: ["cold drink", "drink water"] },
      { text: "Go swimming", points: 18, aliases: ["pool", "swim"] },
      { text: "Use a fan", points: 11, aliases: ["fan"] },
      { text: "Take a shower", points: 7, aliases: ["cold shower"] },
      { text: "Sit in the shade", points: 5, aliases: ["shade"] },
    ],
  },
  {
    prompt: "Name something you smell at a movie theater.",
    answers: [
      { text: "Popcorn", points: 54 },
      { text: "Candy", points: 15 },
      { text: "Soda", points: 11, aliases: ["soft drinks"] },
      { text: "Butter", points: 8 },
      { text: "Nachos", points: 7 },
      { text: "Pizza", points: 5 },
    ],
  },
  {
    prompt: "Name something commonly found in a junk drawer.",
    answers: [
      { text: "Batteries", points: 24, aliases: ["battery"] },
      { text: "Pens", points: 20, aliases: ["pencils"] },
      { text: "Tape", points: 17 },
      { text: "Scissors", points: 15 },
      { text: "Coins", points: 13, aliases: ["change"] },
      { text: "Keys", points: 11 },
    ],
  },
  {
    prompt: "Name a reason a phone battery dies quickly.",
    answers: [
      { text: "Too many apps", points: 28, aliases: ["apps"] },
      { text: "Bright screen", points: 22, aliases: ["screen brightness"] },
      { text: "Forgot to charge", points: 20, aliases: ["not charged"] },
      { text: "Watching videos", points: 13, aliases: ["video"] },
      { text: "Playing games", points: 10, aliases: ["gaming"] },
      { text: "Old battery", points: 7 },
    ],
  },
  {
    prompt: "Name something a child needs for the first day of school.",
    answers: [
      { text: "Backpack", points: 23 },
      { text: "Lunch", points: 22, aliases: ["lunch box"] },
      { text: "New clothes", points: 18, aliases: ["clothes"] },
      { text: "Pencils", points: 15, aliases: ["school supplies"] },
      { text: "Teacher's name", points: 12, aliases: ["teacher"] },
      { text: "Bus information", points: 10, aliases: ["bus"] },
    ],
  },
  {
    prompt: "Name something a neighbor might ask to borrow.",
    answers: [
      { text: "Sugar", points: 23 },
      { text: "A tool", points: 22, aliases: ["tools", "hammer"] },
      { text: "Ladder", points: 17 },
      { text: "Milk", points: 14 },
      { text: "Phone charger", points: 13, aliases: ["charger"] },
      { text: "Lawn mower", points: 11, aliases: ["mower"] },
    ],
  },
  {
    prompt: "Name something a family takes on a camping trip.",
    answers: [
      { text: "Tent", points: 28 },
      { text: "Sleeping bags", points: 22, aliases: ["sleeping bag"] },
      { text: "Flashlight", points: 17, aliases: ["lantern"] },
      { text: "Food", points: 14, aliases: ["snacks"] },
      { text: "Bug spray", points: 11, aliases: ["insect repellent"] },
      { text: "Matches", points: 8, aliases: ["lighter"] },
    ],
  },
  {
    prompt: "Name an alarm that might wake a family in the middle of the night.",
    answers: [
      { text: "Smoke detector", points: 30, aliases: ["fire alarm", "smoke alarm"] },
      { text: "Car alarm", points: 23 },
      { text: "Phone alarm", points: 17, aliases: ["phone"] },
      { text: "Home security alarm", points: 13, aliases: ["burglar alarm"] },
      { text: "A barking pet", points: 12, aliases: ["dog", "pet"] },
      { text: "Alarm clock", points: 5 },
    ],
  },
  {
    prompt: "Name a place people look for a missing remote control.",
    answers: [
      { text: "Couch cushions", points: 40, aliases: ["sofa", "couch"] },
      { text: "Under the couch", points: 19, aliases: ["floor"] },
      { text: "Under a blanket", points: 15, aliases: ["blanket"] },
      { text: "Kitchen", points: 10 },
      { text: "Someone's hand", points: 9, aliases: ["someone has it"] },
      { text: "Bathroom", points: 7 },
    ],
  },
  {
    prompt: "Name something people bring into an office meeting.",
    answers: [
      { text: "Notebook", points: 24, aliases: ["notepad"] },
      { text: "Laptop", points: 21, aliases: ["computer"] },
      { text: "Coffee", points: 18 },
      { text: "Pen", points: 15 },
      { text: "Water", points: 12 },
      { text: "Phone", points: 10 },
    ],
  },
  {
    prompt: "Name something family members argue over at home.",
    answers: [
      { text: "Thermostat", points: 22, aliases: ["temperature"] },
      { text: "Chores", points: 20 },
      { text: "Remote control", points: 18, aliases: ["remote", "tv"] },
      { text: "Bathroom", points: 16 },
      { text: "Money", points: 14 },
      { text: "Where to eat", points: 10, aliases: ["dinner", "food"] },
    ],
  },
  {
    prompt: "Name a food families often order for delivery.",
    answers: [
      { text: "Pizza", points: 37 },
      { text: "Chinese food", points: 18, aliases: ["chinese"] },
      { text: "Burgers", points: 16, aliases: ["hamburgers"] },
      { text: "Chicken wings", points: 12, aliases: ["wings"] },
      { text: "Mexican food", points: 10, aliases: ["tacos", "mexican"] },
      { text: "Sushi", points: 7 },
    ],
  },
  {
    prompt: "Name something you might find in a child's pocket.",
    answers: [
      { text: "Small toy", points: 25, aliases: ["toy"] },
      { text: "Rocks", points: 20, aliases: ["rock", "stones"] },
      { text: "Candy", points: 17 },
      { text: "Coins", points: 14, aliases: ["money", "change"] },
      { text: "Tissue", points: 13 },
      { text: "Crayons", points: 11, aliases: ["crayon"] },
    ],
  },
  {
    prompt: "Name something guests notice at a wedding.",
    answers: [
      { text: "Rings", points: 23, aliases: ["wedding ring"] },
      { text: "Flowers", points: 20 },
      { text: "Cake", points: 18 },
      { text: "Music", points: 15 },
      { text: "Vows", points: 13 },
      { text: "Photographer", points: 11, aliases: ["photos"] },
    ],
  },
  {
    prompt: "Name something families do during a long road trip.",
    answers: [
      { text: "Listen to music", points: 27, aliases: ["music", "radio"] },
      { text: "Eat snacks", points: 23, aliases: ["snacks", "eat"] },
      { text: "Play games", points: 15, aliases: ["games"] },
      { text: "Talk", points: 14, aliases: ["chat"] },
      { text: "Sleep", points: 12, aliases: ["nap"] },
      { text: "Watch the scenery", points: 9, aliases: ["scenery"] },
    ],
  },
  {
    prompt: "Name something people clean before guests arrive.",
    answers: [
      { text: "Bathroom", points: 29 },
      { text: "Living room", points: 24 },
      { text: "Kitchen", points: 19 },
      { text: "Floors", points: 12, aliases: ["vacuum"] },
      { text: "Clutter", points: 9, aliases: ["mess"] },
      { text: "Windows", points: 7 },
    ],
  },
  {
    prompt: "Name a pet that surprises visitors when they see it in a home.",
    answers: [
      { text: "Snake", points: 27 },
      { text: "Lizard", points: 22, aliases: ["iguana"] },
      { text: "Bird", points: 18, aliases: ["parrot"] },
      { text: "Hamster", points: 14, aliases: ["gerbil"] },
      { text: "Spider", points: 11, aliases: ["tarantula"] },
      { text: "Pig", points: 8, aliases: ["mini pig"] },
    ],
  },
  {
    prompt: "Name a decoration families put up for the holidays.",
    answers: [
      { text: "Lights", points: 32, aliases: ["holiday lights"] },
      { text: "Tree", points: 24, aliases: ["christmas tree"] },
      { text: "Wreath", points: 16 },
      { text: "Ornaments", points: 12 },
      { text: "Candles", points: 9 },
      { text: "Inflatable decoration", points: 7, aliases: ["inflatable"] },
    ],
  },
  {
    prompt: "Name something people do as soon as they enter an elevator.",
    answers: [
      { text: "Press a button", points: 30, aliases: ["choose floor"] },
      { text: "Check the floor", points: 21, aliases: ["floor number"] },
      { text: "Look at their phone", points: 20, aliases: ["phone"] },
      { text: "Stand silently", points: 13, aliases: ["silence"] },
      { text: "Look in the mirror", points: 9, aliases: ["mirror"] },
      { text: "Make small talk", points: 7, aliases: ["talk"] },
    ],
  },
  {
    prompt: "Name something people lose at an amusement park.",
    answers: [
      { text: "Sunglasses", points: 23 },
      { text: "Hat", points: 21 },
      { text: "Phone", points: 19 },
      { text: "Money", points: 15, aliases: ["wallet"] },
      { text: "Keys", points: 12 },
      { text: "A family member", points: 10, aliases: ["child", "friend"] },
    ],
  },
  {
    prompt: "Name a food people expect at a backyard cookout.",
    answers: [
      { text: "Burgers", points: 31, aliases: ["hamburgers"] },
      { text: "Hot dogs", points: 24 },
      { text: "Chicken", points: 16 },
      { text: "Corn", points: 12, aliases: ["corn on the cob"] },
      { text: "Salad", points: 10 },
      { text: "Watermelon", points: 7 },
    ],
  },
  {
    prompt: "Name something a parent might pack in a school lunch.",
    answers: [
      { text: "Sandwich", points: 26 },
      { text: "Fruit", points: 19, aliases: ["apple"] },
      { text: "Chips", points: 18 },
      { text: "Cookie", points: 15, aliases: ["dessert"] },
      { text: "Juice", points: 12, aliases: ["drink"] },
      { text: "Leftovers", points: 10 },
    ],
  },
  {
    prompt: "Name something that happens during a routine doctor's visit.",
    answers: [
      { text: "Fill out forms", points: 24, aliases: ["paperwork"] },
      { text: "Wait", points: 22, aliases: ["waiting room"] },
      { text: "Check vital signs", points: 18, aliases: ["blood pressure", "weight"] },
      { text: "Describe symptoms", points: 16, aliases: ["talk to doctor"] },
      { text: "Physical exam", points: 12, aliases: ["exam"] },
      { text: "Get a prescription", points: 8, aliases: ["medicine"] },
    ],
  },
  {
    prompt: "Name something families do on Sunday evening.",
    answers: [
      { text: "Prepare for the week", points: 25, aliases: ["get ready"] },
      { text: "Do laundry", points: 20, aliases: ["laundry"] },
      { text: "Eat dinner", points: 18, aliases: ["dinner"] },
      { text: "Watch TV", points: 15, aliases: ["movie"] },
      { text: "Finish homework", points: 12, aliases: ["homework"] },
      { text: "Relax", points: 10 },
    ],
  },
  {
    prompt: "Name something people do to pass time at an airport.",
    answers: [
      { text: "Use their phone", points: 29, aliases: ["phone"] },
      { text: "Eat", points: 20, aliases: ["food"] },
      { text: "Read", points: 17, aliases: ["book"] },
      { text: "People-watch", points: 14, aliases: ["watch people"] },
      { text: "Shop", points: 11 },
      { text: "Sleep", points: 9, aliases: ["nap"] },
    ],
  },
  {
    prompt: "Name something that can go wrong in a family photo.",
    answers: [
      { text: "Someone blinks", points: 22, aliases: ["closed eyes"] },
      { text: "Someone looks away", points: 20, aliases: ["not looking"] },
      { text: "A child cries", points: 17, aliases: ["crying kid"] },
      { text: "The pet moves", points: 15, aliases: ["dog moves"] },
      { text: "Someone is missing", points: 14, aliases: ["absent"] },
      { text: "Someone makes a silly face", points: 12, aliases: ["funny face"] },
    ],
  },
  {
    prompt: "Name something people keep beside their bed.",
    answers: [
      { text: "Phone", points: 31 },
      { text: "Lamp", points: 21 },
      { text: "Water", points: 17, aliases: ["drink"] },
      { text: "Alarm clock", points: 13, aliases: ["clock"] },
      { text: "Book", points: 10 },
      { text: "Glasses", points: 8 },
    ],
  },
  {
    prompt: "Name something children ask for at the grocery store.",
    answers: [
      { text: "Candy", points: 29 },
      { text: "Cereal", points: 22 },
      { text: "Chips", points: 17 },
      { text: "Cookies", points: 13 },
      { text: "Soda", points: 11 },
      { text: "A toy", points: 8, aliases: ["toy"] },
    ],
  },
  {
    prompt: "Name something people do before an important video call.",
    answers: [
      { text: "Check their appearance", points: 26, aliases: ["fix hair", "get dressed"] },
      { text: "Test the microphone", points: 22, aliases: ["check mic"] },
      { text: "Clean the background", points: 18, aliases: ["background"] },
      { text: "Test the camera", points: 14, aliases: ["camera"] },
      { text: "Find a quiet room", points: 11, aliases: ["quiet place"] },
      { text: "Get a drink", points: 9, aliases: ["water", "coffee"] },
    ],
  },
  {
    prompt: "Name something that makes breakfast feel special.",
    answers: [
      { text: "Pancakes", points: 28 },
      { text: "Bacon", points: 22 },
      { text: "Fresh coffee", points: 17, aliases: ["coffee"] },
      { text: "Eating together", points: 14, aliases: ["family"] },
      { text: "Fresh fruit", points: 11, aliases: ["fruit"] },
      { text: "Breakfast in bed", points: 8 },
    ],
  },
  {
    prompt: "Name something a family might do after dinner.",
    answers: [
      { text: "Watch TV", points: 30, aliases: ["movie"] },
      { text: "Wash dishes", points: 23, aliases: ["clean up"] },
      { text: "Talk", points: 16, aliases: ["chat"] },
      { text: "Take a walk", points: 12, aliases: ["walk"] },
      { text: "Play a game", points: 11, aliases: ["games"] },
      { text: "Eat dessert", points: 8, aliases: ["dessert"] },
    ],
  },
  {
    prompt: "Name a reason someone might knock on your front door.",
    answers: [
      { text: "Deliver a package", points: 31, aliases: ["delivery"] },
      { text: "Visit", points: 23, aliases: ["friend", "family"] },
      { text: "Sell something", points: 15, aliases: ["salesperson"] },
      { text: "Ask for help", points: 12, aliases: ["help"] },
      { text: "Wrong address", points: 10 },
      { text: "Trick-or-treat", points: 9, aliases: ["halloween"] },
    ],
  },
  {
    prompt: "Name something people check before a long car drive.",
    answers: [
      { text: "Gas level", points: 27, aliases: ["fuel", "gas"] },
      { text: "Tires", points: 22, aliases: ["tire pressure"] },
      { text: "Directions", points: 18, aliases: ["map", "gps"] },
      { text: "Oil", points: 14 },
      { text: "Weather", points: 11 },
      { text: "Snacks", points: 8, aliases: ["food"] },
    ],
  },
  {
    prompt: "Name something people save from an important event.",
    answers: [
      { text: "Photos", points: 32, aliases: ["pictures"] },
      { text: "Ticket", points: 20, aliases: ["ticket stub"] },
      { text: "Invitation", points: 16 },
      { text: "Program", points: 12 },
      { text: "Flowers", points: 11 },
      { text: "Video", points: 9 },
    ],
  },
  {
    prompt: "Name something families share during a power outage.",
    answers: [
      { text: "Flashlight", points: 27, aliases: ["lantern"] },
      { text: "Candles", points: 22 },
      { text: "Blankets", points: 17 },
      { text: "Food", points: 14, aliases: ["snacks"] },
      { text: "Stories", points: 11, aliases: ["conversation"] },
      { text: "Phone charger", points: 9, aliases: ["battery pack"] },
    ],
  },
];

/** @type {Question[]} */
export const BONUS_QUESTIONS = [
  {
    prompt: "Name something you do before leaving the house.",
    answers: [
      { text: "Lock the door", points: 46, aliases: ["lock door"] },
      { text: "Check pockets", points: 34, aliases: ["get keys", "grab phone"] },
      { text: "Turn off lights", points: 27, aliases: ["lights"] },
    ],
  },
  {
    prompt: "Name a food that is hard to eat neatly.",
    answers: [
      { text: "Spaghetti", points: 47, aliases: ["pasta", "noodles"] },
      { text: "Tacos", points: 38, aliases: ["taco"] },
      { text: "Ribs", points: 29, aliases: ["barbecue ribs"] },
    ],
  },
  {
    prompt: "Name something people lose at least once a week.",
    answers: [
      { text: "Keys", points: 44, aliases: ["car keys"] },
      { text: "Phone", points: 37, aliases: ["cell phone"] },
      { text: "Remote", points: 25, aliases: ["remote control"] },
    ],
  },
  {
    prompt: "Name a place where people whisper.",
    answers: [
      { text: "Library", points: 52 },
      { text: "Church", points: 33, aliases: ["place of worship"] },
      { text: "Movie theater", points: 24, aliases: ["cinema", "movies"] },
    ],
  },
  {
    prompt: "Name something that makes a weekend feel complete.",
    answers: [
      { text: "Sleeping in", points: 49, aliases: ["sleep", "rest"] },
      { text: "Family time", points: 36, aliases: ["family", "friends"] },
      { text: "Good food", points: 28, aliases: ["dinner", "meal"] },
    ],
  },
  {
    prompt: "Name something kept in a car's glove compartment.",
    answers: [
      { text: "Registration", points: 44, aliases: ["car papers", "manual"] },
      { text: "Napkins", points: 32, aliases: ["tissues"] },
      { text: "Sunglasses", points: 23 },
    ],
  },
  {
    prompt: "Name a food people usually eat with their hands.",
    answers: [
      { text: "Burger", points: 45, aliases: ["hamburger"] },
      { text: "Pizza", points: 38 },
      { text: "French fries", points: 27, aliases: ["fries"] },
    ],
  },
  {
    prompt: "Name a chore people finish before they can relax.",
    answers: [
      { text: "Dishes", points: 43, aliases: ["wash dishes"] },
      { text: "Laundry", points: 31 },
      { text: "Tidy the room", points: 25, aliases: ["clean"] },
    ],
  },
  {
    prompt: "Name something you might see beside a front door.",
    answers: [
      { text: "Welcome mat", points: 47, aliases: ["door mat"] },
      { text: "Shoes", points: 34 },
      { text: "Packages", points: 22, aliases: ["package"] },
    ],
  },
  {
    prompt: "Name a noise that wakes people up.",
    answers: [
      { text: "Alarm clock", points: 55, aliases: ["alarm"] },
      { text: "Crying baby", points: 31, aliases: ["baby"] },
      { text: "Barking dog", points: 25, aliases: ["dog"] },
    ],
  },
  {
    prompt: "Name a reason to call a family member.",
    answers: [
      { text: "Share news", points: 41, aliases: ["news", "talk"] },
      { text: "Ask for help", points: 34, aliases: ["help"] },
      { text: "Wish happy birthday", points: 26, aliases: ["birthday"] },
    ],
  },
  {
    prompt: "Name something children trade with friends.",
    answers: [
      { text: "Trading cards", points: 38, aliases: ["cards"] },
      { text: "Snacks", points: 31, aliases: ["food"] },
      { text: "Toys", points: 24, aliases: ["toy"] },
    ],
  },
  {
    prompt: "Name something people do before a road trip.",
    answers: [
      { text: "Fill the gas tank", points: 46, aliases: ["get gas", "fuel"] },
      { text: "Pack", points: 34, aliases: ["pack bags"] },
      { text: "Check directions", points: 23, aliases: ["map", "gps"] },
    ],
  },
  {
    prompt: "Name something that makes a house smell good.",
    answers: [
      { text: "Candles", points: 42 },
      { text: "Cooking", points: 39, aliases: ["baking", "food"] },
      { text: "Flowers", points: 25 },
    ],
  },
  {
    prompt: "Name an event people dress up for.",
    answers: [
      { text: "Wedding", points: 48 },
      { text: "Party", points: 34 },
      { text: "Job interview", points: 27, aliases: ["interview"] },
    ],
  },
  {
    prompt: "Name something people check twice before leaving home.",
    answers: [
      { text: "Locked door", points: 43, aliases: ["door lock"] },
      { text: "Alarm", points: 31, aliases: ["security alarm"] },
      { text: "Stove", points: 27, aliases: ["oven"] },
    ],
  },
  {
    prompt: "Name a red food.",
    answers: [
      { text: "Apple", points: 48 },
      { text: "Tomato", points: 37 },
      { text: "Strawberry", points: 29, aliases: ["strawberries"] },
    ],
  },
  {
    prompt: "Name something found on a breakfast table.",
    answers: [
      { text: "Coffee", points: 51 },
      { text: "Eggs", points: 36 },
      { text: "Toast", points: 28 },
    ],
  },
  {
    prompt: "Name a place people take selfies.",
    answers: [
      { text: "Vacation spot", points: 44, aliases: ["vacation", "landmark"] },
      { text: "Mirror", points: 34, aliases: ["bathroom"] },
      { text: "Concert", points: 22 },
    ],
  },
  {
    prompt: "Name something siblings often share.",
    answers: [
      { text: "Bedroom", points: 39, aliases: ["room"] },
      { text: "Clothes", points: 31 },
      { text: "Toys", points: 27, aliases: ["games"] },
    ],
  },
  {
    prompt: "Name a reason a family stays indoors all day.",
    answers: [
      { text: "Rain", points: 46, aliases: ["bad weather"] },
      { text: "Too hot", points: 34, aliases: ["heat"] },
      { text: "Someone is sick", points: 28, aliases: ["sick"] },
    ],
  },
  {
    prompt: "Name something guests forget in a hotel room.",
    answers: [
      { text: "Phone charger", points: 41, aliases: ["charger"] },
      { text: "Toiletries", points: 35, aliases: ["toothbrush"] },
      { text: "Clothes", points: 24 },
    ],
  },
  {
    prompt: "Name something most people carry in a wallet.",
    answers: [
      { text: "Credit cards", points: 52, aliases: ["cards"] },
      { text: "Cash", points: 38, aliases: ["money"] },
      { text: "Identification", points: 31, aliases: ["id", "license"] },
    ],
  },
  {
    prompt: "Name something people enjoy on a weekend morning.",
    answers: [
      { text: "Sleeping in", points: 51, aliases: ["sleep"] },
      { text: "Big breakfast", points: 33, aliases: ["breakfast"] },
      { text: "Watching cartoons", points: 23, aliases: ["cartoons", "tv"] },
    ],
  },
  {
    prompt: "Name something people wish for on their birthday.",
    answers: [
      { text: "Good health", points: 40, aliases: ["health"] },
      { text: "Money", points: 35, aliases: ["cash"] },
      { text: "Happiness", points: 29, aliases: ["love"] },
    ],
  },
  {
    prompt: "Name something a student carries in a backpack.",
    answers: [
      { text: "Books", points: 49, aliases: ["textbooks"] },
      { text: "Pencils", points: 33, aliases: ["pens", "school supplies"] },
      { text: "Lunch", points: 24, aliases: ["lunch box", "food"] },
    ],
  },
  {
    prompt: "Name something people do right before going to bed.",
    answers: [
      { text: "Brush their teeth", points: 48, aliases: ["brush teeth"] },
      { text: "Set an alarm", points: 30, aliases: ["alarm"] },
      { text: "Check their phone", points: 26, aliases: ["phone"] },
    ],
  },
  {
    prompt: "Name something you expect to see in a public park.",
    answers: [
      { text: "Trees", points: 43 },
      { text: "Playground", points: 35, aliases: ["play area"] },
      { text: "Benches", points: 26, aliases: ["bench"] },
    ],
  },
  {
    prompt: "Name an excuse people give for skipping a workout.",
    answers: [
      { text: "Too tired", points: 46, aliases: ["tired"] },
      { text: "No time", points: 37, aliases: ["too busy", "busy"] },
      { text: "Too sore", points: 24, aliases: ["sore", "hurt"] },
    ],
  },
  {
    prompt: "Name something people wear on a very cold day.",
    answers: [
      { text: "Coat", points: 52, aliases: ["jacket"] },
      { text: "Hat", points: 31, aliases: ["beanie"] },
      { text: "Gloves", points: 28, aliases: ["mittens"] },
    ],
  },
  {
    prompt: "Name something that rings.",
    answers: [
      { text: "Phone", points: 50, aliases: ["telephone"] },
      { text: "Doorbell", points: 34, aliases: ["door bell"] },
      { text: "Alarm", points: 25, aliases: ["alarm clock"] },
    ],
  },
  {
    prompt: "Name something that smells wonderful in a bakery.",
    answers: [
      { text: "Fresh bread", points: 45, aliases: ["bread"] },
      { text: "Cookies", points: 38, aliases: ["cookie"] },
      { text: "Cake", points: 29, aliases: ["cakes"] },
    ],
  },
  {
    prompt: "Name something found in a doctor's waiting room.",
    answers: [
      { text: "Magazines", points: 42, aliases: ["magazine"] },
      { text: "Chairs", points: 37, aliases: ["seats"] },
      { text: "Patients", points: 25, aliases: ["people"] },
    ],
  },
  {
    prompt: "Name something a family displays on the refrigerator.",
    answers: [
      { text: "Family photos", points: 46, aliases: ["photos", "pictures"] },
      { text: "Children's artwork", points: 34, aliases: ["art", "drawing"] },
      { text: "Calendar", points: 23, aliases: ["schedule"] },
    ],
  },
  {
    prompt: "Name a common name for a family dog.",
    answers: [
      { text: "Max", points: 44 },
      { text: "Buddy", points: 35 },
      { text: "Bella", points: 28 },
    ],
  },
  {
    prompt: "Name a snack people buy at the movies.",
    answers: [
      { text: "Popcorn", points: 58 },
      { text: "Candy", points: 32 },
      { text: "Soda", points: 24, aliases: ["soft drink"] },
    ],
  },
  {
    prompt: "Name something families enjoy on a sunny afternoon.",
    answers: [
      { text: "Play outside", points: 42, aliases: ["go outside", "outdoors"] },
      { text: "Go swimming", points: 35, aliases: ["swim", "pool"] },
      { text: "Have a barbecue", points: 26, aliases: ["barbecue", "cookout"] },
    ],
  },
  {
    prompt: "Name something people open with a key.",
    answers: [
      { text: "Door", points: 48, aliases: ["house door"] },
      { text: "Car", points: 37 },
      { text: "Lockbox", points: 22, aliases: ["safe", "locker"] },
    ],
  },
  {
    prompt: "Name something parents remind children to do.",
    answers: [
      { text: "Homework", points: 45, aliases: ["do homework"] },
      { text: "Chores", points: 34, aliases: ["clean up"] },
      { text: "Use good manners", points: 26, aliases: ["manners", "say please"] },
    ],
  },
  {
    prompt: "Name something commonly stored in a garage.",
    answers: [
      { text: "Car", points: 51 },
      { text: "Tools", points: 33, aliases: ["toolbox"] },
      { text: "Storage boxes", points: 24, aliases: ["boxes"] },
    ],
  },
  {
    prompt: "Name something a noisy neighbor might have.",
    answers: [
      { text: "Loud music", points: 45, aliases: ["music", "stereo"] },
      { text: "A party", points: 34, aliases: ["parties"] },
      { text: "Barking dog", points: 27, aliases: ["dog"] },
    ],
  },
  {
    prompt: "Name an animal children hope to see at the zoo.",
    answers: [
      { text: "Lion", points: 42 },
      { text: "Elephant", points: 36 },
      { text: "Monkey", points: 28, aliases: ["ape", "gorilla"] },
    ],
  },
  {
    prompt: "Name something that sits on a kitchen counter.",
    answers: [
      { text: "Toaster", points: 38 },
      { text: "Coffee maker", points: 34, aliases: ["coffee machine"] },
      { text: "Fruit bowl", points: 27, aliases: ["fruit"] },
    ],
  },
  {
    prompt: "Name a game people play at a party.",
    answers: [
      { text: "Charades", points: 40 },
      { text: "Musical chairs", points: 34 },
      { text: "Trivia", points: 28, aliases: ["quiz"] },
    ],
  },
  {
    prompt: "Name the first thing people do after dropping their phone.",
    answers: [
      { text: "Check the screen", points: 54, aliases: ["look for damage"] },
      { text: "Pick it up", points: 40, aliases: ["grab it"] },
      { text: "Panic", points: 24, aliases: ["worry"] },
    ],
  },
  {
    prompt: "Name something that melts in the sun.",
    answers: [
      { text: "Ice cream", points: 51 },
      { text: "Ice", points: 32, aliases: ["ice cube"] },
      { text: "Snow", points: 25 },
    ],
  },
  {
    prompt: "Name a popular sandwich filling.",
    answers: [
      { text: "Peanut butter", points: 42, aliases: ["pb and j", "peanut butter and jelly"] },
      { text: "Turkey", points: 36 },
      { text: "Ham", points: 28 },
    ],
  },
  {
    prompt: "Name something people keep in a desk drawer.",
    answers: [
      { text: "Pens", points: 44, aliases: ["pencils"] },
      { text: "Paper clips", points: 33, aliases: ["paperclip"] },
      { text: "Stapler", points: 25, aliases: ["staples"] },
    ],
  },
  {
    prompt: "Name something that belongs in an emergency kit.",
    answers: [
      { text: "Flashlight", points: 43, aliases: ["torch"] },
      { text: "First aid supplies", points: 35, aliases: ["first aid kit", "bandages"] },
      { text: "Batteries", points: 27, aliases: ["battery"] },
    ],
  },
  {
    prompt: "Name something you see on a school bus.",
    answers: [
      { text: "Children", points: 49, aliases: ["kids", "students"] },
      { text: "Bus driver", points: 35, aliases: ["driver"] },
      { text: "Backpacks", points: 24, aliases: ["school bags"] },
    ],
  },
  {
    prompt: "Name something people put inside a birthday card.",
    answers: [
      { text: "Money", points: 45, aliases: ["cash"] },
      { text: "A written message", points: 38, aliases: ["greeting", "note"] },
      { text: "Signature", points: 22, aliases: ["name"] },
    ],
  },
  {
    prompt: "Name something people use to clean their hands.",
    answers: [
      { text: "Soap", points: 54 },
      { text: "Hand sanitizer", points: 35, aliases: ["sanitizer"] },
      { text: "Water", points: 26 },
    ],
  },
  {
    prompt: "Name a souvenir people bring home from vacation.",
    answers: [
      { text: "Magnet", points: 41, aliases: ["fridge magnet"] },
      { text: "T-shirt", points: 35, aliases: ["shirt"] },
      { text: "Postcard", points: 28 },
    ],
  },
  {
    prompt: "Name something that is round.",
    answers: [
      { text: "Ball", points: 49 },
      { text: "Coin", points: 32 },
      { text: "Wheel", points: 28, aliases: ["tire"] },
    ],
  },
  {
    prompt: "Name something people get at a gas station.",
    answers: [
      { text: "Gas", points: 55, aliases: ["fuel"] },
      { text: "Snacks", points: 28, aliases: ["food"] },
      { text: "Restroom break", points: 22, aliases: ["bathroom"] },
    ],
  },
  {
    prompt: "Name something that makes a baby laugh.",
    answers: [
      { text: "Peekaboo", points: 44, aliases: ["peek a boo"] },
      { text: "Funny faces", points: 37, aliases: ["silly face"] },
      { text: "Tickling", points: 29, aliases: ["tickle"] },
    ],
  },
  {
    prompt: "Name something people prepare for an overnight guest.",
    answers: [
      { text: "Clean room", points: 45, aliases: ["guest room"] },
      { text: "Fresh sheets", points: 36, aliases: ["bed", "bedding"] },
      { text: "Towels", points: 24, aliases: ["clean towels"] },
    ],
  },
  {
    prompt: "Name something sold at a farmers market.",
    answers: [
      { text: "Vegetables", points: 44, aliases: ["produce"] },
      { text: "Fruit", points: 39 },
      { text: "Fresh bread", points: 24, aliases: ["bread", "baked goods"] },
    ],
  },
  {
    prompt: "Name something fans do at a sports game.",
    answers: [
      { text: "Cheer", points: 45, aliases: ["yell"] },
      { text: "Eat snacks", points: 31, aliases: ["eat", "food"] },
      { text: "Wear team colors", points: 26, aliases: ["jersey", "team shirt"] },
    ],
  },
  {
    prompt: "Name something children play on at a playground.",
    answers: [
      { text: "Slide", points: 46 },
      { text: "Swings", points: 39, aliases: ["swing"] },
      { text: "Monkey bars", points: 22, aliases: ["climbing bars"] },
    ],
  },
  {
    prompt: "Name a reason someone carries an umbrella.",
    answers: [
      { text: "It is raining", points: 64, aliases: ["rain"] },
      { text: "Block the sun", points: 20, aliases: ["sun", "shade"] },
      { text: "Rain is forecast", points: 16, aliases: ["weather forecast"] },
    ],
  },
  {
    prompt: "Name a reason someone lowers their voice to a whisper.",
    answers: [
      { text: "Tell a secret", points: 49, aliases: ["secret"] },
      { text: "They must be quiet", points: 35, aliases: ["be quiet"] },
      { text: "Avoid disturbing someone", points: 21, aliases: ["someone is sleeping"] },
    ],
  },
  {
    prompt: "Name a popular topping for ice cream.",
    answers: [
      { text: "Sprinkles", points: 44 },
      { text: "Chocolate syrup", points: 38, aliases: ["chocolate", "hot fudge"] },
      { text: "Whipped cream", points: 27 },
    ],
  },
  {
    prompt: "Name a reason people take a photo.",
    answers: [
      { text: "Remember an event", points: 47, aliases: ["memory", "occasion"] },
      { text: "Beautiful view", points: 36, aliases: ["scenery"] },
      { text: "Share it online", points: 22, aliases: ["social media", "post it"] },
    ],
  },
  {
    prompt: "Name something that wakes people without an alarm.",
    answers: [
      { text: "Sunlight", points: 41, aliases: ["sun"] },
      { text: "A loud noise", points: 34, aliases: ["noise"] },
      { text: "A pet", points: 25, aliases: ["dog", "cat"] },
    ],
  },
  {
    prompt: "Name a popular pizza topping.",
    answers: [
      { text: "Pepperoni", points: 49 },
      { text: "Extra cheese", points: 35, aliases: ["cheese"] },
      { text: "Sausage", points: 24 },
    ],
  },
  {
    prompt: "Name something people do during a television commercial.",
    answers: [
      { text: "Use the bathroom", points: 42, aliases: ["bathroom"] },
      { text: "Get a snack", points: 35, aliases: ["snacks", "food"] },
      { text: "Check their phone", points: 25, aliases: ["phone"] },
    ],
  },
  {
    prompt: "Name something kept in the refrigerator door.",
    answers: [
      { text: "Condiments", points: 45, aliases: ["ketchup", "mustard", "sauces"] },
      { text: "Milk", points: 33 },
      { text: "Butter", points: 25 },
    ],
  },
  {
    prompt: "Name something that usually comes in a pair.",
    answers: [
      { text: "Shoes", points: 56 },
      { text: "Socks", points: 33 },
      { text: "Earrings", points: 22, aliases: ["earrings"] },
    ],
  },
  {
    prompt: "Name something a mail carrier delivers.",
    answers: [
      { text: "Letters", points: 50, aliases: ["mail"] },
      { text: "Packages", points: 35, aliases: ["boxes"] },
      { text: "Bills", points: 28 },
    ],
  },
  {
    prompt: "Name a cold drink people order on a hot day.",
    answers: [
      { text: "Water", points: 44, aliases: ["ice water"] },
      { text: "Soda", points: 37, aliases: ["soft drink"] },
      { text: "Lemonade", points: 26 },
    ],
  },
  {
    prompt: "Name a type of movie the whole family might choose.",
    answers: [
      { text: "Comedy", points: 44, aliases: ["funny movie"] },
      { text: "Animated movie", points: 34, aliases: ["animation", "cartoon"] },
      { text: "Action movie", points: 27, aliases: ["action"] },
    ],
  },
  {
    prompt: "Name something found in a pocket after doing laundry.",
    answers: [
      { text: "Coins", points: 49, aliases: ["money", "change"] },
      { text: "Tissues", points: 31, aliases: ["tissue"] },
      { text: "Receipt", points: 23, aliases: ["paper"] },
    ],
  },
  {
    prompt: "Name something a school nurse keeps nearby.",
    answers: [
      { text: "Bandages", points: 42, aliases: ["band aids", "first aid"] },
      { text: "Thermometer", points: 33 },
      { text: "Ice pack", points: 27, aliases: ["ice"] },
    ],
  },
  {
    prompt: "Name something children do at a sleepover.",
    answers: [
      { text: "Watch movies", points: 43, aliases: ["movies", "tv"] },
      { text: "Eat snacks", points: 37, aliases: ["snacks", "food"] },
      { text: "Stay up late", points: 27, aliases: ["talk all night"] },
    ],
  },
];

BONUS_QUESTIONS.push(...SUDDEN_DEATH_VARIATIONS);

/**
 * Returns a unique shuffled set of question indexes. When the bank is large
 * enough, questions from the previous game are excluded completely.
 *
 * @param {number} poolSize
 * @param {number} count
 * @param {number[]} [excluded]
 * @param {() => number} [random]
 */
export function pickQuestionIds(poolSize, count, excluded = [], random = Math.random) {
  if (!Number.isInteger(poolSize) || poolSize < 1 || !Number.isInteger(count) || count < 1) return [];
  const excludedSet = new Set(excluded);
  const fullPool = Array.from({ length: poolSize }, (_, index) => index);
  const freshPool = fullPool.filter((index) => !excludedSet.has(index));
  const candidates = freshPool.length >= Math.min(count, poolSize) ? freshPool : fullPool;

  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
  }

  return candidates.slice(0, Math.min(count, candidates.length));
}

/**
 * Draws from every question in a bank before beginning a new cycle. When a
 * cycle resets, the immediately previous deck remains excluded.
 *
 * @param {number} poolSize
 * @param {number} count
 * @param {number[]} [used]
 * @param {number[]} [previous]
 * @param {() => number} [random]
 */
export function pickQuestionCycleIds(poolSize, count, used = [], previous = [], random = Math.random) {
  const validUsed = [...new Set(used.filter((id) => Number.isInteger(id) && id >= 0 && id < poolSize))];
  const validPrevious = [...new Set(previous.filter((id) => Number.isInteger(id) && id >= 0 && id < poolSize))];
  const keepCurrentCycle = poolSize - validUsed.length >= Math.min(count, poolSize);
  const exclusions = keepCurrentCycle ? validUsed : validPrevious;
  const ids = pickQuestionIds(poolSize, count, exclusions, random);
  return {
    ids,
    usedIds: keepCurrentCycle ? [...validUsed, ...ids] : ids,
  };
}
