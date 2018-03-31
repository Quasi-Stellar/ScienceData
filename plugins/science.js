/**
 * Writing commands
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * @license MIT license
 */

'use strict';

const database = Storage.getDatabase('writing');
const MESSAGES_TIME_OUT = 7 * 24 * 60 * 60 * 1000;

// sync database properties
if (!database.potd) database.potd = [];
if (!database.researchMerch) database.researchMerch = [];
if (!database.myths) database.myths = {};
if (!database.myths.db) {
	database.myths.db = [];
	database.myths.lastID = -1;
}

/**
 * @param {string} str
 */
function toTitleCase(str) {
	let strArr = str.split(' ');
	let newArr = [];
	for (let i = 0; i < strArr.length; i++) {
		newArr.push(strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1).toLowerCase());
	}
	return newArr.join(' ');
}

// Lists for random generator commands
let adjectives = ["crystal", "floating", "eternal-dusk", "sunset", "snowy", "rainy", "sunny", "chaotic", "peaceful", "colorful", "gooey", "fiery", "jagged", "glass", "vibrant", "rainbow", "foggy", "calm", "demonic", "polygonal", "glistening", "sexy", "overgrown", "frozen", "dark", "mechanical", "mystic", "steampunk", "subterranean", "polluted", "bleak", "dank", "smooth", "vast", "pixelated", "enigmatic", "illusionary", "sketchy", "spooky", "flying", "legendary", "cubic", "moist", "oriental", "fluffy", "odd", "fancy", "strange", "authentic", "bustling", "barren", "cluttered", "creepy", "dangerous", "distant", "massive", "exotic", "tainted", "filthy", "flawless", "forsaken", "frigid", "frosty", "grand", "grandiose", "grotesque", "harmful", "harsh", "hospitable", "hot", "jaded", "meek", "weird", "awkward", "silly", "cursed", "blessed", "drought-stricken", "futuristic", "ancient", "medieval", "gothic", "radioactive",
];
let locations = ["river", "island", "desert", "forest", "jungle", "plains", "mountains", "mesa", "cave", "canyon", "marsh", "lake", "plateau", "tundra", "volcano", "valley", "waterfall", "atoll", "asteroid", "grove", "treetops", "cavern", "beach", "ocean", "heavens", "abyss", "city", "crag", "planeTools.toId", "harbor", "evergreen", "cabin", "hill", "field", "ship", "glacier", "estuary", "wasteland", "clouds", "chamber", "ruin", "tomb", "park", "closet", "terrace", "hotairballoon", "shrine", "room", "swamp", "road", "path", "gateway", "school", "building", "vault", "pool", "pit", "temple", "lagoon", "prison", "harem", "mine", "catacombs", "rainforest", "laboratory", "library", "stadium", "museum", "mansion", "carnival", "amusementpark", "farm", "factory", "castle", "spaceship", "space station", "cafe", "theater", "island", "hospital", "ruins", "bazaar",
];
let characterAdjectives = ["sturdy", "helpless", "young", "rugged", "odd-looking", "amusing", "dynamic", "exuberant", "quirky", "awkward", "elderly", "adolescent", "'ancient'", "odd", "funny-looking", "tall", "short", "round", "blind",
];
let characterTypes = ["Marksman", "Adventurer", "Pokemon Trainer", "Pokemon", "Dragonkin", "Chef", "Businessman", "Kitsune", "Youkai", "...thing", "Archer", "Taxi Driver", "Dentist", "Demon", "Paladin", "Writer", "Diety", "Spy", "Goverment Agent", "Farmer", "Teacher", "Warrior", "Athlete", "Artist", "Assassin", "Beast", "Journalist", "Designer", "Doctor", "Vampire", "Time Traveller", "Alien", "Butler", "PoliceOfficer", "Toymaker", "Student", "Photographer", "Mage", "Computer Programmer", "Person",
];
let perks = ["kind of heart", "powerful", "handsome", "ambitious", "amiable", "brave", "rational", "witty", "honest", "agile", "athletic", "quick on their feet", "assertive", "fearless", "intelligent", "persistent", "philosophical", "pioneering", "quiet", "wealthy", "not afraid to voice their opinion", "quick-witted", "lucky", "friendly", "neat", "sympathetic", "sincere", "mysterious", "loyal", "trustworthy", "imaginative", "gentle",
];
let debuffs = ["sly", "unclean", "smelly", "obnoxiously loud", "fond of 'tricks'", "fond of 'games'", "fond of 'jokes'", "prone to 'accidentally' taking others' things", "cocky", "prone to falling over", "prone to bad luck at times", "clingy", "foolish", "fussy", "greedy", "gullible", "impatient", "inconsiderate", "lazy", "moody", "obsessive", "narrow-minded", "patronizing", "resentful", "unreliable", "vague", "weak-willed", "egotistical", "sensitive", "Grammar Nazi-ish", "'bitchy'", "emotionally scarred", "overly-serious", "volatile", "morally scrupulous", "lacking of empathy", "prone to overreacting", "overbearing", "prone to panic attacks", "self-pessimistic",
];
let genres = ["Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Historical", "Horror", "Mystery", "Philosophical", "Romance", "Saga", "Satire", "Science Fiction", "Thriller",
];
let roles = ["Protagonist", "Antagonist", "Major character", "Minor character"];
let pronouns = {'male': 'he', 'female': 'she', 'hermaphrodite': 'shi', 'neuter': 'they'};
let possessivePronouns = {'male': 'His', 'female': 'Her', 'hermaphrodite': 'Hir', 'neuter': 'Their'};
let types = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Flying", "Ground", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy", "Bird"];
/* Shop Merchandise
 * 1st Element: Name
 * 2nd Element: Description
 * 3rd Element: Price
 * 4th Element: Price with comma included (used for advertising)
 * 5th Element: Usage Instructions
 * 6th Element: Rooms
 */
let shopMerch = [
	["Fossil",
		"The best way for you to waste your money!",
		"5 (Five)",
		5,
		"fossil, amount of fossils",
		"groupchat-aurolux-science"],
	
	["Take The Stage",
		"For up to 2 minutes, we will set the room to modchat(+) and let you recite your poem or rap in the chat live! There is no greater way to receive feedback and recognition.",
		"500 (Five Hundred)",
		500,
		"take the stage. Then, use the 'spotlight' command as instructed to use up your purchase! No refunds on this if you use it and nobody's paying attention, so use it when you think would be the best time. :3",
		"groupchat-aurolux-science"],
	["Poetic License",
		"Simply owning one of these grants you the ability to set the Word of the Day up to 3 times through the " + Config.commandCharacter + "wotd command! Usage: " + Config.commandCharacter + "wotd Word, Pronunciation, Part of Speech (Noun, Verb, Adjective, etc...), and Definition. -- DON'T BUY THIS IF YOU ARE ALREADY VOICE OR ABOVE",
		"550 (Five Hundred and Fifty)",
		550,
		"poetic license. Then, follow the instructions provided in the item's description.",
		"Writing"],
	["Personal Greeting (Public)",
		"Use this to gain the ability to set a personal greeting for The Scribe to say whenever you join the room after being gone for a while! What better way to make an entrance?",
		"1,500 (One Thousand, Five Hundred)",
		1500,
		"public greeting. Follow the instructions provided on purchase.",
		"Writing, Myths & Magic, and The Arcadium"],
	["Let's Save The World!",
		"Get yourself immortalized as a PROTAGONIST in a short story written by some of the Writing Room's best story writers. ETA: 3 weeks from purchase.",
		"2,000 (Two Thousand)",
		2000,
		"protagonist. Follow the rest instuctions provided on purchase.",
		"Writing"],
	["Destroy It All!",
		"Get yourself immortalized as an ANTAGONIST in a short story written by some of the Writing Room's best story writers. ETA: 3 weeks from purchase.",
		"2,000 (Two Thousand)",
		2000,
		"antagonist. Follow the rest instuctions provided on purchase.",
		"Writing"],
	["Your Soul",
		"???",
		"1,000,000 (One Million)",
		0,
		"my soul",
		"Yourself"],
];

function randIdea() {
	let genre1 = genres[Math.floor(genres.length * Math.random())];
	let genre2;
	if (Math.floor(Math.random() * 2)) {
		genre2 = genres[Math.floor(genres.length * Math.random())];
		while (genre1 === genre2) {
			genre2 = genres[Math.floor(genres.length * Math.random())];
		}
	}
	let adjective = adjectives[Math.floor(adjectives.length * Math.random())];
	let location = locations[Math.floor(locations.length * Math.random())];
	let characterAdjective = characterAdjectives[Math.floor(characterAdjectives.length * Math.random())];
	let type = characterTypes[Math.floor(characterTypes.length * Math.random())];
	let role = roles[Math.floor(4 * Math.random())];
	let gender = ["male", "female"][Math.floor(2 * Math.random())];
	if (Math.floor(Math.random() * 4200) < 15) gender = "hermaphrodite";
	if (Math.floor(Math.random() * 4200) < 10) gender = "transgender";
	if (Math.floor(Math.random() * 4200) < 5) gender = "neuter";
	let pronoun = pronouns[gender];
	let possessivePronoun = possessivePronouns[gender];
	let perkList = perks.slice(0);
	let perk1 = perkList[Math.floor(perkList.length * Math.random())];
	perkList.splice(perkList.indexOf(perk1), 1);
	let perk2 = perkList[Math.floor(perkList.length * Math.random())];
	perkList.splice(perkList.indexOf(perk2), 1);
	let perk3 = perkList[Math.floor(perkList.length * Math.random())];
	let debuff = debuffs[Math.floor(debuffs.length * Math.random())];
	return "Setting: __" + adjective + " " + location + "__ | Genre: __" + genre1 + (genre2 ? "/" + genre2 : "") + "__ | " + role + ": __a " + gender + ", " + characterAdjective + " " + type + ". " + possessivePronoun + " positive factors include: " + perk1 + ", " + perk2 + ", and " + perk3 + ", though " + pronoun + (gender === "neuter" ? " are" : " is") + " unfortunately rather " + debuff + ".__";
}

/**@type {{[k: string]: Command | string}} */
let commands = {
	/*
	 * Random Commands Section!
	 * Place all 'random thing generator' commands in this area!
	 * This is a template for all Random Commands; please don't use this as an actual command.
	 * randomcommands: function (target, room, user) {
	 *	if (!user.canUse('randomcommands', room.id)) return false;
	 *	let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
	 *	let variableone = list1[Math.floor(list1.length * Math.random())];
	 *	let variabletwo = list2[Math.floor(list2.length * Math.random())];
	 *	this.say(text + "Randomly generated thing: __" + variableone + " " + variabletwo + "__.");
	 * },
	//Returns a random character build.
	randchar: 'randomcharacter',
	chargen: 'randomcharacter',
	genchar: 'randomcharacter',
	randomcharacter: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		let adjective = characterAdjectives[Math.floor(characterAdjectives.length * Math.random())];
		let type = characterTypes[Math.floor(characterTypes.length * Math.random())];
		let role = roles[Math.floor(roles.length * Math.random())];
		let gender = ["male", "female"][Math.floor(2 * Math.random())];
		if (Math.floor(Math.random() * 4200) < 20) gender = "hermaphrodite";
		if (Math.floor(Math.random() * 4200) < 10 || type === "...thing") gender = "neuter";
		let pronoun = pronouns[gender];
		let possessivePronoun = possessivePronouns[gender];
		let perkList = perks.slice(0);
		let perk1 = perkList[Math.floor(perkList.length * Math.random())];
		perkList.splice(perkList.indexOf(perk1), 1);
		let perk2 = perkList[Math.floor(perkList.length * Math.random())];
		perkList.splice(perkList.indexOf(perk2), 1);
		let perk3 = perkList[Math.floor(perkList.length * Math.random())];
		let debuff = debuffs[Math.floor(debuffs.length * Math.random())];
		this.say(text + "Randomly generated character: __A " + gender + ", " + adjective + " " + type + " (" + role + "). " + possessivePronoun + " positive factors include: " + perk1 + ", " + perk2 + ", and " + perk3 + ", though " + pronoun + (gender === "neuter" ? " are" : " is") + " unfortunately rather " + debuff + ".__");
	},
	//Returns a random Pokemon type or type combination.
	gentype: 'randomtype',
	randtype: 'randomtype',
	randomtype: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		target = Tools.toId(target);
		if (target && target !== 'single' && target !== 'dual') this.say(text + "Please input either 'single' or 'dual' as arguments, or leave it blank for a random decision. Continuing as if you left it blank.");
		let firstType = types[Math.floor(types.length * Math.random())];
		let secondType;
		if (target !== 'single' && (target === 'dual' || Math.floor(Math.random() * 2))) {
			secondType = types[Math.floor(types.length * Math.random())];
			while (firstType === secondType) {
				secondType = types[Math.floor(types.length * Math.random())];
			}
		}
		this.say(text + "Randomly generated type: __" + firstType + (secondType ? "/" + secondType : "") + "__.");
	},
		*/

	/*
	 * Messaging-related commands
	 *
	 */
	//Clears the mail of a specific user, or all of it.
	clearmail: 'clearmessages',
	clearmessages: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '#')) return false;
		if (!target) return this.say('Specify whose mail to clear or \'all\' to clear all mail.');
		if (!database.mail) return this.say('The message file is empty.');
		if (target === 'all') {
			database.mail = {};
			Storage.exportDatabase('writing');
			this.say('All messages have been cleared.');
		} else if (target === 'time') {
			for (let u in database.mail) {
				let messages = database.mail[u].slice(0);
				for (let i = 0; i < messages.length; i++) {
					if (messages[i].time < (Date.now() - MESSAGES_TIME_OUT)) database.mail[u].splice(database.mail[u].indexOf(messages[i]), 1);
				}
			}
			Storage.exportDatabase('writing');
			this.say('Messages older than one week have been cleared.');
		} else {
			let tarUser = Tools.toId(target);
			if (!database.mail[tarUser]) return this.say(target + ' does not have any pending messages.');
			delete database.mail[tarUser];
			Storage.exportDatabase('writing');
			this.say('Messages for ' + target + ' have been cleared.');
		}
	},
	//Counts how much mail is currently pending and returns a link (in PMs) to the user about who sent what when and to whom if they're of a certain rank.
	countmessages: 'countmail',
	countmail: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '+')) return false;
		if (!database.mail) this.say('The message file is empty');
		let messageCount = 0;
		let oldestMessage = Date.now();
		let messageArray = []; //Array that stores messages to be uploaded to Hastebin.
		for (let u in database.mail) {
			for (let i = 0; i < database.mail[u].length; i++) {
				if (database.mail[u][i].time < oldestMessage) oldestMessage = database.mail[u][i].time;
				messageCount++;
				messageArray.push(["From: " + database.mail[u][i].from, "To: " + database.mail[u][i].destination, "Days Since Sent: " + Math.round((Date.now() - database.mail[u][i].time) / (24 * 60 * 60 * 1000))]);
			}
		}
		//convert oldestMessage to days
		let day = Math.floor((Date.now() - oldestMessage) / (24 * 60 * 60 * 1000));
		this.say('There are currently **' + messageCount + '** pending messages. ' + (messageCount ? 'The oldest message ' + (!day ? 'was left today.' : 'is __' + day + '__ days old.') : ''));

		if (user.hasRank(room, '@')) {
			let output = [];
			for (let i = 0; i < messageArray.length; i++) {
				output.push(messageArray[i][0] + "\n" + messageArray[i][1] + "\n" + messageArray[i][2] + "\n");
			}
			Tools.uploadToHastebin('Messages:\n\n' + output.join('\n'), /**@param {string} link*/ link => this.say("/msg " + user.name + ", Messages Log: " + link));
		}
	},
	//Used to blacklist people that frequently abuse the mail system from the mail system.
	//Thankfully, this hasn't been used as of the time of writing this.
	upl: 'messageblacklist',
	unpoeticlicense: 'messageblacklist',
	messageblacklist: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '@')) return false;
		if (!target) return this.say('Please specify which user(s) to blacklist from the message system');
		let users = target.split(', ');
		let errors = [];
		if (!database.messageBlacklist) database.messageBlacklist = {};
		for (let i = 0; i < users.length; i++) {
			let tarUser = Tools.toId(users[i]);
			if (database.messageBlacklist[tarUser]) {
				errors.push(users[i]);
				users.splice(i, 1);
				continue;
			}
			database.messageBlacklist[tarUser] = 1;
		}
		Storage.exportDatabase('writing');
		if (errors.length) this.say(errors.join(', ') + ' is already on the message blacklist');
		if (users.length) this.say('/modnote ' + users.join(', ') + ' added to the message blacklist by ' + user.name.substr(1));
	},
	//Returns the list of users blacklisted from using the messaging system.
	vmb: 'viewmessageblacklist',
	viewmessageblacklist: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '@')) return false;
		if (!database.messageBlacklist) return this.say('No users are blacklisted from the message system');
		let messageBlacklist = Object.keys(database.messageBlacklist);
		Tools.uploadToHastebin('The following users are banned in ' + room + ':\n\n' + messageBlacklist.join('\n'), /**@param {string} link*/ link => this.say("/pm " + user.name + ", Message Blacklist: " + link));
	},
	//Used to both set (if you're a ranked user) your own autobiography and view (any user can do so) the specified user's biography, or your own if you don't specify anyone and are applicable to own one.
	bio: 'biography',
	autobiography: 'biography',
	biography: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		let tarUser = Tools.toId(target);
		if (!database.bios) database.bios = [];
		let bios = database.bios;
		let targets = target.split(' ');
		if (Tools.toId(targets[0]) === "set" && targets[1]) {
			if (room instanceof Users.User) return this.say("You must use this command in the room.");
			if (!user.hasRank(room, '+')) return this.say(text + "Sorry, but you need to be at least a voice to set a biography.");
			tarUser = user.id;
			let input = targets.slice(1).join(' ');
			for (let i = 0, len = bios.length; i < len; i++) {
				if (bios[i].name === tarUser) {
					bios[i].bio = input;
					Storage.exportDatabase('writing');
					return this.say(text + "Biography for user " + user.name + " has been edited.");
				}
			}
			bios.push({"name": tarUser, "bio": input});
			Storage.exportDatabase('writing');
			return this.say(text + "Biography for user " + user.name + " has been set.");
		} else {
			for (let i = 0, len = bios.length; i < len; i++) {
				if (user.id === bios[i].name) {
					return this.say(text + user.name + ": " + bios[i].bio);
				} else if (tarUser === bios[i].name) {
					return this.say(text + target + ": " + bios[i].bio);
				}
			}
			if (target) {
				this.say(text + "No biography found for " + target);
			} else {
				return this.say(text + "You haven't set a biography yet! :o");
			}
		}
	},
	/*
	* Scribe Shop Commands!
	*/
	addmoles: 'addfunds',
	pay: 'addfunds',
	addfunds: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '%')) return false;
		let targets = target.split(',');
		if (targets.length !== 2) return this.say("Incorrect number of arguments. Usage: user, funds to add");
		let targetUser = Tools.toId(targets[0]);
		//Whilst it certainly shouldn't be an issue in the rooms I'm personally stationed in, we may as well prevent moderators from abusing their rights and giving themselves infinite money. No need to enforce this on ROs.
		if (targetUser === user.id && !user.hasRank(room, '#')) return this.say("Sorry, but you're not allowed to add funds to your own account unless it's for debugging purposes. ^.^'");
		let funds = parseInt(targets[1]);
		if (isNaN(funds)) return this.say("Currency amount to add is not equal to a number.");

		//Build instance of the Scribe Shop if it does not exist; this will always happen on the first use of the command on a new bot, or if Settings.json has been erased or damaged.
		if (!database.researchMerch) {
			database.researchMerch = [];
			let extraFunds = Math.round(funds / 2);
			let amount = funds + extraFunds;
			database.researchMerch.push({
				account: targetUser,
				bal: amount,
				totalEarned: amount,
			});
			Storage.exportDatabase('writing');
			return this.say("A new Scribe Shop service has been created, and its very first account, " + targets[0].trim() + "'s, has had ``" + funds + "`` Moles added. And as a bonus for this event, we're throwing in an extra ``" + extraFunds + "`` Moles, absolutely free of charge! Now aren't we just so nice? c:");
		}

		//Search through all accounts.
		for (let i = 0; i < database.researchMerch.length; i++) {
			//If account is found...
			if (database.researchMerch[i].account === targetUser) {
				//Add funds.
				database.researchMerch[i].bal += funds;
				database.researchMerch[i].totalEarned += funds;
				//Save changes.
				Storage.exportDatabase('writing');
				//Report changes.
				return this.say("``" + funds + "`` Moles have been added to " + targets[0].trim() + "'s account! Current Balance: ``" + database.researchMerch[i].bal + "``");
			}
		}
		//Add new account and save changes.
		database.researchMerch.push({
			account: targetUser,
			bal: funds,
			totalEarned: funds,
		});
		Storage.exportDatabase('writing');
		//Report completion.
		return this.say("New account for " + targets[0].trim() + " has been created and ``" + funds + "`` Moles have been added!");
	},
	//Subtract funds from a user's account.
	takemoles: 'takefunds',
	take: 'takefunds',
	takefunds: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '@')) return false;
		let targets = target.split(',');
		if (targets.length !== 2) return this.say("Incorrect number of arguments. Usage: user, funds to add");
		let targetUser = Tools.toId(targets[0]);
		let funds = parseInt(targets[1]);
		if (isNaN(funds)) return this.say("Currency amount to take is not equal to a number.");

		for (let i = 0; i < database.researchMerch.length; i++) {
			if (database.researchMerch[i].account === targetUser) {
				//Checking to see if the user has enough money to subtract.
				database.researchMerch[i].bal = Math.max(database.researchMerch[i].bal - funds, 0);
				this.say("``" + funds + "`` Moles have been deducted from " + targets[0].trim() + "'s account! Their new balance is ``" + database.researchMerch[i].bal + "``");
			}
		}
	},
	// Returns current balance for a particular user. Or yourself, if nobody is specified.
	atm: 'bal',
	balance: 'bal',
	bal: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		if (!database.researchMerch) return this.say(text + "The Scribe Shop does not exist! Perhaps Moles should be given out first before trying to view a non-existent currency, hmm?");

		//If no user is specified, check the user's own balance.
		if (!target) {
			for (let i = 0; i < database.researchMerch.length; i++) {
				if (database.researchMerch[i].account === user.id) {
					if (database.researchMerch[i].totalEarned !== database.researchMerch[i].bal) {
						return this.say(text + user.name + ", you currently have ``" + database.researchMerch[i].bal + "`` Moles to spend! Over the whole lifetime of your account, you have earned a whole ``" + database.researchMerch[i].totalEarned + "`` Moles!");
					} else {
						return this.say(text + user.name + ", you currently have ``" + database.researchMerch[i].bal + "`` Moles to spend!");
					}
				}
			}
			return this.say(text + "You don't have an account! oAo Earn funds to get one automagically!");
		} else {
			let targetUser = Tools.toId(target);
			for (let i = 0; i < database.researchMerch.length; i++) {
				if (database.researchMerch[i].account === targetUser) {
					if (database.researchMerch[i].totalEarned !== database.researchMerch[i].bal) {
						return this.say(text + target + " currently has ``" + database.researchMerch[i].bal + "`` Moles to spend! Over the whole lifetime of their account, they have earned a whole ``" + database.researchMerch[i].totalEarned + "`` Moles!");
					} else {
						return this.say(text + target + " currently has ``" + database.researchMerch[i].bal + "`` Moles to spend!");
					}
				}
			}
			return this.say(text + "Account for '" + target + "' does not exist. :c");
		}
	},
	// Automatically generates the 'UI' for the shop, and uploads it to Hastebin.
	researchmerch: 'rm',
	researchmerch: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		let line = "__________________________________________________________________________________________________________________________________________";
		let post = [line,
			"\nResearch Warehouse!\n",
			'"Got spare Moles? This is where you spend them!"\n',
			"Use " + Config.commandCharacter + "buy ITEM NAME, ITEM QUANTITY to purchase something!",
			"Alternatively, you can leave out the item quantity to just buy one of the item, and use the number in brackets in place of the item's full name!\n\n",
			"As a general rule of thumb, to purchase things, you simply type " + Config.commandCharacter + "buy, followed by the item's name or number. For instance, to purchase the item '" + shopMerch[0][0] + "', you would ype " + Config.commandCharacter + "buy " + shopMerch[0][0] + " or " + Config.commandCharacter + "buy 0\n",
			"Additionally, it's also possible to specify just how many of something you want to buy by including that at the end of the message! Returning to our " + shopMerch[0][0] + " example from earlier, " + Config.commandCharacter + "buy " + shopMerch[0][0] + ", 10 will purchase the item 10 times!\n",
			line + "\n",
		];

		let accFound = false;
		if (database.researchMerch) {
			for (let i = 0; i < database.researchMerch.length; i++) {
				if (database.researchMerch[i].account === user.id) {
					post.push("Greetings, " + user.name + "! Welcome to the Scribe Shop!\n\nCurrent Balance: " + database.researchMerch[i].bal + "\nTotal Earned Over Time: " + database.researchMerch[i].totalEarned + "\n" + line + "\n");
					accFound = true;
					break;
				}
			}
		}
		if (!accFound) {
			post.push("Greetings, " + user.name + "! It seems that you don't have an account with us yet! Feel free to ask our staff about earning Moles (the currency that The Scribe uses in the store!)" + "\n" + line + "\n");
		}

		for (let i = 0; i < shopMerch.length; i++) {
			post.push("[" + i + "] " + shopMerch[i][0] + "\nPrice: " + shopMerch[i][2] + " Moles\nDescription: " + shopMerch[i][1] + "\nUsage: " + Config.commandCharacter + "buy " + shopMerch[i][4] + "\nApplicable Room(s): " + shopMerch[i][5] + "\n");
		}

		post.push("\n\n\n" + line + "\nWe here at the Scribe Shop reserve the right to deny a user their purchase or demand that their request be altered on a case-by-case basis");

		Tools.uploadToHastebin(post.join('\n'), /**@param {string} link*/ link => this.say(text + "Research Warehouse! " + link));
	},
	// Buy stuff. .-.
	buy: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		if (!database.researchMerch) return this.say(text + "The Scribe Shop does not exist! Perhaps funds should be given out first before trying to view a non-existent currency, hmm?");
		let targets = target.split(',');
		let item = Tools.toId(targets[0]);
		if (!item) return this.say(text + "Please provide the name or number of the item you wish to buy. Thank you. c:");
		let amount = 0;
		if (targets[1]) {
			amount = parseInt(targets[1]);
			if (amount === 0) return this.say(text + "Buying '0' of something is a waste of time!");
			if (isNaN(amount)) return this.say(text + "The second argument must be a number! It's to specify the amount of the first argument you want to buy! Example: " + Config.commandCharacter + "buy Cookie, 50");
		}
		let account;
		for (let i = 0; i < database.researchMerch.length; i++) {
			if (database.researchMerch[i].account === user.id) {
				if (database.researchMerch[i].bal <= 0) return this.say(text + "You don't exactly have any money to spend, do you?");
				account = database.researchMerch[i];
			}
		}
		if (!account) return this.say(text + "An account under your name does not exist! :o Perhaps you were never given any funds in the first place? Or perhaps you're just trying out the command after seeing someone else use it? Either way, use " + Config.commandCharacter + "shop to learn more!");

		let numBr = 0;

		//If the user specified a number instead of the actual name, substitute out the number of the item for the name of it.
		let itemNumber = parseInt(item);
		if (!isNaN(itemNumber)) {
			// @ts-ignore
			if (shopMerch[itemNumber]) item = shopMerch[itemNumber][0];
		}

		switch (item) {
		case "cookie": {
			//Locating the item in the shop, as it's ordered by price and I'd rather not have to go through and change these every time we add something. c:
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Cookie") {
					numBr = j;
					break;
				}
			}
			// @ts-ignore
			let price = shopMerch[numBr][3] * amount;
			if (account.bal < price) {
				if (amount === 1) {
					return this.say(text + "You can't afford to buy a Cookie! You must be very sad. :c");
				} else {
					return this.say(text + "You can't afford " + amount + " Cookies. You must be extremely sad. :c");
				}
			}
			account.bal -= price;
			if (!account.cookies) {
				account.cookies = 0;
			}
			account.cookies += Number(amount);
			this.say(text + "Cookie (x" + amount + ") bought!");
			break;
		}
		case "inspirationalquote":
		case "quote":
			if (amount > 1) return this.say(text + "Sorry, but you can only buy one quote at a time. c:");
			this.say(text + "Sorry, but this is disabled for now until we can get some more quotes. Come back later! You have not been charged for this.");
			/*
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Inspirational Quote") {
					numBr = j;
					break;
				}
			}
			if (account.bal < shopMerch[numBr][3]) return this.say(text + "You can't afford any quotes! You must be very disheartened. :c");
			account.bal -= shopMerch[numBr][3];
			let quote = "Don't let your dreams be dreams! (This is a placeholder. Sorry :c)";
			this.say(text + "Your inspirational quote is: " + quote);
			*/
			break;
		case "inspirethemasses":
		case "inspire":
			if (amount > 1) return this.say(text + "Sorry, but you can only buy one of these.");
			if (account.masses === 1) return this.say(text + "Sorry, but you already own one of these!");
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Inspire The Masses") {
					numBr = j;
					break;
				}
			}
			if (account.bal < shopMerch[numBr][3]) return this.say(text + "You can't afford to inspire the masses! Uh-oh...");
			// @ts-ignore
			account.bal -= shopMerch[numBr][3];
			account.masses = 1;
			this.say(text + "Bought! Congratulations! Go ahead and talk to an RO now about having your image publicly displayed for the whole room to see!");
			break;
		case "privategreeting":
		case "personalgreetingpm":
		case "greetingpm": {
			if (amount > 1) return this.say(text + "Sorry, but you can only buy one of these.");
			if (account.greetings) {
				if (account.greetings.private) return this.say(text + "Sorry, but you already own one of these! Feel free to edit it with the " + Config.commandCharacter + "editgreeting command!");
			}
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Personal Greeting (PM)") {
					numBr = j;
					break;
				}
			}

			if (account.bal < shopMerch[numBr][3]) return this.say(text + "You can't afford to buy a personal greeting! Awh...");
			// @ts-ignore
			account.bal -= shopMerch[numBr][3];
			if (!account.greetings) {
				account.greetings = {};
			}
			account.greetings.private = {};
			let greeting = {
				text: "Don't forget to set your new Personal Greeting with " + Config.commandCharacter + "editgreeting!",
				lastTriggered: null,
				enabled: true,
			};
			account.greetings.private = greeting;
			this.say(text + "Bought! Congratulations! Go ahead and use the " + Config.commandCharacter + "editgreeting command to set your new greeting!");
			break;
		}
		case "takethestage":
		case "stage": {
			if (amount > 2) return this.say(text + "Sorry, but you can only buy one of these.");
			if (account.stage + amount > 2) return this.say(text + "Sorry, but you already own two of these at any one time.");
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Take The Stage") {
					numBr = j;
					break;
				}
			}
			// @ts-ignore
			let price = shopMerch[numBr][3] * amount;
			if (account.bal < price) return this.say(text + "You can't afford to take the stage! Boo... :c");
			account.bal -= price;
			if (!account.stage) {
				account.stage = 0;
			}
			account.stage += Number(amount);
			this.say(text + "Bought! Congratulations! Feel free to use the " + Config.commandCharacter + "spotlight command to Take The Stage!");
			break;
		}
		case "poeticlicense":
		case "license":
			if (!(room instanceof Users.User) && user.hasRank(room, '+')) return this.say(text + "There's no need for you to buy this! You can set the WOTD whenever you want, silly. ;p");
			if (amount > 1) return this.say(text + "Sorry, but you can only buy one of these. :c");
			if (account.wotd) return this.say(text + "You already own a Poetic License! Remember to set the WOTD with " + Config.commandCharacter + "wotd ``word``, ``pronunciation``, ``part of speech`` (Noun, Verb, Adjective, Etc.), and ``Definition``.");
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Poetic License") {
					numBr = j;
					break;
				}
			}
			if (account.bal < shopMerch[numBr][3]) return this.say(text + "You can't afford to buy a poetic license! Should we... arrest you, or something?");
			// @ts-ignore
			account.bal -= shopMerch[numBr][3];
			account.wotd = 3;
			this.say(text + "Bought! Congratulations, you now have the ability to edit the Word of the Day up to 3 times! The format is: " + Config.commandCharacter + "wotd ``word``, ``pronunciation``, ``part of speech`` (Noun, Verb, Adjective, Etc.), and ``Definition``.");
			break;
		case "publicgreeting":
		case "personalgreetingpublic":
		case "greetingpublic": {
			if (amount > 1) return this.say(text + "Sorry, but you can only buy one of these.");
			if (account.greetings) {
				if (account.greetings.public) return this.say(text + "Sorry, but you already own one of these! Feel free to edit it with the " + Config.commandCharacter + "editgreeting command!");
			}
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Personal Greeting (Public)") {
					numBr = j;
					break;
				}
			}
			if (account.bal < shopMerch[numBr][3]) return this.say(text + "You can't afford to buy a personal greeting! Awh...");
			// @ts-ignore
			account.bal -= shopMerch[numBr][3];
			if (!account.greetings) {
				account.greetings = {};
			}
			account.greetings.public = {};
			let greeting = {
				text: "/msg " + user.name + ", Don't forget to set your new Personal Greeting with " + Config.commandCharacter + "editgreeting!",
				lastTriggered: null,
				enabled: true,
			};
			account.greetings.public = greeting;
			this.say(text + "Bought! Congratulations! Go ahead and use the " + Config.commandCharacter + "editgreeting command to set your new greeting!");
			break;
		}
		case "letssavetheworld":
		case "savetheworld":
		case "protagonist":
			if (amount > 1) return this.say(text + "Sorry... You can only buy one of these. :c");
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Let's Save The World!") {
					numBr = j;
					break;
				}
			}
			if (account.bal < shopMerch[numBr][3]) return this.say(text + "You can't afford to save the world! ...Welp. We're done for now, aren't we? >:/ Good job, " + user.name + "! You had one job.");
			// @ts-ignore
			account.bal -= shopMerch[numBr][3];
			let protag = {
				enabled: true,
				sponsored: false,
				deadline: null,
				sponsor: null,
			};
			if (account.protag) {
				if (account.protag.enabled) return this.say(text + "Sorry. you can only own one of these at once. Go ahead and redeem yours first before you try to buy another!");
			}
			account.protag = protag;
			this.say(text + "Bought! Congratulations! Now, your next goal is to try and convince someone in the approved list of Sponsors to ``" + Config.commandCharacter + "sponsor`` you! For a list of users who can do this, go ahead and use ``" + Config.commandCharacter + "sponsors``.");
			this.say(text + "If the Sponsor doesn't submit their story by the deadline (3 weeks from the date of sponsorship), then you will recieve your copy of Let's Save the World back! Yaaaaay. c:");
			break;
		case "destroyitall":
		case "destroy":
		case "antagonist":
			for (let j = 0; j < shopMerch.length; j++) {
				if (shopMerch[j][0] === "Destroy It All!") {
					numBr = j;
					break;
				}
			}
			if (account.bal < shopMerch[numBr][3]) return this.say(text + "You can't afford to destroy it all! ...W-wait... Isn't that a good thing?");
			// @ts-ignore
			account.bal -= shopMerch[numBr][3];
			let antag = {
				enabled: true,
				sponsored: false,
				deadline: null,
				sponsor: null,
			};
			if (account.antag) {
				if (account.antag.enabled) return this.say(text + "Sorry. you can only own one of these at once. Go ahead and redeem yours first before you try to buy another!");
			}
			account.antag = antag;
			this.say(text + "Bought! Congratulations! Now, your next goal is to try and convince someone in the approved list of Sponsors to ``" + Config.commandCharacter + "sponsor`` you! For a list of users who can do this, go ahead and use ``" + Config.commandCharacter + "sponsors``.");
			this.say(text + "If the Sponsor doesn't submit their story by the deadline (3 weeks from the date of sponsorship), then you will recieve your copy of Destroy It All back! Yaaaaay. c:");
			break;
		case "mysoul":
		case "yoursoul":
		case "soul":
			if (!(room instanceof Users.User) && user.hasRank(room, '+')) {
				return this.say(text + "You cannot.");
			} else {
				return this.say(text + "...You really are a funny sort, aren't you?");
			}
		default:
			return this.say(text + "That item doesn't exist! Check that you're typing the right name, or contact a staff member if something's not working properly!");
		}
		Storage.exportDatabase('writing');
		this.say(text + "Thank you for doing business at the Scribe Shop! Your new balance is: ``" + account.bal + "``!");
	},
	cookies: 'cookie',
	cookie: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		if (!database.researchMerch) return this.say(text + "The Scribe Shop does not exist! Perhaps funds should be given out first before trying to view a non-existent currency, hmm?");
		for (let i = 0; i < database.researchMerch.length; i++) {
			if (database.researchMerch[i].account === user.id) {
				if (database.researchMerch[i].cookies) {
					return this.say(text + "You have " + database.researchMerch[i].cookies + " cookies!");
				} else {
					return this.say(text + "You haven't any cookies... Awh.");
				}
			}
		}
		return this.say(text + "Odd... You don't seem to even have an account! :c");
	},
	inspire: 'checkmasses',
	masses: 'checkmasses',
	checkmasses: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '#')) return false;
		if (!database.researchMerch) return this.say("Error: The Scribe Shop does not exist. Please instruct someone with a rank to add funds to somebody's account before continuing.");
		let targets = target.split(',');
		let buyer = Tools.toId(targets[0]);
		if (!buyer) return this.say("Please input the name of the user to search for.");
		let action = Tools.toId(targets[1]);
		for (let i = 0; i < database.researchMerch.length; i++) {
			if (database.researchMerch[i].account === buyer) {
				if (database.researchMerch[i].masses === 1) {
					if (action === "use" || action === "redeem") {
						database.researchMerch[i].masses = 0;
						Storage.exportDatabase('writing');
						return this.say("Now redeeming... Transation complete! Feel free to summon the requested image. " + targets[0].trim() + " may now buy another copy of Inspire the Masses if they wish.");
					} else {
						return this.say("**Yes!** " + targets[0].trim() + " has the rights to Inspire The Masses!");
					}
				} else {
					return this.say("__Nope.__ " + targets[0].trim() + " doesn't have the rights to Inspire The masses.");
				}
			}
		}
	},
	editgreeting: function (target, room, user) {
		if (!(room instanceof Users.User) && !user.hasRank(room, '+')) return false;
		if (!database.researchMerch) return this.say("Error: The Scribe Shop does not exist. Please instruct someone with a rank to add funds to somebody's account before continuing.");
		if (!target) return this.say("Incorrect usage. ``(" + Config.commandCharacter + "editgreeting [public/private], New Greeting)``");
		let targets = target.split(',');
		let type = Tools.toId(targets[0]);
		if (!targets[1] || (type !== "public" && type !== "private")) return this.say("Incorrect usage. ``(" + Config.commandCharacter + "editgreeting [public/private], New Greeting)``");
		let newGreetingText = targets.slice(1).join(', ');
		for (let i = 0; i < database.researchMerch.length; i++) {
			if (database.researchMerch[i].account === user.id) {
				if (!database.researchMerch[i].greetings) {
					return this.say("You didn't even buy a greeting first to edit, " + user.name + "!");
				} else if (type === "public") {
					if (!database.researchMerch[i].greetings.public) return this.say("You don't own a Public Greeting! QAQ");
					// And now, to begin the changes! PS message length hard cap: 300 characters.
					// Softcap: 300 take (28 plus username length).
					// This limit exists so that AxeBot has an excuse to say something before the public greeting. Otherwise, people could get the bot to use commands. Whilst something like /me is relatively harmless... what happens when someone sets their 'greeting' to /ban a bunch of people?
					let customLimit = 300 - (28 + database.researchMerch[i].account.length);
					if (newGreetingText.length > customLimit) return this.say("Sorry, but the length of your message is too long! Your personal limit is set to " + customLimit + " characters. Try shortening your greeting or using a shorter username for your account.");
					database.researchMerch[i].greetings.public.text = newGreetingText;
					Storage.exportDatabase('writing');
					return this.say("Greeting updated: " + newGreetingText);
				} else if (type === "private") {
					if (!database.researchMerch[i].greetings.private) return this.say("You don't own a Private Greeting! QAQ");
					database.researchMerch[i].greetings.private.text = newGreetingText;
					Storage.exportDatabase('writing');
					return this.say("Greeting updated: " + newGreetingText);
				}
			}
		}
	},
	spotlight: function (target, room, user) {
		if (room instanceof Users.User) return false;
		let text = user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		if (Tools.toId(Config.username) === "axebot") return this.say(text + "This command cannot be used on AxeBot because it's too spammy.");
		// Two minutes.
		let found = false;
		for (let i = 0; i < database.researchMerch.length; i++) {
			if (user.id === database.researchMerch[i].account) {
				found = true;
				if (!database.researchMerch[i].stage) return this.say(text + "Seems like you haven't bought a copy of Take the Stage yet!");
				database.researchMerch[i].stage -= 1;
				this.say("**WARNING:** " + user.name + " has redeemed their copy of 'Take the Stage!' Due to this, Moderated Chat (+) will be put in place in **one minute!** Please finish up any discussions you may be having quickly. :3");
				/*
				this.enable = setTimeout(() => {
					let origVoice = false;
					this.say(room, "/modchat +");
					if (!user.hasRank(room, '+')) {
						this.say(room, "/roomvoice " + user.id);
					} else {
						origVoice = true;
					}
					this.say(room, user.name + "'s **Take the Stage** is now in play! The candy bar is now open. Please sit back, relax, and enjoy the movie. c:");
					this.warn = setTimeout(() => {
						this.say(room, "/msg " + user.id + ", **Hey!** One minute remaining until your time expires. :o");
						this.warnAgain = setTimeout(() => {
							this.say(room, "/msg " + user.id + ", **WARNING:** Time's almost up! Thirty seconds remaining! QAQ");
						}, 60 * 500);
					}, 60 * 1000);
					this.disable = setTimeout(() => {
						this.say(room, "/modchat autoconfirmed");
						if (origVoice === false) this.say(room, "/roomdevoice " + user.id);
						this.say(room, "**Time's up!** Thank you for using Take the Stage. c:");
					}, 60 * 2000);
				}, 60 * 1000);
				*/
			}
		}
		if (!found) return this.say(text + "Sorry, but you don't seem to have a Scribe Shop account. :/");
	},
	sponsor: function (target, room, user) {
		if (!target) return false;
		let text = (room instanceof Users.User || user.hasRank(room, '+')) ? '' : '/pm ' + user.id + ', ';
		if (!database.sponsors) return this.say(text + "Sorry, but we don't have a list of sponsors to cross-reference with. Please submit a request with a staff member to be added.");
		if (!database.researchMerch) return this.say(text + "Sorry, but an instance of the Scribe Shop doesn't exist! This means we can't cross-reference with the people that need to be sponsored. :c");
		let targets = target.split(',');
		if (targets.length < 2) return this.say(text + "Sorry. Please specify the user that you wish to sponsor and if you're sponsoring a ``protagonist`` or an ``antagonist``.");
		let targetUser = Tools.toId(targets[0]);
		if (targetUser === user.id) return this.say(text + "Sponsoring yourself seems like a waste of all our time.");
		let type = Tools.toId(targets[1]);
		for (let i = 0; i < database.sponsors.length; i++) {
			if (database.sponsors[i].user === user.id) {
				if (database.sponsors[i].sponsoring) return this.say(text + "Error: You seem to be already sponsoring " + database.sponsors[i].who + "!");
				for (let j = 0; j < database.researchMerch.length; j++) {
					if (targetUser === database.researchMerch[j].account) {
						if (type === "protagonist") {
							if (database.researchMerch[j].protag) {
								if (database.researchMerch[j].protag.enabled) {
									if (database.researchMerch[j].protag.sponsored) return this.say(text + "Sorry, but it would seem that " + database.researchMerch[j].protag.sponsor + " is already working on a project for this user!");
									database.researchMerch[j].protag.sponsored = true;
									database.researchMerch[j].protag.sponsor = user.name;
									let thing = new Date();
									thing.setDate(thing.getDate() + 21);
									database.researchMerch[j].protag.deadline = thing;
									database.sponsors[i].sponsoring = true;
									database.sponsors[i].who = targets[0];
									Storage.exportDatabase('writing');
									return this.say(text + "Sponsorship set up! This action cannot be undone, so it's probably a good idea to get right to it and start working on the commission! You have **three weeks** from now to submit it using the ``" + Config.commandCharacter + "submit`` command.");
								} else if (database.researchMerch[j].antag) {
									if (!database.researchMerch[j].antag.enabled) return this.say(text + "Sorry, but the user you specified hasn't redeemed Save The World! But, they do seem to have the rights to Destroy It All! In which case, you should specify to commission an antagonist instead!");
								} else {
									this.say(text + "Eh. It would seem that " + targets[0] + " doesn't have the rights to be sponsored through the Scribe Shop! Oh dear...");
								}
							} else {
								return this.say(text + "ERROR: It would seem that the user you specified exists, but they have never once bought the rights for a Protagonist in the first place.");
							}
						} else if (type === "antagonist") {
							if (database.researchMerch[j].antag) {
								if (database.researchMerch[j].antag.enabled) {
									if (database.researchMerch[j].antag.sponsored) return this.say(text + "Sorry, but it would seem that " + database.researchMerch[j].antag.sponsor + " is already working on a project for this user!");
									database.researchMerch[j].antag.sponsored = true;
									database.researchMerch[j].antag.sponsor = user.name;
									let thing = new Date();
									thing.setDate(thing.getDate() + 21);
									database.researchMerch[j].antag.deadline = thing; //Literally the only reason we don't go and define object.timeout as "thing" is because this makes it easier when it comes to changing lots of things in bulk, instead of consistantly searching between two arrays. It just... works. Let's not touch it.
									database.sponsors[i].sponsoring = true;
									database.sponsors[i].who = targets[0];
									if (!database.bookmark) {
										database.bookmark = [];
									}
									database.bookmark.push({
										type: "AntagTimeout",
										sponsor: user.id,
										solicitor: database.researchMerch[j].account,
										timeout: database.researchMerch[j].antag.deadline,
									});
									Storage.exportDatabase('writing');
									return this.say(text + "Sponsorship set up! This action cannot be undone, so it's probably a good idea to get right to it and start working on the commission! You have **three weeks** from now to submit it using the ``" + Config.commandCharacter + "submit`` command.");
								} else if (database.researchMerch[j].protag) {
									if (!database.researchMerch[j].protag.enabled) return this.say(text + "Sorry, but the user you specified hasn't redeemed Destroy It All! But, they do seem to have the rights to Save The World! In which case, you should specify to commission a ``protagonist`` instead!");
								} else {
									this.say(text + "Eh. It would seem that " + targets[0] + " doesn't have the rights to be sponsored through the Scribe Shop! Oh dear...");
								}
							} else {
								return this.say(text + "ERROR: It would seem that the user you specified exists, but they have never once bought the rights for an Antagonist in the first place.");
							}
						} else {
							return this.say(text + "Please specify either ``protagonist`` or ``antagonist`` after the user you with to sponsor!");
						}
					}
				}
			}
		}
		return this.say(text + "Sorry, but you don't seem to be on our list of sponsors. :/ Please submit a request with a staff member to be added!");
	},
	sponsors: function (target, room, user) {
		let text = (room instanceof Users.User || user.hasRank(room, '+')) ? '' : '/pm ' + user.id + ', ';
		if (!database.sponsors) return this.say(text + "Sorry, but our list of sponsors is empty. </3");
		let output = [];
		let line = "_____________________________________________________________________________";
		let sponsors = database.sponsors;
		for (let i = 0; i < sponsors.length; i++) {
			output.push("Username: " + sponsors[i].userFullcaps +
			"\nCurrently Sponsoring: " + sponsors[i].sponsoring + " (" + sponsors[i].who + ")\nFinished Sponsorships: " + sponsors[i].fin + "\nFailed Sponsorships: " + sponsors[i].fail + "\nTotal Sponsorships: " + (sponsors[i].fin + sponsors[i].fail),
			"\nSponsor Since: " + sponsors[i].added + "\n",
			line,
			"\n");
		}
		Tools.uploadToHastebin('The following users are official Writing Room sponsors!\n' + line + '\n\n\n' + output.join('\n'), /**@param {string} link*/ link => {
			if (link.startsWith('Error')) return this.say(text + link);
			this.say(text + 'Sponsors: ' + link);
		});
	},
	addsponsor: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '#')) return false;
		if (!target) return this.say("Don't forget to list the user that you want to add!");
		if (!database.sponsors) database.sponsors = [];
		let reference = Tools.toId(target);
		for (let i = 0; i < database.sponsors.length; i++) {
			if (reference === database.sponsors[i].user) return this.say("Sorry. That user is already in our list of sponsors!");
		}
		database.sponsors.push({
			user: Tools.toId(target),
			userFullcaps: target,
			sponsoring: false,
			who: "Nobody",
			fin: 0,
			fail: 0,
			added: new Date().toString(),
		});
		Storage.exportDatabase('writing');
		return this.say("Sponsor recorded! Added " + target + " to our list of sponsors. c:");
	},
	rmmsponsor: 'deletesponsor',
	removesponsor: 'deletesponsor',
	deletesponsor: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '#')) return false;
		if (!target) return this.say("Please specify the user that you want to remove.");
		if (!database.sponsors) return this.say("There aren't any sponsors to remove. :/");
		let reference = Tools.toId(target);
		for (let i = 0; i < database.sponsors.length; i++) {
			if (reference === database.sponsors[i].user) {
				database.sponsors.splice(i, 1);
				Storage.exportDatabase('writing');
				return this.say("Removing sponsor... Done!");
			}
		}
		return this.say("Sorry, '" + reference + "' wasn't found in our list of sponsors. :/");
	},
	disable: 'disablegreeting',
	enable: 'disablegreeting',
	enablegreeting: 'disablegreeting',
	disablegreeting: function (target, room, user) {
		let text = (room instanceof Users.User || user.hasRank(room, '+')) ? '' : '/pm ' + user.id + ', ';
		let error = "Please specify whether you'd like to alter a Public or Private greeting.";
		if (!target) return this.say(text + error);
		let type = Tools.toId(target);
		if (type !== "public" && type !== "private") return this.say(text + error);
		if (!database.researchMerch) return this.say(text + "Error: The Scribe Shop does not exist. Please instruct someone with a rank to add funds to somebody's account before continuing.");
		for (let i = 0; i < database.researchMerch.length; i++) {
			if (database.researchMerch[i].account === user.id) {
				if (type === "private") {
					if (!database.researchMerch[i].greetings.private) return this.say(text + "You don't have a private greeting, " + user.name + ". :/");
					if (database.researchMerch[i].greetings.private.enabled !== false) {
						database.researchMerch[i].greetings.private.enabled = false;
						this.say(text + "Private greeting now set to: Disabled.");
					} else {
						database.researchMerch[i].greetings.private.enabled = true;
						this.say(text + "Private greeting now set to: Enabled.");
					}
				} else {
					if (!database.researchMerch[i].greetings.public) return this.say(text + "You don't have a public greeting, " + user.name + ". :/");
					if (database.researchMerch[i].greetings.public.enabled !== false) {
						database.researchMerch[i].greetings.public.enabled = false;
						this.say(text + "Public greeting now set to: Disabled.");
					} else {
						database.researchMerch[i].greetings.public.enabled = true;
						this.say(text + "Public greeting now set to: Enabled.");
					}
				}
				return Storage.exportDatabase('writing');
			}
		}
	},
	'submit': function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.id + ', ';
		if (!target) return this.say(text + "Incorrect Usage. Use: ``" + Config.commandCharacter + "submit [username of recipient], [document name],[protagonist/antagonist]``");
		let targets = target.split(',');
		if (!targets[1]) return this.say(text + "You seem to have forgotten to put in the document that you wish to submit!");
		if (!targets[2]) return this.say(text + "You must specify if you're submitting a piece for a ``protagonist`` or an ``antagonist``!");
		if (!database.researchMerch) return this.say(text + "Error: The Scribe Shop doesn't seem to exist.");
		let targetUser = Tools.toId(targets[0]);
		let document = targets[1].trim();
		let type = Tools.toId(targets[2]);
		if (type !== "protagonist" && type !== "antagonist") return this.say(text + "Please specify either ``protagonist`` or ``antagonist`` after the document you wish to submit.");
		for (let i = 0; i < database.sponsors.length; i++) {
			if (database.sponsors[i].user === user.id) {
				if (!database.sponsors[i].sponsoring) return this.say(text + "Error: You're a sponsor, but you're apparently not sponsoring anyone!");
				for (let j = 0; j < database.researchMerch.length; j++) {
					if (targetUser === database.researchMerch[j].account) {
						if (type === "protagonist") {
							if (database.researchMerch[j].protag) {
								if (database.researchMerch[j].protag.enabled) {
									if (!database.researchMerch[j].protag.sponsored) return this.say(text + "Sorry, but the user you specified doesn't have a sponsor in the first place.");
									database.researchMerch[j].protag.sponsored = false;
									database.researchMerch[j].protag.enabled = false;
									database.researchMerch[j].protag.sponsor = null;
									database.researchMerch[j].protag.deadline = null;
									database.sponsors[i].sponsoring = false;
									database.sponsors[i].who = "Nobody";
									database.sponsors[i].fin += 1;
									for (let h = 0; h < database.researchMerch.length; h++) {
										if (user.id === database.researchMerch[h].account) {
											database.researchMerch[h].bal += 1000;
										}
									}
									if (!database.notifs) database.notifs = [];
									database.notifs.push({
										type: "Submission",
										name: targetUser,
										'link': document,
										submitter: user.name,
									});
									this.say("/modnote " + user.name + " has submitted a Protagonist piece for " + targets[0] + ". URL: " + document);
									Storage.exportDatabase('writing');
									return this.say(text + "Sponsorship complete! Thank you for using the Scribe Shop. Your solicitor will receive your piece of work, and as a 'thank you' for completing a sponsorship program, you've been credited ``1,000`` Moles!");
								} else {
									return this.say(text + "Eh. It would seem that " + targets[0] + " doesn't have the ability to be sponsored through a Protagonist. Maybe they wanted an Antagonist? If you're confused about it at this stage, then something's gone wrong. .3.'");
								}
							}
						} else if (type === "antagonist") {
							if (database.researchMerch[j].antag) {
								if (database.researchMerch[j].antag.enabled) {
									if (database.researchMerch[j].antag.sponsored) return this.say(text + "Sorry, but it would seem that " + database.researchMerch[j].antag.sponsor + " is already working on a project for this user!");
									database.researchMerch[j].antag.sponsored = false;
									database.researchMerch[j].antag.enabled = false;
									database.researchMerch[j].antag.sponsor = null;
									database.researchMerch[j].antag.deadline = null;
									database.sponsors[i].sponsoring = false;
									database.sponsors[i].who = "Nobody";
									database.sponsors[i].fin += 1;
									for (let h = 0; h < database.researchMerch.length; h++) {
										if (user.id === database.researchMerch[h].account) {
											database.researchMerch[h].bal += 1000;
										}
									}
									if (!database.notifs) database.notifs = [];
									this.say("/modnote " + user.name + " has submitted an Antagonist piece for " + targets[0] + ". URL: " + document);
									database.notifs.push({
										type: "Submission",
										name: targetUser,
										'link': document,
										submitter: user.name,
									});
									Storage.exportDatabase('writing');
									return this.say(text + "Sponsorship complete! Thank you for using the Scribe Shop. Your solicitor will receive your piece of work, and as a 'thank you' for completing a sponsorship program, you've been credited ``1,000`` Moles!");
								} else {
									return this.say(text + "Eh. It would seem that " + targets[0] + " doesn't have the ability to be sponsored through an Antagonist. Maybe they wanted a Protagonist? If you're confused about it at this stage, then something's gone wrong. .3.'");
								}
							}
						}
					}
				}
			}
		}
		return this.say(text + "ERROR: You do not seem to be a sponsor at all! q-q");
	},
	/*
	* End of Scribe Shop Commands
	*/
	groups: function (target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '+')) return false;
		if (!database.groups) {
			database.groups = {};
			database.groups.teams = [];
			database.groups.singles = [];
			Storage.exportDatabase('writing');
		}
		if (!target) {
			let listSingles = [];
			let listGroups = [];
			let printSingles = "";
			let printGroups = "";
			if (database.groups.singles.length === 0) {
				printSingles = "Empty!";
			} else {
				for (let i = 0; i < database.groups.singles.length; i++) {
					listSingles.push("Name: " + database.groups.singles[i].name + "\nAdded: " + database.groups.singles[i].added + "\n");
				}
			}
			if (database.groups.teams.length === 0) {
				printGroups = "Empty!";
			} else {
				for (let i = 0; i < database.groups.teams.length; i++) {
					listGroups.push("Leader: " + database.groups.teams[i].leader + "\nOther Members: " + database.groups.teams[i].rest.join(', ') + "\nAdded: " + database.groups.singles[i].added + "\n");
				}
			}
			// Return list of groups...
			printSingles = "List of Solo Entries\n" + listSingles.join("\n" + "---\n");
			printGroups = "List of Team Entries\n" + listGroups.join("\n" + "---\n");
			Tools.uploadToHastebin(printSingles, /**@param {string} link*/ link => {
				if (link.startsWith('Error')) return this.say(link);
				this.say('Solo Entries: ' + link);
			});
			Tools.uploadToHastebin(printGroups, /**@param {string} link*/ link => {
				if (link.startsWith('Error')) return this.say(link);
				this.say('Team Entries: ' + link);
			});
		}
		let args = target.split(', ');
		if (args[0] === "add") {
			if (args.length > 2) {
				// Assume team...
				let groupToAdd = [];
				for (let i = 1; i < args.length; i++) {
					groupToAdd.push(args[i]);
				}
				let leader = groupToAdd[0];
				groupToAdd.shift();
				database.groups.teams.push({"leader": leader, rest:groupToAdd, added: new Date().toString()});
				Storage.exportDatabase('writing');
				return this.say("Added team to groups with " + args[1] + " as the leader.");
			} else {
				database.groups.singles.push({name:args[1], added: new Date().toString()});
				Storage.exportDatabase('writing');
				return this.say("Added " + args[1] + " to Singles group.");
			}
		} else if (args[0] === "remove") {
			if (args.length > 2) {
				if (args[1] === "team") {
					let search = Tools.toId(args[2]);
					for (let i = 0; i < database.groups.teams.length; i++) {
						if (search === Tools.toId(database.groups.teams[i].leader)) {
							database.groups.teams.splice(i, 1);
							Storage.exportDatabase('writing');
							return this.say("Removed Team with leader: " + search);
						}
					}
					return this.say("Cannot find team. Are you sure you're searching for the team leader's name?");
				} else {
					return this.say("When removing a whole team, please only specify the team's leader. Usage: " + Config.commandCharacter + "groups remove, team, [leader's name]");
				}
			} else {
				let search = Tools.toId(args[1]);
				for (let i = 0; i < database.groups.singles.length; i++) {
					if (search === Tools.toId(database.groups.singles[i].name)) {
						database.groups.singles.splice(i, 1);
						Storage.exportDatabase('writing');
						return this.say("Removed " + search + " from groups.");
					}
				}
				return this.say("Cannot find user " + search + ". Are you sure you're spelling their name correctly?");
			}
		} else if (args[0] === "clear") {
			if (args[1] === "singles") {
				database.groups.singles = [];
				Storage.exportDatabase('writing');
				return this.say("Cleared Singles");
			} else if (args[1] === "teams") {
				database.groups.teams = [];
				Storage.exportDatabase('writing');
				return this.say("Cleared Teams");
			} else if (args[1] === "all") {
				database.groups.singles = [];
				database.groups.teams = [];
				Storage.exportDatabase('writing');
				return this.say("Cleared ALL Users");
			}
		}
	},
	database: 'myth',
	db: 'myth',
	myth: function (target, room, user) {
		if (!target) return this.say("Error: Not enough arguments. Please use ``;myth help`` for usage instructions.");
		let targets = target.split(', ');
		if (targets[0] === "add") {
			if (room instanceof Users.User || !user.hasRank(room, '+')) return false;
			if (targets.length - 1 < 3) return this.say("Error: Not enough arguments. Please use ``;myth help`` for usage instructions.");
			let name = Tools.toId(targets[1]);
			let pan = Tools.toId(targets[2]);
			let desc = targets.slice(3, targets.length).join(', ');
			for (let i = 0; i < database.myths.db.length; i++) {
				if (name === Tools.toId(database.myths.db[i].name) && pan === Tools.toId(database.myths.db[i].pan)) {
					return this.say("Error: An entry already exists using that name and pantheon. Are you sure they're not already in the database?");
				}
			}
			let input = {
				id: null,
				name: targets[1],
				pan: toTitleCase(targets[2]),
				desc: desc,
				img: "https://s13.postimg.org/xo2obg0h3/no_thumb.png",
				user: user.name,
				added: new Date().toString(),
			};
			database.myths.pending = input;
			Storage.exportDatabase('writing');
			return this.say("To confirm addition of ``" + input.name + "`` under pantheon ``" + input.pan + "``, type ``;myth confirm, add``.");
		} else if (targets[0] === "confirm") {
			if (room instanceof Users.User || !user.hasRank(room, '%')) return false;
			if (!targets[1]) return this.say("Please specify afterwards whether or not you want to ``add`` or ``delete`` something.");
			if (targets[1] === "add" && database.myths.pending !== null) {
				database.myths.pending.id = database.myths.lastID + 1;
				database.myths.db.push(database.myths.pending);
				database.myths.lastID++;
				this.say("Addition confirmed! Thank you, " + database.myths.pending.user + "!");
				database.myths.pending = null;
				Storage.exportDatabase('writing');
			} else if (targets[1] === "delete" && database.myths.pendingDelete !== -1) {
				database.myths.db.splice(database.myths.pendingDelete, 1);
				for (let i = database.myths.pendingDelete; i < database.myths.db.length; i++) {
					database.myths.db[i].id = i;
					database.myths.lastID = i;
				}
				database.myths.pendingDelete = -1;
				Storage.exportDatabase('writing');
				return this.say("Deletion confirmed! Entry no-longer exists.");
			} else {
				this.say("There's nothing there to confirm. :v");
			}
		} else if (targets[0] === "addimage") {
			if (room instanceof Users.User || !user.hasRank(room, '+')) return false;
			if (targets.length > 3) return this.say("Please only specify a myth index number and an image.");
			if (targets.length < 3) return this.say("Please specify both a myth index number and an image.");
			if (isNaN(Number(targets[1]))) return this.say("That was not an index number. Please use the number that's stated in the entry for the thing you're trying to edit.");
			let pattern = /((http|https|ftp):\/\/)[^\s]/;
			if (!pattern.test(targets[2])) {
				return this.say("Please enter a valid URL.");
			}
			for (let i = 0; i < database.myths.db.length; i++) {
				if (targets[1] === database.myths.db[i].id) {
					database.myths.db[i].img = targets[2];
					Storage.exportDatabase('writing');
					return this.say("Done! Image added to " + database.myths.db[i].name + "!");
				}
			}
			return this.say("Entry not found. Are you sure you're using the right myth index number?");
		} else if (targets[0] === "remove" || targets[0] === "delete") {
			if (room instanceof Users.User || !user.hasRank(room, '%')) return false;
			if (isNaN(Number(targets[1]))) return this.say("That was not an index number. Please use the number that's stated in the entry for the thing you're trying to edit.");
			for (let i = 0; i < database.myths.db.length; i++) {
				if (database.myths.db[i].id === targets[1]) {
					database.myths.pendingDelete = Number(targets[1]);
					Storage.exportDatabase('writing');
					return this.say("Myth found under name '" + database.myths.db[i].name + "' and pantheon '" + database.myths.db[i].pan + "'. If this is correct, please use ``;myth confirm, delete``.");
				}
			}
			return this.say("Entry not found. Are you sure you're using the right myth index number?");
		} else if (targets[0] === "view" || targets[0] === "show" || targets[0] === "see" || targets[0] === "search") {
			if (targets.length < 2) return this.say("Error: Not enough arguments. Please use ``;myth help`` for usage instructions.");
			if (targets.length > 2) return this.say("Error: Too many arguments. Please only search for one thing at a time. Thanks!");
			let targetNumber = parseInt(targets[1]);
			if (!isNaN(targetNumber)) {
				if (targetNumber > database.myths.db.length || targetNumber < 0) return this.say("That number entry doesn't exist!");
				for (let i = 0; i < database.myths.db.length; i++) {
					if (targetNumber === database.myths.db[i].id) {
						// Requires * rank.
						let myth = database.myths.db[i];
						return this.sayHtml('<div style="background: "><img src="' + myth.img + '" alt="' + myth.img + '" height="84" width="84" style="float: left; border: 1px solid gray;"><div style="height: 85px; text-align: left; border-bottom: 2px solid gray"><br /><span style="padding-left: 10px; font-weight: bold; font-size: 2em; font-family: Century Gothic, sans-serif">' + myth.name + '</span><br /><span style="padding-left: 10px; font-style: italic; color: grey; font-family: Century Gothic, sans-serif">' + myth.pan + '</span><br/></div><span style="padding-left: 95px; font-weight: bold; font-family: Century Gothic, sans-serif"><center>' + myth.desc + '</center></span><br /><span style="float: right; color: #888; font-size: 8pt;">Entry ID: ' + myth.id + '<br />Added by ' + myth.user + '.</span></div><br /><br />');
					}
				}
				return this.say("Cannot find entry.");
			} else {
				let term = Tools.toId(targets[1]);
				let nameFound = [];
				for (let i = 0; i < database.myths.db.length; i++) {
					if (term === Tools.toId(database.myths.db[i].name)) {
						nameFound.push([database.myths.db[i].name, database.myths.db[i].pan, database.myths.db[i].id]);
					}
				}
				if (nameFound.length > 0) {
					let panArray = [];
					let idArray = [];
					for (let i = 0; i < nameFound.length; i++) {
						panArray.push(nameFound[i][1]);
						idArray.push(nameFound[i][2]);
					}
					this.say("We found " + nameFound.length + " result(s) for '" + targets[1] + "', under pantheon(s) [``" + panArray.join(', ') + "``]!");
					return this.say("ID(s): ``" + idArray.join(', ') + "``. Use these IDs to view the specific entry (e.g. ``view 0``.");
				}
				return this.say("No results found for search '" + targets[1] + "'.");
			}
		} else if (targets[0] === "list") {
			let output = [];
			for (let i = 0; i < database.myths.db.length; i++) {
				output.push(database.myths.db[i].pan + "|SORTBREAK|" + database.myths.db[i].name + " [ID: " + database.myths.db[i].id + "]" + "\nPantheon: " + database.myths.db[i].pan + "\nDescription: " + database.myths.db[i].desc + "\n(added by " + database.myths.db[i].user + ")\n\n");
			}
			// We sort the output alphabetically by Pantheon.
			output.sort();
			for (let i = 0; i < output.length; i++) {
				//@ts-ignore
				output[i] = output[i].split("|SORTBREAK|").pop();
			}
			return Tools.uploadToHastebin('Myths & Magic Database\n\n\n' + output.join(''), /**@param {string} link*/ link => {
				if (link.startsWith('Error')) return this.say(link);
				this.say('Full Database: ' + link);
			});
		} else if (targets[0] === "help") {
			//Help function.
			return this.say("Database command information can be found here: https://github.com/AxeBane/The-Scribe-old/blob/master/README.md#database-commands");
		} else {
			return this.say("Unknown parameter(s). You might be missing a comma somewhere!");
		}
	},
};

exports.commands = commands;
