module.exports = {
config: {
name: "autoreact",
version: "2.0.0",
author: "Haru",
cooldown: 5,
role: 0,
shortDescription: "Autoresponds with reactions and replies",
longDescription: "Autoresponds with reactions and replies based on specific words or triggers.",
category: "fun",
guide: "?autorespondv3",
},
onStart: async ({ api, event }) => {
// Blank onStart function as per the request
},
onChat: async ({ api, event }) => {
const { body, messageID, threadID } = event;

// Reactions based on words
const emojis = {
"💜": ["Cliff", "August", "Jonell", "David", "purple", "Fritz", "Sab", "Haru", "Xuazane", "Kim"],
"💚": ["dia", "seyj", "ginanun", "gaganunin", "pfft", "xyrene", "gumanun"],
"😾": ["Jo", "Ariii", "talong", "galit"],
"😼": ["wtf", "fck", "haaays", "naku", "ngi ", "ngek", "nge ", "luh", "lah"],
"😸": ["pill", "laugh", "lt ", "gagi", "huy", "hoy"],
"🌀": ["prodia", "sdxl", "bardv3", "tanongv2", "-imagine", "genimg", "Tanongv4", "kamla", "-shortcut"],
"👋": ["hi ", "hello", "salut","bjr","bonjour"," Salut","👋","bonsoir","slt"],
"🔥": ["🔥", ".jpg", "astig", "damn", "angas", "galing", "husay"],"💩":["merde","Merde","caca","Caca","shit"],"🤢":["beurk",
      "dégueulasse",
      "dégeu",
      "horrible"
    ],"🌸": [
      "amour",
      "câlin",
      "tendresse",
      "gentillesse",
      "bienveillance",
      "douceur",
      "complicité",
      "gratitude",
      "bonheur",
      "amitié"
    ],
    "😂": [
      "Ridicule",
      "Clownesque",
      "Farce",
      "Pitrerie",
      "Comique",
      "Drôle",
      "Amusant",
      "Hilarant",
      "Loufoque",
      "Bouffonnerie",
      "Cocasse",
      "Burlesque",
      "Rigolo",
      "Absurde",
      "Irrévérencieux",
      "Ironique",
      "Ironie",
      "Parodie",
      "Esprit",
      "Facétieux"
    ],
    "😎": [
      "cool","formidable"," 😎"
    ],
    "⚡": [
      "Super",
      "Aesther"
    ],
    "🤖": [
      "Prefix","robot"
    ],
    "🔰": [
      "Nathan","barro"
    ],
    "✔️": [
      "Bien",
      "ok"
    ],
    "🎉": [
      "congrats",
      "félicitation",
      "Goddess-Anaïs"
    ],
    "😆": [
      "xD"
    ],
    "♻️": [
      "restart"
    ],
    "🖕": [
      "fuck","enculer","fdp","🖕"
    ],
    "🌀": [
      "imagine","prodia","textpro","photofy"
    ],
    "🌼": [
      "Goddess-Anaïs"
    ],
    "😑": [
      "mmmh",
      "kiii"
    ],
    "💍": [
      "Aesther"
    ],
    "💵": [
      "Anjara"
    ],
    "😝": [
      "Anjara"
    ],
    "✨": [
      "oui","super"
    ],
    "✖️": [
      "wrong",
      "faux"
    ],
    "😽": [
      "araara"
    ],
    "🤡": [
      "Kindly provide the question","clone"," sanchokuin","bakugo"
    ],
    "😕": [
      "bruh"
    ],
    "👎": [
      "Kindly provide"
    ],
    "🌩️": [
      "*thea",
      "Tatakae",
      "Damare"
    ],
  "🤢": [
      "vomir"
    ],
  "🔪": [
      "tué"
    ],
    "💤": ["ghum paisi", "arekta bar", "soite parchi na", "onek kaj", "ar pari na"],
"🫠": ["bash dite chai", "ami jabo", "kichu bolo na", "onek boro", "emni emni"],
"😤": ["tui abar", "ami bolsi", "moja paili", "shesh kore de", "ektu chup"],
"🫥": ["kichu mone koro na", "ami kichu boli", "onek bhalo", "ta chara ki", "kichu ekta mone hocche"],
"🫶": ["bhalo theko", "toke mone pore", "tui amar bondhu", "forever bondhu", "bhalobeshechi"],
"🧃": ["juice khabi", "chill kor", "shanti chai", "refresh laglo", "cool vibe"],
"🎯": ["target ache", "focus thak", "bash dibo", "100% sure", "done deal"],
"🚀": ["ura gelo", "next level", "boost paisi", "motivation high", "on fire"],
"📌": ["notun idea", "keep in mind", "bookmark kore rakh", "important info", "mone rakhish"],
"🫀": ["dil theke", "onek emotion", "feel korchi", "heart touch", "deep kotha"],
"🧂": ["ekdom jhal", "spicy gossip", "sheroil", "salt diye dimu", "thanda matha"],
"🥴": ["matha ghurche", "arekta chinta", "abar tension", "kichu bujhi na", "joss vibe"],
"🫃": ["pet bhore gesey", "onick kheyechi", "dinner ready", "biryani chilo", "food coma"],
"🥳": ["party mood", "celebrate kor", "lets go", "banger time", "vibe on"],
"🫡": ["respect bro", "salute", "boss level", "guru tumi", "legendary move"],
"🧸": ["cute vibe", "komol mon", "feel korchi", "emotional", "soft thakis"],
"🫓": ["ruti holo", "khawa shesh", "ranna korte hobe", "biryani chai", "mishti ache?"],
"😶‍🌫️": ["matha hang", "brain stop", "kichui bujhi na", "no comments", "blank vibe"],
"🤨": ["tui serious?", "joke korteso?", "bishash hocche na", "ki bolish", "again bol"],
"🤯": ["matha urey gelo", "onek boro news", "eta unexpected", "shock level max", "ami ki shunlam"],
"🙃": ["ultra mood", "jokhon sob ultapalta", "funny situation", "sob ulta lagche", "ajaira vibe"],
"🤭": ["hasir dhakka", "kichu bolbo na", "secret lagse", "lol moment", "ami thik nai"],
"😠": ["rag lagse", "chepe rakhlam", "baje lagse", "bolbo ekta kotha", "onek beshi hoye gese"],
"😴": ["ghum lagse", "ektu chill", "ghum ghum", "zzz mode", "break chai"],
"🤌": ["classy move", "ajaira stylish", "perfect vibe", "elegant", "smooth af"],
"🤸": ["maje maje nachi", "energy level high", "let’s gooo", "hyper mood", "khela hobe"],
"🪄": ["magic vibe", "jadu hoise", "unexpectedly perfect", "like wow", "hok kolom"],
"🎈": ["baba party", "moja ase", "celebration mood", "balloon diya disi", "shubho kichu ekta"],
"💃": ["nachte hobe", "full party", "shari pori nache", "gaan bajao", "baje baje nache"],
"🕺": ["guyz nache", "mehfil on", "moves ase", "ekta vibe dao", "tune on"],
"🌶️": ["onek spicy", "bhab na", "comment e fire", "ultra reply", "taal chara hoye gelo"],
"🥺": ["please mama", "ekta kotha", "sorry bolchi", "amar kichu chai", "mone lage"],
"🫶": ["respect boss", "onek valo bolcho", "heart touch", "sundor kotha", "ami impressed"],
"🧃": ["juice khabi?", "thanda thanda", "refresh kor", "jibon juice", "ek glass dao"],
"📦": ["delivery asche", "parcel asey", "surprise box", "kinlam kinlam", "gift pathaisi"],
"🪑": ["boss chair", "bose asi", "meeting start", "thak thik asi", "program shuru"],
"📎": ["attach korchi", "file dao", "bondho koro", "notun folder", "data lagbe"],
"📅": ["date fixed", "ajke koy tarikh?", "plan set", "schedule on", "calendar dekhi"],
"🧼": ["hand wash kor", "clean rakh", "bacteria chole ja", "saf korchi", "niramoy vibe"],
"🧯": ["jolse jolse", "fire off", "cool down", "calm rakho", "aag bondho"],
"🔍": ["search korchi", "khujtesi", "find korchi", "investigation cholche", "detective mode"],
"🗂️": ["file rakhchi", "document ready", "report banabo", "project ase", "info manage"],
"💸": ["taka gelo", "boro khoroch", "shopping kori", "pocket faka", "emi ase"],
"🛎️": ["bell bajao", "noti lagse", "call dise", "ping dao", "attention plz"],
"🔧": ["repair mode", "bug fix", "system setup", "fix kortesi", "tools lagbe"],
"💿": ["CD ase?", "old vibe", "burn kortesi", "archive mood", "nostalgic file"],
"🌪️": ["biporjoy", "tornado vibe", "gondogol cholche", "maje maje jhor", "chanchal obostha"],
"🛸": ["ufo spotted", "kichu ekta asche", "onno planet", "outer world", "aliens confirm"],
"📡": ["signal ase?", "network dhorte parchi", "wifi lagbe", "online asi", "connect hoye gelo"],
"🎯": ["target fix", "ekdom shot", "bullseye mama", "point clear", "done & dusted"],
"🗨️": ["bujhi nai", "reply koi", "question korchi", "chup thako", "dm dao"],
"⚙️": ["setting korchi", "adjustments dorkar", "system ready", "gear up", "control nichi"],
"🎮": ["pubg cholo", "valo player", "match start", "game on", "lets gooo"],
"🪙": ["coin toss", "bhag ghotona", "win or lose", "luck ase", "golpo holo"],
"🚧": ["work in progress", "incomplete", "jaiga bondho", "pass korte hobe", "dhekha jabe"],
"🚨": ["alert boss", "danger ase", "jhamela lagse", "police call", "warning paisi"],
"📍": ["ekdom ekhane", "location dao", "pin kore rakhlam", "gps on", "map check"],
"🛫": ["flight cholbe", "aakash pothe", "jabo re jabo", "tour e asi", "destination fixed"],
"📿": ["duwa chai", "vabni vibe", "holy mood", "mone porse", "prayer korchi"],
"📖": ["golpo porchi", "bookish mood", "kobita vibe", "lekha porte chai", "page porbo"],
"🏷️": ["tag kore disi", "price ache", "label lagbe", "mention korchi", "name dite hobe"],
"📘": ["notebook open", "notun chinta", "story shuru", "jibon lekha", "ekta plan ase"],
"🖼️": ["pic ta valo", "art piece", "gallery mood", "frame it", "show korchi"],
"🧏‍♂️": ["ki bolteso", "sunte pari", "earphone off", "kichu bolar chilo", "bhule gesi"],
"👨‍🔧": ["fix kortesi", "tools ready", "mechanic mood", "solve korchi", "code break korchi"],
"👩‍🏫": ["class start", "sikhi sikhai", "teacher vibe", "lesson hobe", "parina bujhte"],
"👨‍💻": ["coding cholche", "terminal on", "dev mode", "commit dibo", "programmer vibes"],
"👀": ["dekhi dekhi", "kichu hoitese", "eye on", "observe kortesi", "secret dekhlam"],
"🧠": ["new idea", "brain active", "onno chinta", "bujhte parlam", "logic apply korchi"],
  "👀": ["dekho", "eyes", "look", "observation", "focus"],
  "💁‍♂️": ["shona", "suno", "hey", "bro", "bhai", "amra", "kemon"],
  "🦄": ["unicorn", "magic", "fairy", "dream", "imagine"],
  "💀": ["bhoy", "scary", "dead", "murder", "bhoot"],
  "⚔️": ["fight", "battle", "war", "sword", "attack"],
  "💫": ["glitter", "sparkle", "shine", "twinkle", "light"],
  "🍕": ["pizza", "cheese", "tasty", "food", "hungry"],
  "🥺": ["please", "pleasure", "chinta", "hope", "beg"],
  "🏃‍♂️": ["run", "fast", "cholo", "doro", "race"],
  "🎶": ["music", "song", "beat", "dance", "rhythm"],
  "🚶‍♂️": ["walk", "move", "step", "cholo", "poth"],
  "💥": ["boom", "blast", "explosion", "shock", "bang"],
  "🌪️": ["storm", "wind", "twister", "tornado", "gale"],
  "🌼": ["flower", "bloom", "garden", "nature", "colorful"],
  "🐯": ["tiger", "wild", "beast", "roar", "jungle"],
  "👑": ["king", "queen", "royal", "power", "reign"],
  "🌟": ["star", "shine", "brilliant", "bright", "super"],
  "💪": ["strength", "power", "muscle", "tough", "fight"],
  "🌈": ["rainbow", "colorful", "sky", "beautiful", "hope"],
  "🎉": ["celebrate", "party", "masti", "joy", "happy"],
  "🌸": ["blossom", "flower", "beauty", "love", "nature"],
  "🦋": ["butterfly", "light", "soft", "flap", "free"],
  "🔥": ["fire", "hot", "burn", "danger", "burning"],
  "💀": ["dead", "bhoy", "scary", "ghost", "horror"],
  "🐱": ["cat", "meow", "pussy", "cute", "pet"],
  "🐶": ["dog", "woof", "pet", "cute", "bark"],
  "🦊": ["fox", "wild", "clever", "hunt", "nature"],
  "🦄": ["unicorn", "magic", "imagination", "fantasy", "dream"],
  "🌞": ["sun", "shine", "morning", "day", "light"],
  "🍓": ["strawberry", "fruit", "sweet", "delicious", "berry"],
  "🍔": ["burger", "fastfood", "cheese", "meal", "tasty"],
  "🌽": ["corn", "food", "veg", "healthy", "grains"],
  "🍩": ["donut", "sweet", "dessert", "tasty", "snack"],
  "🍰": ["cake", "sweet", "dessert", "birthday", "celebration"],
  "🍦": ["icecream", "sweet", "cold", "dessert", "treat"],
  "🍇": ["grape", "fruit", "fresh", "healthy", "tasty"],
  "🍎": ["apple", "fruit", "healthy", "fresh", "green"],
  "🍌": ["banana", "fruit", "yellow", "sweet", "tasty"],
  "🍉": ["watermelon", "fruit", "red", "sweet", "cool"],
  "🍊": ["orange", "fruit", "fresh", "tasty", "yellow"],
  "🍍": ["pineapple", "fruit", "yellow", "tropical", "sweet"],
  "🥭": ["mango", "fruit", "sweet", "summer", "tasty"],
  "🥥": ["coconut", "tropical", "fruit", "water", "refresh"],
  "🍒": ["cherry", "fruit", "red", "sweet", "tasty"],
  "🥑": ["avocado", "green", "fruit", "healthy", "fresh"],
  "🍑": ["peach", "fruit", "sweet", "summer", "delicious"],
  "🥒": ["cucumber", "vegetable", "green", "fresh", "healthy"],
  "🌶️": ["chili", "spicy", "hot", "pepper", "flavor"],
  "🧀": ["cheese", "dairy", "milk", "cream", "delicious"],
  "🥗": ["salad", "healthy", "veg", "fresh", "diet"],
  "🥓": ["bacon", "meat", "breakfast", "crispy", "delicious"],
  "🍗": ["chicken", "meat", "spicy", "grilled", "delicious"],
  "🥩": ["steak", "beef", "grilled", "meat", "delicious"],
  "🍖": ["meat", "mutton", "beef", "grilled", "delicious"],
  "🍤": ["shrimp", "seafood", "tasty", "spicy", "delicious"],
  "🍣": ["sushi", "food", "Japanese", "rice", "delicious"],
  "🥟": ["dumpling", "snack", "food", "Chinese", "delicious"],
  "🥡": ["takeaway", "food", "container", "delivery", "snack"],
  "🥘": ["paella", "Spanish", "food", "delicious", "tasty"],
  "🍝": ["pasta", "Italian", "spaghetti", "delicious", "meal"],
  "🍕": ["pizza", "Italian", "cheese", "meal", "tasty"],
  "🍔": ["burger", "fastfood", "tasty", "cheese", "meal"],
  "🌯": ["burrito", "Mexican", "food", "delicious", "meal"],
  "🍳": ["egg", "breakfast", "food", "delicious", "healthy"],
  "🥓": ["bacon", "meat", "crispy", "tasty", "delicious"],
  "🥚": ["egg", "omelette", "breakfast", "healthy", "delicious"],
  "🍽️": ["plate", "meal", "food", "serve", "eat"],
  "🥢": ["chopsticks", "food", "asian", "eat", "snack"],
  "🍴": ["fork", "spoon", "knife", "cutlery", "plate"],
  "🥄": ["spoon", "eat", "meal", "food", "dessert"],
  "🥧": ["pie", "dessert", "sweet", "apple", "tasty"],
  "🍪": ["cookie", "dessert", "sweet", "snack", "baked"],
  "🍩": ["donut", "dessert", "sweet", "chocolate", "snack"],
  "🧁": ["cupcake", "dessert", "sweet", "treat", "snack"],
  "🍫": ["chocolate", "sweet", "dessert", "treat", "delicious"],
  "🍬": ["candy", "sweet", "snack", "dessert", "tasty"],
  "🍭": ["lollipop", "sweet", "candy", "treat", "fun"],
  "🍿": ["popcorn", "snack", "movie", "tasty", "delicious"],
  "🥧": ["pie", "dessert", "apple", "sweet", "tasty"]

};

// Replies to specific words
const replies = {
      
  "ashcho kobe": "~~𝙴𝚖𝚗𝚎𝚒 𝙳𝚊𝚢𝚜 𝙲𝚘𝚖𝚒𝚗𝚐, 𝚃𝚘𝚖𝚖𝚊! 🙃🌷",   
     


};

// React based on words
for (const [emoji, words] of Object.entries(emojis)) {
for (const word of words) {
if (body.toLowerCase().includes(word)) {
api.setMessageReaction(emoji, messageID, () => {}, true);
}
}
}

// Reply based on triggers
for (const [trigger, reply] of Object.entries(replies)) {
if (body.toLowerCase().includes(trigger)) {
api.sendMessage(reply, threadID, messageID);
}
}
},
};
