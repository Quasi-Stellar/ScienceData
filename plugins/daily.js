/**
 * Science commands
 * Cassius - https://github.com/sirDonovan/Cassius
 * @author Aurolux
 * @license MIT license
 */

'use strict';

const database = Storage.getDatabase('science');
const MESSAGES_TIME_OUT = 7 * 24 * 60 * 60 * 1000;
let commands = {
// Of the Day commands
	// Scientist of the Day
	'scientist': 'sotd',
	sotd: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		if (!target) {
			if (!database.sotd) return this.say(text + "No Scientist of the Day has been set.");
			let tem = new Date(database.sotd.time).toLocaleString('en-US', {hour: 'numeric', minute:'numeric', day:'2-digit', month:'long', hour12: true, timeZoneName: 'short'});
			let box = '<div style="font-family: Georgia, serif ; max-width: 550px ; margin: auto ; padding: 8px 8px 12px 8px; text-align: left; background: rgba(250, 250, 250, 0.8)"> <span style="display: block ; font-family: Verdana, Geneva, sans-serif ; font-size: 16pt ; font-weight: bold ; background: green ; padding: 3px 0 ; text-align: center ; border-radius: 2px ; color: rgba(255 , 255 , 255 , 1) ; margin-bottom: 0px"> <i class="fa fa-flask"></i> Scientist of the Day <i class="fa fa-flask"></i> </span><table style="padding-top: 0px;"> <tr> <td style="padding-left:8px; vertical-align:baseline;"> <div style="font-size: 22pt ; margin-top: 5px; color: black;">' + database.sotd.title + '</div> <span style="font-family:sans-serif;font-size:12pt;display:block;color:rgba(0,0,0,0.7);letter-spacing:0px;">' + database.sotd.lifetime + ' - <strong style="letter-spacing:0;">' + database.sotd.profession + '</strong></span><span style="font-size:10pt;font-family:sans-serif;margin-top:10px;display:block;color:rgba(0,0,0,0.8)"><strong style="font-family:serif;margin-right:10px;color:rgba(0,0,0,0.5)"></strong>' + database.sotd.description + '</span></td></tr></table></div>';
			let boxpm = '<div style="font-family: Georgia, serif ; max-width: 550px ; margin: auto ; padding: 8px 8px 12px 8px; text-align: left; background: rgba(250, 250, 250, 0.8)"> <span style="display: block ; font-family: Verdana, Geneva, sans-serif ; font-size: 16pt ; font-weight: bold ; background: green ; padding: 3px 0 ; text-align: center ; border-radius: 2px ; color: rgba(255 , 255 , 255 , 1) ; margin-bottom: 0px"> <i class="fa fa-flask"></i> Scientist of the Day <i class="fa fa-flask"></i> </span><table style="padding-top: 0px;"> <tr> <td style="padding-left:8px; vertical-align:baseline;"> <div style="font-size: 22pt ; margin-top: 5px; color: black;">' + database.sotd.title + '</div> <span style="font-family:sans-serif;font-size:12pt;display:block;color:rgba(0,0,0,0.7);letter-spacing:0px;">' + database.sotd.lifetime + ' - <strong style="letter-spacing:0;">' + database.sotd.profession + '</strong></span><span style="font-size:10pt;font-family:sans-serif;margin-top:10px;display:block;color:rgba(0,0,0,0.8)"><strong style="font-family:serif;margin-right:10px;color:rgba(0,0,0,0.5)"></strong>' + database.sotd.description + '</span></td></tr></table></div>';
			if (!(room instanceof Users.User) && user.hasRank(room, '+')) {
				return this.sayHtml(box);
			} else {
				// The below is a hacky way to get pminfobox to work within PM. It defaults to Writing since AxeBot/The Scribe is always * in that room. For personal bots, this should be changed to any room that you can guarentee the bot has at least * permissions.
				if (!(room instanceof Users.User) && Users.self.rooms.get(room) === '*') {
					return this.pmHtml(user, boxpm);
				} else {
					return this.say(text + "Today's Scientist of the Day is **" + database.sotd.title + "**:" + "__" + database.sotd.lifetime + "__" + " - " + database.sotd.profession) + database.sotd.description;
				}
			}
		}
		if (Tools.toId(target) === 'check' || Tools.toId(target) === 'time') {
			if (!database.sotd) return this.say(text + "There is no Scientist of the Day to check!");
			return this.say(text + "The Scientist of the Day was last updated to **" + database.sotd.title + "** " + Tools.toDurationString(Date.now() - database.sotd.time) + " ago by " + database.sotd.user);
		}
		let targets = target.split('|');
		let typo = false;
		if (targets[0] === "typo") {
			if (!database.sotd) return this.say(text + "There is no Scientist of the Day to correct!");
			if ((room instanceof Users.User || !user.hasRank(room, '%')) && user.name !== database.sotd.user) return this.say(text + "Sorry, you must be the original user or driver and above to make typo corrections.");
			typo = true;
			targets.shift();
		}
		if (database.sotd) {
			if (!typo && Date.now() - database.sotd.time < 61200000) return this.say(text + "Sorry, but at least 17 hours must have passed since the SOTD was last set in order to set it again!");
		}
		let hasPerms = false;
		if (database.scribeShop) {
			if (typo || (!(room instanceof Users.User) && user.hasRank(room, '+'))) {
				hasPerms = true;
			} 
		} else if (!(room instanceof Users.User) && user.hasRank(room, '+')) {
			hasPerms = true;
		}
		if (!hasPerms) return this.say(text + 'You must be at least Voice or higher to set the Scientist of the Day.');
		if (targets.length < 4) return this.say(text + "Invalid arguments specified. The format is: __title__ | __birth-death__ | __profession__ | __description__.");
		let sotd = {
			title: targets[0].trim(),
			lifetime: targets [1],
			profession: targets [2],
			description: targets[3].trim(),
		};
		if (!typo) {
			sotd.time = Date.now();
			sotd.user = user.name;
		} else {
			sotd.time = database.sotd.time;
			sotd.user = database.sotd.user;
		}
		if (!database.sotdScientist) {
			database.sotdScientist = [];
		}
		database.sotd = sotd;
		database.sotdScientist.push(sotd);
		Storage.exportDatabase('science');
		this.say(text + "The Scientist of the Day has been set to '" + targets[0] + "'!");
		this.say("/modnote The Scientist of the Day was set to " + database.sotd.title + " by " + database.sotd.user + ".");
		},
	// Fact of the Day
	'fact': 'fotd',
	fotd: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		if (!target) {
			if (!database.fotd) return this.say(text + "No fact of the Day has been set.");
			let tem = new Date(database.fotd.time).toLocaleString('en-US', {hour: 'numeric', minute:'numeric', day:'2-digit', month:'long', hour12: true, timeZoneName: 'short'});
			let box = '<div style="font-family: Georgia, serif ; max-width: 550px ; margin: auto ; padding: 8px 8px 12px 8px; text-align: left; background: rgba(250, 250, 250, 0.8)"> <span style="display: block ; font-family: Verdana, Geneva, sans-serif ; font-size: 16pt ; font-weight: bold ; background: #e27a0b ; padding: 3px 0 ; text-align: center ; border-radius: 2px ; color: rgba(255 , 255 , 255 , 1) ; margin-bottom: 0px"> <i class="fa fa-thermometer-1"></i> Fact of the Day <i class = "fa fa-thermometer-1"></i> </span><table style="padding-top: 0px;"> <tr> <td style="padding-left:8px; vertical-align:baseline;"> <div style="font-size: 22pt ; margin-top: 5px; color: black;">' + database.fotd.fact + '</div><span style="font-family:sans-serif;font-size:12pt;display:block;color:rgba(0,0,0,0.7);letter-spacing:0px;"><b>Field of Science:</b> <span style="letter-spacing:0;">' + database.fotd.type + '</span></span> <span style="font-size:10pt;font-family:sans-serif;margin-top:10px;display:block;color:rgba(0,0,0,0.8)"><strong style="font-family:serif;margin-right:10px;color:rgba(0,0,0,0.5)"></strong>' + database.fotd.description + '</span></td></tr></table></div>';
			let boxpm = '<div style="font-family: Georgia, serif ; max-width: 550px ; margin: auto ; padding: 8px 8px 12px 8px; text-align: left; background: rgba(250, 250, 250, 0.8)"> <span style="display: block ; font-family: Verdana, Geneva, sans-serif ; font-size: 16pt ; font-weight: bold ; background: #e27a0b ; padding: 3px 0 ; text-align: center ; border-radius: 2px ; color: rgba(255 , 255 , 255 , 1) ; margin-bottom: 0px"> <i class="fa fa-thermometer-1"></i> Fact of the Day <i class = "fa fa-thermometer-1"></i> </span><table style="padding-top: 0px;"> <tr> <td style="padding-left:8px; vertical-align:baseline;"> <div style="font-size: 22pt ; margin-top: 5px; color: black;">' + database.fotd.fact + '</div><span style="font-family:sans-serif;font-size:12pt;display:block;color:rgba(0,0,0,0.7);letter-spacing:0px;"><b>Field of Science:</b> <span style="letter-spacing:0;">' + database.fotd.type + '</span></span> <span style="font-size:10pt;font-family:sans-serif;margin-top:10px;display:block;color:rgba(0,0,0,0.8)"><strong style="font-family:serif;margin-right:10px;color:rgba(0,0,0,0.5)"></strong>' + database.fotd.description + '</span></td></tr></table></div>';
			if (!(room instanceof Users.User) && user.hasRank(room, '+')) {
				return this.sayHtml(box);
			} else {
				// The below is a hacky way to get pminfobox to work within PM. It defaults to Writing since AxeBot/The Scribe is always * in that room. For personal bots, this should be changed to any room that you can guarentee the bot has at least * permissions.
				if (!(room instanceof Users.User) && Users.self.rooms.get(room) === '*') {
					return this.pmHtml(user, boxpm);
				} else {
					return this.say(text + "Today's Fact of the Day is **" + database.fotd.fact + "**:" + database.fotd.description);
				}
			}
		}
		if (Tools.toId(target) === 'check' || Tools.toId(target) === 'time') {
			if (!database.fotd) return this.say(text + "There is no Fact of the Day to check!");
			return this.say(text + "The Fact of the Day was last updated to **" + database.fotd.fact + "** " + Tools.toDurationString(Date.now() - database.fotd.time) + " ago by " + database.fotd.user);
		}
		let targets = target.split('|');
		let typo = false;
		if (targets[0] === "typo") {
			if (!database.fotd) return this.say(text + "There is no Fact of the Day to correct!");
			if ((room instanceof Users.User || !user.hasRank(room, '%')) && user.name !== database.fotd.user) return this.say(text + "Sorry, you must be the original user or driver and above to make typo corrections.");
			typo = true;
			targets.shift();
		}
		if (database.fotd) {
			if (!typo && Date.now() - database.fotd.time < 61200000) return this.say(text + "Sorry, but at least 17 hours must have passed since the FOTD was last set in order to set it again!");
		}
		let hasPerms = false;
		if (database.scribeShop) {
			if (typo || (!(room instanceof Users.User) && user.hasRank(room, '+'))) {
				hasPerms = true;
			} 
		} else if (!(room instanceof Users.User) && user.hasRank(room, '+')) {
			hasPerms = true;
		}
		if (!hasPerms) return this.say(text + 'You must be at least Voice or higher to set the Fact of the Day.');
		if (targets.length < 3) return this.say(text + "Invalid arguments specified. The format is: __fact__ | __field of science__ | __description__.");
		let fotd = {
			fact: targets[0].trim(),
			type: targets[1],
			description: targets[2].trim(),
		};
		if (!typo) {
			fotd.time = Date.now();
			fotd.user = user.name;	
		} else {
			fotd.time = database.fotd.time;
			fotd.user = database.fotd.user;
		}
		if (!database.fotdFact) {
			database.fotdFact = [];
		}
		database.fotd = fotd;
		database.fotdFact.push(fotd);
		Storage.exportDatabase('science');
		this.say(text + "The Fact of the Day has been set to '" + targets[0] + "'!");
		this.say("/modnote The Fact of the Day was set to " + database.fotd.fact + " by " + database.fotd.user + ".");
		},

	// Star of the Day
	'star': 'stotd',
	stotd: function (target, room, user) {
		let text = room instanceof Users.User || user.hasRank(room, '+') ? '' : '/pm ' + user.name + ', ';
		if (!target) {
			if (!database.stotd) return this.say(text + "No Star of the Day has been set.");
			let tem = new Date(database.stotd.time).toLocaleString('en-US', {hour: 'numeric', minute:'numeric', day:'2-digit', month:'long', hour12: true, timeZoneName: 'short'});
			let box = '<div style="font-family: Georgia, serif ; max-width: 550px ; margin: auto ; padding: 8px 8px 12px 8px; text-align: left; background: rgba(250, 250, 250, 0.8)"> <span style="display: block ; font-family: Verdana, Geneva, sans-serif ; font-size: 16pt ; font-weight: bold ; background: #5b24ad ; padding: 3px 0 ; text-align: center ; border-radius: 2px ; color: rgba(255 , 255 , 255 , 1) ; margin-bottom: 0px"> <i class="fa fa-star"></i> Star of the Day <i class="fa fa-star"></i> </span><table style="padding-top: 0px;"> <tr> <td style="padding-left:8px; vertical-align:baseline;"> <div style="font-size: 22pt ; margin-top: 5px; color: black;">' + database.stotd.title + '</div><span style="font-family:sans-serif;font-size:12pt;display:block;color:rgba(0,0,0,0.7);letter-spacing:0px;"><b>Type:</b> <span style="letter-spacing:0;">' + database.stotd.type + '</span></span> <span style="font-size:10pt;font-family:sans-serif;margin-top:10px;display:block;color:rgba(0,0,0,0.8)"><strong style="font-family:serif;margin-right:10px;color:rgba(0,0,0,0.5)"></strong>' + database.stotd.description + '</span></td></tr></table></div>';
			let boxpm = '<div style="font-family: Georgia, serif ; max-width: 550px ; margin: auto ; padding: 8px 8px 12px 8px; text-align: left; background: rgba(250, 250, 250, 0.8)"> <span style="display: block ; font-family: Verdana, Geneva, sans-serif ; font-size: 16pt ; font-weight: bold ; background: #5b24ad ; padding: 3px 0 ; text-align: center ; border-radius: 2px ; color: rgba(255 , 255 , 255 , 1) ; margin-bottom: 0px"> <i class="fa fa-star"></i> Star of the Day <i class="fa fa-star"></i> </span><table style="padding-top: 0px;"> <tr> <td style="padding-left:8px; vertical-align:baseline;"> <div style="font-size: 22pt ; margin-top: 5px; color: black;">' + database.stotd.title + '</div><span style="font-family:sans-serif;font-size:12pt;display:block;color:rgba(0,0,0,0.7);letter-spacing:0px;"><b>Type:</b> <span style="letter-spacing:0;">' + database.stotd.type + '</span></span> <span style="font-size:10pt;font-family:sans-serif;margin-top:10px;display:block;color:rgba(0,0,0,0.8)"><strong style="font-family:serif;margin-right:10px;color:rgba(0,0,0,0.5)"></strong>' + database.stotd.description + '</span></td></tr></table></div>';
			if (!(room instanceof Users.User) && user.hasRank(room, '+')) {
				return this.sayHtml(box);
			} else {
				// The below is a hacky way to get pminfobox to work within PM. It defaults to Writing since AxeBot/The Scribe is always * in that room. For personal bots, this should be changed to any room that you can guarentee the bot has at least * permissions.
				if (!(room instanceof Users.User) && Users.self.rooms.get(room) === '*') {
					return this.pmHtml(user, boxpm);
				} else {
					return this.say(text + "Today's Star of the Day is **" + database.stotd.title + "**:" + database.stotd.description);
				}
			}
		}
		if (Tools.toId(target) === 'check' || Tools.toId(target) === 'time') {
			if (!database.stotd) return this.say(text + "There is no Star of the Day to check!");
			return this.say(text + "The Star of the Day was last updated to **" + database.stotd.title + "** " + Tools.toDurationString(Date.now() - database.stotd.time) + " ago by " + database.stotd.user);
		}
		let targets = target.split('|');
		let typo = false;
		if (targets[0] === "typo") {
			if (!database.stotd) return this.say(text + "There is no Star of the Day to correct!");
			if ((room instanceof Users.User || !user.hasRank(room, '%')) && user.name !== database.stotd.user) return this.say(text + "Sorry, you must be the original user or driver and above to make typo corrections.");
			typo = true;
			targets.shift();
		}
		if (database.stotd) {
			if (!typo && Date.now() - database.stotd.time < 61200000) return this.say(text + "Sorry, but at least 17 hours must have passed since the STOTD was last set in order to set it again!");
		}
		let hasPerms = false;
		if (database.scribeShop) {
			if (typo || (!(room instanceof Users.User) && user.hasRank(room, '+'))) {
				hasPerms = true;
			} 
		} else if (!(room instanceof Users.User) && user.hasRank(room, '+')) {
			hasPerms = true;
		}
		if (!hasPerms) return this.say(text + 'You must be at least Voice or higher to set the Scientist of the Day.');
		if (targets.length < 2) return this.say(text + "Invalid arguments specified. The format is: __star__ | __star type__ | __description__ .");
		let stotd = {
			title: targets[0].trim(),
			type: targets[1],
			description: targets[2].trim(),
		};
		if (!typo) {
			stotd.time = Date.now();
			stotd.user = user.name;	
		} else {
			stotd.time = database.stotd.time;
			stotd.user = database.stotd.user;
		}
		if (!database.stotdStar) {
			database.stotdStar = [];
		}
		database.stotd = stotd;
		database.stotdStar.push(stotd);
		Storage.exportDatabase('science');
		this.say(text + "The Star of the Day has been set to '" + targets[0] + "'!");
		this.say("/modnote The Star of the Day was set to " + database.stotd.title + " by " + database.stotd.user + ".");
		},
};

exports.commands = commands;
