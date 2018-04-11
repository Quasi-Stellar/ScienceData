/**
 * Elements game
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * @license MIT license
 */

'use strict';
const name = "elements";
const elements = Storage.getDatabase('elements');
for (let i in Tools.data.elements) {
	let element = Tools.getExistingElement(i);
	if (!element.name) continue;
	let desc = element.desc || element.shortDesc;
	if (!desc) continue;
	if (!(desc in data["Elements"])) data["Elements"][desc] = [];
	data["Elements"][desc].push(element.name);
}

// if inheriting from or inherited by another game, this class would be declared as:
// let Trivia = base => class extends base {
let Trivia = base => class extends base {
	/**
	 * @param {Room} room
	 */
	constructor(room) {
		super(room);
		this.freeJoin = true;
		/**@type {Array<string>} */
		this.answers = [];
		/**@type {?NodeJS.Timer} */
		this.timeout = null;
		this.hint = '';
		this.points = new Map();
		this.maxPoints = 3;
		this.categories = Object.keys(data);
		this.questions = {};
		for (let i = 0, len = this.categories.length; i < len; i++) {
			this.questions[this.categories[i]] = Object.keys(data[this.categories[i]]);
		}
	}

	onSignups() {
		this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
	}

	setAnswers() {
		let category;
		if (this.variation) {
			category = this.variation;
		} else {
			category = Tools.sampleOne(this.categories);
		}
		let question = Tools.sampleOne(this.questions[category]);
		this.answers = data[category][question];
		this.hint = "**" + category + "**: " + question;
	}

	onNextRound() {
		if (this.answers.length) {
			this.say("Time's up! The answer" + (this.answers.length > 1 ? "s were" : " was") + " __" + this.answers.join(", ") + "__");
		}
		this.setAnswers();
		this.on(this.hint, () => {
			this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
		});
		this.say(this.hint);
	}
}

exports.name = name;
exports.id = Tools.toId(name);
exports.description = "Do you know the periodic table? ``.g [element]`` to find out!";
exports.commands = {
	// command: game function
	// alias: command
	"guess": "guess",
	"g": "guess",
};
exports.aliases = ['elements'];
exports.variations = [
	{
		name: "Element Trivia",
		aliases: ['Periodic Table'],
		variation: "Periodic Elements",
		variationAliases: ['elements'],
	},
];
exports.modes = ["Survival", "Team"];
// if inheriting from or inherited by another game, this game would be exported as:
// exports.install = Trivia;
exports.install = Trivia;

/**
 * @param {Elements} game
 */
exports.spawnMochaTests = function (game) {
	// you can skip tests for variations or modes by checking "game.variationId" or "game.modeId" here
	if (game.modeId) return;

	const assert = require('assert');

	let tests = {
		/**
		 * @param {Elements} game
		 */
		'guess': game => {
			game.signups();
			game.nextRound();
			MessageParser.parseCommand(Config.commandCharacter + 'guess ' + game.answers[0], game.room, Users.add("User 1"));
			assert(game.points.get(game.players['user1']) === 1);
		},
	};

	return tests;
};
