/**
 * Hangman database
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * Simple hangman database that allows for adding/deleting hangman words and hints,
 * as well as uploading the contents of the database to a hastebin for room staff.
 *
 * This is a port of Kid A's hangman system, coded by bumbadadabum.
 *
 * @author Mystifi
 * @license MIT
 */

'use strict';

// These are the valid ranks that a Room Owner can set when
// modifying the permissions.
const validRanks = ['+', '%', '@', '#'];

/**
 * @param {Room | string} room
 * @return {AnyObject}
 */
function getDatabase(room) {
	if (room instanceof Rooms.Room) room = room.id;
	let database = Storage.getDatabase(room);
	if (!database.hangman) database.hangman = {};
	if (!database.defaultRanks) {
		database.defaultRanks = {};
		database.defaultRanks.hangman = '%';
	}
	return database;
}

/**
 * Returns the proper id for a room, which can contain hyphens (thanks, Zarel,
 * for making groupchats SO special).
 * @param {string} string
 * @return {string}
 */
function toRoomid(string) {
	return string.toLowerCase().replace(/[^a-z0-9-]+/g, '');
}

/**@type {{[k: string]: Command | string}} */
const commands = {
	hangmanrank: 'sethangmanrank',
	sethangmanrank(target, room, user) {
		if (room instanceof Users.User || !user.hasRank(room, '#')) return;
		let database = getDatabase(room.id);
		target = target.trim();
		if (!target) return this.say("Users of rank " + database.defaultRanks.hangman + " and higher can manage the room's hangman database.");
		if (!validRanks.includes(target)) return this.say("Unknown option. Valid ranks: " + validRanks.join(", "));
		database.defaultRanks.hangman = target;
		Storage.exportDatabase(room.id);
		this.say("Users of rank " + target + " and above can now manage the room's hangman database.");
	},

	addhangman(target, room, user) {
		if (!(room instanceof Users.User)) return;
		let split = target.split(',');
		if (split.length < 4) return this.say("Please use the following format: .addhangman room, category, solution, hint");
		let roomid = toRoomid(split.shift());
		if (!roomid) return this.say("Invalid room name.");
		let targetRoom = Rooms.get(roomid);
		if (!targetRoom) return this.say("For various reasons, please specify a room that I'm currently in.");
		let database = getDatabase(targetRoom.id);
		if (!user.hasRank(targetRoom, database.defaultRanks.hangman)) return;
		let category = Tools.toId(split[0]);
		if (!category) return this.say("Please enter a valid category name.");
		let solution = split[1];
		// Copied from the hangman code from PS!:
		// https://github.com/Zarel/Pokemon-Showdown/blob/master/chat-plugins/hangman.js
		solution = solution.replace(/[^A-Za-z '-]/g, '').trim();
		if (solution.replace(/ /g, '').length < 1) return this.say("Please enter a valid word.");
		if (solution.length > 30) return this.say("The solution must be 30 characters or less.");
		if (solution.split(' ').some(w => w.length > 20)) {
			return this.say("Each word in the solution must be 20 characters or less.");
		}
		if (!/[a-zA-Z]/.test(solution)) return this.say("Your word must contain at least one letter.");
		// TODO: Add code for verifying whether or not the user wants to overwrite the word instead of telling them to delete it
		// first.
		solution = solution.split(' ').map((w, i) => {
			if (["a", "an", "the", "of"].includes(w) && i !== 0) {
				return w.toLowerCase();
			} else {
				return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
			}
		}).join(' ');
		let solutionId = Tools.toId(solution);
		if (!(category in database.hangman)) database.hangman[category] = {};
		let categoryWords = database.hangman[category];
		if (solutionId in categoryWords) return this.say("Your word already exists in the database under that category. Please delete the existing solution and reuse this command.");
		let hint = split.slice(2).join(',').trim();
		if (hint.length > 150) return this.say("Your hint cannot exceed 150 characters. (" + hint.length + "/150)");
		categoryWords[solutionId] = {hint: hint, solutionName: solution, addedBy: user.name};
		Storage.exportDatabase(targetRoom.id);
		this.say("Your word has been successfully added.");
	},

	deletehangman(target, room, user) {
		if (!(room instanceof Users.User)) return;
		let split = target.split(',');
		if (split.length < 3) return this.say("Please use the following format: .deletehangman room, category, solution");
		let roomid = toRoomid(split.shift());
		if (!roomid) return this.say("Invalid room name.");
		let targetRoom = Rooms.get(roomid);
		if (!targetRoom) return this.say("For various reasons, please specify a room that I'm currently in.");
		let database = getDatabase(targetRoom.id);
		if (!user.hasRank(targetRoom, database.defaultRanks.hangman)) return;
		let category = Tools.toId(split[0]);
		if (!(category && category in database.hangman)) return this.say("Please enter a valid category name.");
		let categoryWords = database.hangman[category];
		let solution = Tools.toId(split[1]);
		if (!(solution in categoryWords)) return this.say("That solution doesn't exist.");
		delete categoryWords[solution];
		if (!Object.keys(categoryWords).length) {
			delete database.hangman[category];
		}
		Storage.exportDatabase(targetRoom.id);
		this.say("That word has been successfully deleted.");
	},

	hangman(target, room, user) {
		if (room instanceof Users.User) return;
		let database = getDatabase(room.id);
		if (!user.hasRank(room, database.defaultRanks.hangman)) return;
		let hangmanWords = database.hangman;
		target = Tools.toId(target);
		let randomCategory = target ? (target !== 'random' ? target : Tools.sampleOne(Object.keys(hangmanWords))) : Tools.sampleOne(Object.keys(hangmanWords));
		if (target && target !== 'random' && !(randomCategory in hangmanWords)) return this.say("Please specify a valid category.");
		let category = hangmanWords[randomCategory];
		let randomSolution = Tools.sampleOne(Object.keys(category));
		let data = category[randomSolution];
		this.say("/hangman new " + data.solutionName + ", " + data.hint);
		this.say("/wall Use ``/guess [word] or [letter]`` to guess.")
	},

	viewhangman(target, room, user) {
		if (room instanceof Users.User) return;
		let database = getDatabase(room.id);
		if (!user.hasRank(room, database.defaultRanks.hangman)) return;
		let prettifiedWords = "Hangman words for " + room.id + ":\n\n";
		let hangmanWords = database.hangman;
		for (let category in hangmanWords) {
			prettifiedWords += category + "\n";
			let categoryData = hangmanWords[category];
			for (let solution in categoryData) {
				let data = categoryData[solution];
				prettifiedWords += data.solutionName + " (HINT: " + data.hint + ") (added by: " + data.addedBy + ")\n";
			}
			prettifiedWords += "\n";
		}
		prettifiedWords += "(DON'T LEAK THIS TO REGULAR USERS)";
		Tools.uploadToHastebin(prettifiedWords, /**@type {string} */ hastebinUrl => {
			this.pm(user, "Hangman words for " + room.id + ": " + hastebinUrl);
		});
	},
};

module.exports = {commands};
