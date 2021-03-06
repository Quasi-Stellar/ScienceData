/**
 * Trivia game
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * @license MIT license
 */

'use strict';

const name = "Trivia";

const data = {
	"Elements": {},
	"Sciences": {}
};
for (let i in Tools.data.sciences) {
	let science = Tools.data.sciences[i]
	if (!science.name) continue;
	let desc = science.desc || science.shortDesc;
	if (!desc) continue;
	if (!(desc in data["Sciences"])) data["Sciences"][desc] = [];
	data["Sciences"][desc].push(science.name);
}

for (let i in Tools.data.elements) {
	let element = Tools.data.elements[i]
	if (!element.name) continue;
	let desc = element.desc || element.shortDesc;
	if (!desc) continue;
	if (!(desc in data["Elements"])) data["Elements"][desc] = [];
	data["Elements"][desc].push(element.name);
}
// This game is basically a bunch of other minigames mashed together
// if inheriting from or inherited by another game, this class would be declared as:
// let Trivia = base => class extends base {
class Trivia extends Games.Game {
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
			this.timeout = setTimeout(() => this.nextRound(), 20 * 1000);
		});
		this.say(this.hint);
	}
}

exports.name = name;
exports.id = Tools.toId(name);
exports.description = "Players guess answers based on the given descriptions!";
exports.commands = {
	// command: game function
	// alias: command
	"guess": "guess",
	"g": "guess",
};
exports.aliases = ['triv'];
exports.variations = [
	{
		name: "Move Trivia",
		aliases: ['Moves Trivia'],
		variation: "Pokemon Moves",
		variationAliases: ['moves'],
	},
	{
		name: "Item Trivia",
		aliases: ['Items Trivia'],
		variation: "Pokemon Items",
		variationAliases: ['items'],
	},
	{
		name: "Ability Trivia",
		aliases: ['Abilities Trivia'],
		variation: "Pokemon Abilities",
		variationAliases: ['abilities'],
	},
];
exports.modes = ["Survival", "Team"];
// if inheriting from or inherited by another game, this game would be exported as:
// exports.install = Trivia;
exports.game = Trivia;

/**
 * @param {Trivia} game
 */
exports.spawnMochaTests = function (game) {
	// you can skip tests for variations or modes by checking "game.variationId" or "game.modeId" here
	if (game.modeId) return;

	const assert = require('assert');

	let tests = {
		/**
		 * @param {Trivia} game
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
