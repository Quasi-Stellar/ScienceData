/**
 * Config (example)
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * Copy this file to 'config.js' before starting Cassius.
 *
 * @license MIT license
 */

'use strict';
// The username and password that ScienceData will use to login
exports.username = 'ScienceData';
// if the username is unregistered, this process will most likely not work, so please provide a password to a registerd user
exports.password = '';

// The server address to which ScienceData will connect. Leave this empty to connect to the PS main server.
exports.server = '';

// The avatar that ScienceData will use
exports.avatar = '120';

// A guide for commands and features
exports.guide = 'https://github.com/Aurolux/Science-Data/blob/master/README.md';

// Rooms that ScienceData will attempt to join after logging in
// example: exports.rooms = ['room1', 'room2', 'room3'];
/**@type {Array<string>} */
exports.rooms = [''];

// Rooms where scripted games are enabled
/**@type {Array<string>} */
exports.games = [''];

// Rooms where scripted tournaments are enabled
/**@type {Array<string>} */
exports.tournaments = [''];

// The default cap to use for scripted tournaments
exports.defaultTournamentCap = 0;


// The character that determines which messages are read as commands
exports.commandCharacter = '.';

// Symbols and rankings for the server's user groups
exports.groups = {
	'\u203d': 0,
	'!': 0,
	' ': 0,
	'+': 1,
	'%': 2,
	'@': 3,
	'*': 3,
	'#': 4,
	'&': 5,
	'~': 6,
};

// Words that are either filtered or auto-locked by the server
/**@type {Array<string>} */
exports.bannedWords = [];

// Userids of those who have debug access to ScienceData
// example: exports.developers = ['devuser1', 'devuser2', 'devuser3'];
/**@type {Array<string>} */
exports.developers = [''];

// Custom functions
/**@type {?Function} */
exports.parseMessage = null;
/**@type {?Function} */
exports.moderate = null;

/**@type {boolean | {[k: string]: boolean}} */
exports.allowModeration = true;

let punishmentPoints = {
	'verbalwarn': 0,
	'warn': 1,
	'mute': 2,
	'hourmute': 3,
	'roomban': 4,
};

let punishmentActions = {};
for (let i in punishmentPoints) {
	punishmentActions['' + punishmentPoints[i]] = i;
}

exports.punishmentPoints = punishmentPoints;
exports.punishmentActions = punishmentActions;

// Reasons used when ScienceData punishes a user for
// flooding, stretching, caps, etc.
// example: punishmentReasons = {'flooding': 'please do not flood the chat'}

/**@type {?{[k: string]: string}} */
exports.punishmentReasons = null;

exports.allowMail = true;
