const { token } = require ("./config.json");
const extras = require ("./extras.json");
const ytdlInfo = require ("ytdl-getinfo");
const Discord = require ("discord.js");
const fs = require ("fs");
const { Console } = require("console");
const client = new Discord.Client ();

const waitTime = 10000;
var connection = {};
var queue = {};
var counter = 0;
var index = 0;
var loopState = 0;

client.once ("ready", () => {
	client.user.setActivity (`Use !help if you need me, you shitty admiral!`);
	console.log ("Ready!");
});

client.once ("reconnecting", () => {
	console.log ("Reconnecting!");
});
  
client.once ("disconnect", () => {
	console.log ("Disconnect!");
});

client.on ("message", message => {
	var prefixes = JSON.parse (fs.readFileSync ("./prefixes.json", "utf-8"));

	if (! prefixes [message.guild.id]) {
		setPrefix (prefixes ["default"], message);
	}

	var prefix = prefixes [message.guild.id];

	if (! message.content.startsWith (prefix) || message.author.bot) {
		return;
	}

	if (! queue [message.guild.id]) {
		queue [message.guild.id] = [];
	}

	const arguments = message.content.slice (prefix.length).trim ().split(/ +/);
	const command = arguments.shift ().toLowerCase ();

	if (command === "help") {
		if (! arguments.length) {
			message.channel.send (`Special-type destroyer number 18, 8th of the Ayanami-class, Akebono. My command prefix is **${prefix}**, but you already knew that, you shitty admiral! You can use **${prefix}help command_name** to find out how to use that command, you stupid admiral! My commands are:\n**${prefix}help\n${prefix}prefix\n${prefix}waifu\n${prefix}marry\n${prefix}list\n${prefix}8ball or ${prefix}aniball\n${prefix}play\n${prefix}search\n${prefix}info\n${prefix}move\n${prefix}swap\n${prefix}skip\n${prefix}remove\n${prefix}stop or ${prefix}leave\n${prefix}queue**\nI also have secret commands, not that I'll tell you what they are, you shitty admiral!\nIf you want to contact my shitty admiral to offer suggestions, report bugs, or offer waifu pictures, join my support server at https://discord.gg/hFQQEcZ, you equally shitty admiral! If you want to examine me, you can go to my GitHub at https://github.com/zuiun/akebot, you perverted admiral!`);
		} else {
			var query = `${prefix}${arguments [0]}`

			if (arguments [0] === "help") {
				message.channel.send (`Huh? Are you an idiot? **${query}** just tells you my commands! **Bolded phrases** are commands, <angular-bracketed arguments> are user-defined arguments>, while [square-bracketed arguments] are optional arguments, you stupid admiral!`);
			} else if (arguments [0] === "prefix") {
				message.channel.send (`You can't even use a prefix properly!? Ugh, then you'll have to set one with **${query} <prefix>**, you shitty admiral!`);
			} else if (arguments [0] === "waifu") {
				message.channel.send (`Why are you so interested in other girls, huh? If you're so needy, you can use **${query} <name>** to get a picture of your waifu, you perverted admiral! If you don't care who you get, you can use **${query} random**, you shitty admiral!`);
			} else if (arguments [0] === "marry") {
				message.channel.send (`Are you sure that the marriages you're making or ending with **${query} marry <name>** aren't forced marriages, you shitty admiral? You can see either your or someone else's (forced) marriage partners with **${query} view [mention_someone]** and interact with your (forced) marriage partners with **${query} fun <name>**, you perverted admiral!`);
			} else if (arguments [0] === "list") {
				message.channel.send (`How disgusting! Are you keeping a track of your waifus using **${query}**!? You perverted admiral!\nThis command sends a huge amount of text, so please don't overuse it, you shitty admiral!`);
			} else if (arguments [0] === "8ball" || arguments [0] === "aniball") {
				message.channel.send (`You really need your waifus to make your decisions for you using **${query}**? What a shitty admiral!`);
			} else if (arguments [0] === "play") {
				message.channel.send (`Your music is annoying! Why would anybody let you use **${query} <query>** to play music, huh!? You shitty admiral!`);
			} else if (arguments [0] === "search") {
				message.channel.send (`You can pick and choose a song out of ten by using **${query} <query>** and then typing the song number afterwards. Now you can be extra specific with your torture, you shitty admiral!`);
			} else if (arguments [0] === "info") {
				message.channel.send (`Are you so inept that you need to use **${query} [song_index]** to find information about the current song or a song at a given index? You stupid admiral!`);
			} else if (arguments [0] === "move") {
				message.channel.send (`Since you're so indecisive, you can use **${query} <song_index> <destination_index>** to change a song's position (will shift other songs' positions) on the queue, you shitty admiral!`);
			} else if (arguments [0] === "swap") {
				message.channel.send (`Since you somehow mistook two completely different songs, you can use **${query} <song_one_index> <song_two_index>** to swap two songs' position on the queue, you shitty admiral!`);
			} else if (arguments [0] === "skip") {
				message.channel.send (`Since you apparently didn't already know, you can use **${query} [song_index]** to skip to the next song or to a different song on the queue, you stupid admiral!`);
			} else if (arguments [0] === "remove") {
				message.channel.send (`If you'd like to spare my ears from your torture, you can use **${query} <song_index>** to remove a specific song from the queue, but you'd never do that, you shitty admiral!`);
			} else if (arguments [0] === "stop" || arguments [0] === "leave") {
				message.channel.send (`Is this a blessing? You're finally going to use **${query}** to clear the queue and stop the torturous music? You must be tricking me, you shitty admiral!`);
			} else if (arguments [0] === "queue") {
				message.channel.send (`Are you so brainless that you can't remember what's on the queue without using **${query}**? What a stupid admiral!`);
			} else if (arguments [0] === "loop") {
				message.channel.send (`Using **${query}** will allow you to toggle between loop states, not that I expect you to know what that means, you stupid admiral!`);
			} else {
				message.channel.send (`Are you trying to trick me? **${query}** isn't one of my commands, you shitty admiral!`);
			}
		}
	} else if (command === "prefix") {
		setPrefix (arguments [0], message);
	} else if (command === "waifu") {
		waifu (arguments, message);
	} else if (command === "marry") {
		marry (arguments, message);
	} else if (command === "list") {
		message.channel.send ("You can find all available waifus at https://raw.githubusercontent.com/zuiun/akebot/master/database.json, you perverted admiral!");
		// list (message);
	} else if (command === "8ball" || command === "aniball") {
		const response = Math.floor (Math.random () * extras ["8ball"].length);
		message.channel.send (extras ["8ball"] [response] [0]);
		message.channel.send (extras ["8ball"] [response] [1]);
	} else if (command === "headpat") {
		message.channel.send ("Ju-just this once, okay? You shitty admiral...");
		message.channel.send ("https://cdn.donmai.us/original/66/3d/__admiral_and_akebono_kantai_collection_drawn_by_max_melon__663d2e79b9ca0c5a8ae869ee735f7e9d.jpg");
	} else if (command === "explosion") {
		message.channel.send ("THE TIME OF RECKONING HAS COME. GOODBYE, YOU SHITTY ADMIRAL.");
		message.channel.send ("https://media.tenor.com/images/f0f5cd220ef082c4a9b9cc30bcdbd45c/tenor.gif");
	} else if (command === "cheer") {
		message.channel.send ("This is Shikinami, a fellow special-type destroyer and a colleague of mine. If you touch her, I'll kill you, you perverted admiral!");
		message.channel.send ("https://cdn.donmai.us/original/43/c0/__shikinami_kantai_collection_drawn_by_onio__43c00ac5e146da1b20b54fa32791b3d9.gif");
	} else if (command === "play") {
		const query = `${arguments.join (" ")}`;
		execute (query, message, false);
	} else if (command === "search") {
		const query = `${arguments.join (" ")}`;
		execute (query, message, true);
	} else if (command === "info") {
		info (arguments [0], message);
	} else if (command === "move") {
		move (arguments, message);
	} else if (command === "swap") {
		swap (arguments, message);
	} else if (command === "skip") {
		skip (arguments [0], message);
	} else if (command === "remove") {
		remove (arguments [0], message);
	} else if (command === "stop" || command === "leave") {
		stop (message);
	} else if (command === "queue") {
		listQueue (message, queue [message.guild.id], false);
	} else if (command === "loop") {
		loop (message);
	} else if (command === "rickroll") {
		message.channel.send ("https://i.imgur.com/yed5Zfk.gif");
	} else if (command === "insult" || command === "baka") {
		message.channel.send (extras ["insults"] [Math.floor (Math.random () * extras ["insults"].length)].replace ("${NAME}", `<@${message.author.id}>`));
	} else if (command === "laugh" || command === "wonky") {
		message.channel.send ("I eat shitty admirals like you for breakfast!");
		message.channel.send ("https://cdn.discordapp.com/attachments/757245390167736434/757436349543350364/Laughing-scout-SFM.gif");
	} else {
		message.channel.send (`**${prefix}${command}** isn't one of my commands, you stupid admiral!`);
	}
});

function setPrefix (query, message) {
	var prefixes = JSON.parse (fs.readFileSync ("./prefixes.json", "utf-8"));

	if (! message.member.hasPermission ("MANAGE_GUILD")) {
		message.channel.send ("You don't have a high enough rank to order me around, you shitty recruit!");
	} else if (! query) {
		message.channel.send ("You need to actually give me a prefix, you stupid admiral!");
	} else {
		var originalPrefix = prefixes [message.guild.id];

		prefixes [message.guild.id] = query;
		fs.writeFile ("./prefixes.json", JSON.stringify (prefixes), (error) => {
			if (error) {
				console.log (error);
			}
		});
		message.channel.send (`I've changed this server's prefix from ${originalPrefix} to ${prefixes [message.guild.id]}, you shitty admiral!`);
	}
}

function waifu (query, message) {
	if (! query.length) {
		message.channel.send ("I need a waifu to find, you shitty admiral!");
		return;
	}

	var database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));

	if (query [0] === "random") {
		let random = [];

		for (var i in database) {
			if (i === "random") {
				for (var j in database [i]) {
					random.push (database [i] [j]);
				}
			} else {
				for (var j in database [i] [1]) {
					random.push (database [i] [1] [j]);
				}
			}
		}

		message.channel.send (random [Math.floor (Math.random () * random.length)]);
		return;
	}

	let search = query.join (" ").toLowerCase ();
	search = aliasName (search);

	if (search === "akebono") {
		if (counter < 1) {
			message.channel.send ("W-why should I send you pictures of myself, you perverted admiral!?");
			counter ++;
			return;
		} else if (counter === 1) {
			message.channel.send ("Fine, but don't show anybody... SHITTY ADMIRAL!");
			counter ++;
		} else {
			message.channel.send ("Shitty admiral!");
		}
	}

	for (var i in database) {
		if (i === search) {
			const images = database [i] [1];

			message.channel.send (images [Math.floor (Math.random () * images.length)]);
			return;
		}
	}

	message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
}

function aliasName (query) {
	var database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));

	for (var i in database) {
		for (var j in database [i] [0]) {
			if (database [i] [0] [j] === query) {
				return i;
			}
		}
	}

	return query;
}

function marry (query, message) {
	if (! query.length) {
		message.channel.send ("You need to use a marriage action, you stupid admiral!");
		return;
	}

	var person = message.author.id;
	let search = query.slice (1).join (" ").toLowerCase ();

	createMarriage (person);

	switch (query [0].toLowerCase ()) {
		case "marry":
			if (! search) {
				message.channel.send ("You need to ask for a waifu, you shitty admiral!");
				return;
			}

			var database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));

			search = aliasName (search);

			for (var i in database) {
				if (i === search) {
					let marriages = JSON.parse (fs.readFileSync ("./marriages.json", "utf-8"));

					if (marriages [person].includes (search)) {
						const index = marriages [person].indexOf (search);

						marriages [person].splice (index, 1);
						message.channel.send (`You've divorced **${search}**, you shitty admiral!`);
					} else {
						marriages [person].push (search);
						message.channel.send (`You've married **${search}**, you perverted admiral!`);
					}

					fs.writeFile ("./marriages.json", JSON.stringify (marriages), (error) => {
						if (error) {
							console.log (error);
						}
					});
					return;
				}
			}

			break;
		case "view":
			let araragi = getMention (search);

			if (araragi) {
				message.channel.send (`<@${araragi}> is married to ${getMarriage (araragi)}, you shitty admiral!`);
			} else {
				message.channel.send (`<@${person}> is married to ${getMarriage (person)}, you shitty admiral!`);
			}

			return;
		case "fun":
			if (! search) {
				message.channel.send ("You need to ask for a marriage partner, you shitty admiral!");
				return;
			}

			var database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));

			search = aliasName (search);

			for (var i in database) {
				if (i === search) {
					const lines = database [i] [2];

					message.channel.send (lines [Math.floor (Math.random () * lines.length)]);
					return;
				}
			}

			message.channel.send (`You're not married to **${search}**, you stupid admiral!`);
			break;
		default:
			message.channel.send (`**${query [0]}** isn't a valid action, you stupid admiral!`);
			return;
	}

	message.channel.send (`**${search}** isn't one of the waifus in my database, you shitty admiral!`);
}

function createMarriage (person) {
	var marriages = JSON.parse (fs.readFileSync ("./marriages.json", "utf-8"));

	if (! marriages [person]) {
		marriages [person] = [];
		fs.writeFile ("./marriages.json", JSON.stringify (marriages), (error) => {
			if (error) {
				console.log (error);
			}
		});
	}
}

function getMarriage (person) {
	var marriages = JSON.parse (fs.readFileSync ("./marriages.json", "utf-8"));

	if (marriages [person]) {
		if (marriages [person].length > 0) {
			let girls = ``;

			for (var i in marriages [person]) {
				girls += `[${marriages [person] [i]}], `;
			}

			return girls.substring (0, girls.length - 2);
		}
	}

	return "nobody";
}

function getMention (query) {
	if (! query) {
		return;
	}

	if (query.startsWith ("<@") && query.endsWith (">")) {
		let result = query.slice (2, -1);

		if (result.startsWith ("!")) {
			result = result.slice (1);
		}

		return result;
	}
}

function list (message) {
	var database = JSON.parse (fs.readFileSync ("./database.json", "utf-8"));

	for (var i in database) {
		let aliases = `${i} - `;

		if (i === "random") {
			break;
		}

		for (var j in database [i] [0]) {
			aliases += `[${database [i] [0] [j]}], `;
		}

		message.channel.send (aliases.substring (0, aliases.length - 2));
	}
}

async function execute (query, message, search) {
	const voiceChannel = message.member.voice.channel;

	if (! voiceChannel) {
		message.channel.send ("I can't play music if you're not in a voice channel, you stupid admiral!");
		return;
	}

	const permissions = voiceChannel.permissionsFor (message.client.user);

	if (! permissions.has ("CONNECT") || ! permissions.has ("SPEAK")) {
		message.channel.send ("I don't have the right permissions to play music, you shitty admiral!");
		return;
	}

	connection [message.guild.id] = await voiceChannel.join ();

	if (! query) {
		message.channel.send ("You didn't give me a song, you stupid admiral!");
		return;
	}

	message.channel.send (`I'm currently searching for **${query}**, you shitty admiral!`);

	if (search) {
		const info = await ytdlInfo.getInfo (`ytsearch10:${query}`, ['--default-search=ytsearch', '-i', '--format=best'], true);
		const songs = [];
		var i;

		for (i = 0; i < 10 && i < info.items.length; i ++) {
			songs.push ({
				title: info.items [i].title,
				url: info.items [i].url,
				id: info.items [i].id,
				length: timestamp (parseInt (info.items [i].duration) * 1000)
			})
		}

		listQueue (message, songs, true);

		const collector = message.channel.createMessageCollector (response => response.author.id === message.author.id, { time: waitTime });

		message.channel.send (`You have ${waitTime / 1000} seconds to make a choice, you shitty admiral!`);
        collector.on ("collect", response => {
			var index = parseInt (response, 10);

			if (isNaN (index)) {
				response.channel.send (`**${response}** isn't a valid index, you stupid admiral!`);
			} else if (index < 1 || index > songs.length) {
				response.channel.send (`**${response}** isn't inside the queue, you stupid admiral!`);
			} else {
				index --;

				const song = {
					title: songs [index].title,
					url: songs [index].url,
					id: songs [index].id,
					length: songs [index].length
				};

				addSong (message, song);
				collector.stop ();
			}
		})
		collector.on ("end", collected => {
			message.channel.send ("I've stopped listening for a song choice, you shitty admiral!");
		});
	} else {
		const info = await ytdlInfo.getInfo (`${query}`);
		const song = {
			title: info.items [0].title,
			url: info.items [0].url,
			id: info.items [0].id,
			length: timestamp (parseInt (info.items [0].duration) * 1000)
		};

		addSong (message, song);
	}
}

function timestamp (ms) {
	const unconvertedTime = [ Math.floor (ms / 1000 / 60), Math.floor (ms / 1000) % 60];
	var time = ``

	if (unconvertedTime [0] < 10) {
		time += `0`;
	}

	time += `${unconvertedTime [0]}:`;

	if (unconvertedTime [1] < 10) {
		time += `0`;
	}

	time += `${unconvertedTime [1]}`;
	return time;
}

function addSong (message, song) {
	queue [message.guild.id].push (song);
	message.channel.send (`Even though this is your job, I added **${song.title}** to the queue for you, you shitty admiral!`);

	if (queue [message.guild.id].length == 1) {
		try {
			play (message, queue [message.guild.id] [index]);
		} catch (error) {
			console.log (error);
			return;
		}
	}
}

function info (query, message) {
	if (queue [message.guild.id].length < 1) {
		message.channel.send ("There isn't any music to describe, you shitty admiral!");
	} else {
		var newIndex = parseInt (query, 10);

		if (! query) {
			message.channel.send (`You're at ${timestamp (connection [message.guild.id].dispatcher.streamTime)} out of a total of ${queue [message.guild.id] [index].length} in the song ${queue [message.guild.id] [index].title}, which can be found at https://www.youtube.com/watch?v=${queue [message.guild.id] [index].id}, you shitty admiral!`);
		} else if (isNaN (newIndex)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (newIndex < 1 || newIndex > queue [message.guild.id].length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			newIndex --;
			message.channel.send (`The song at index ${newIndex + 1} is ${queue [message.guild.id] [newIndex].title} and ${queue [message.guild.id] [newIndex].length} long, which can be found at https://www.youtube.com/watch?v=${queue [message.guild.id] [newIndex].id}, you shitty admiral!`);
		}
	}
}

function move (query, message) {
	if (! connection [message.guild.id]) {
		message.channel.send ("I can't move music without being in a voice channel, you stupid admiral!");
	} else if (queue [message.guild.id].length < 2) {
		message.channel.send ("There isn't enough music to move, you shitty admiral!");
	} else if (query.length < 2) {
		message.channel.send ("You didn't give me enough indices to move music, you shitty admiral!");
	} else {
		var first = parseInt (query [0], 10), second = parseInt (query [1], 10);

		if (isNaN (first) || isNaN (second)) {
			message.channel.send (`**${first}** and/or **${second}** aren't valid indices, you stupid admiral!`);
		} else if (first < 1 || first > queue [message.guild.id].length || second < 1 || second > queue [message.guild.id].length) {
			message.channel.send (`**${first}** and/or **${second}** aren't inside the queue, you stupid admiral!`);
		} else {
			first --;
			second --;
			
			const song = queue [message.guild.id] [first];

    		queue [message.guild.id].splice (first, 1);
			queue [message.guild.id].splice (second, 0, song);
			message.channel.send (`I've moved ${song.title} from index ${first + 1} to index ${second + 1}, you shitty admiral!`);

			if (first === index || second === index) {
				try {
					play (message, queue [message.guild.id] [index]);
				} catch (error) {
					console.log (error);
					return;
				}
			}
		}
	}
}

function swap (query, message) {
	if (! connection [message.guild.id]) {
		message.channel.send ("I can't swap music without being in a voice channel, you stupid admiral!");
	} else if (queue [message.guild.id].length < 2) {
		message.channel.send ("There isn't enough music to swap, you shitty admiral!");
	} else if (query.length < 2) {
		message.channel.send ("You didn't give me enough indices to swap music, you shitty admiral!");
	} else {
		var first = parseInt (query [0], 10), second = parseInt (query [1], 10);

		if (isNaN (first) || isNaN (second)) {
			message.channel.send (`**${first}** and/or **${second}** aren't valid indices, you stupid admiral!`);
		} else if (first < 1 || first > queue [message.guild.id].length || second < 1 || second > queue [message.guild.id].length) {
			message.channel.send (`**${first}** and/or **${second}** aren't inside the queue, you stupid admiral!`);
		} else {
			first --;
			second --;
			[queue [message.guild.id] [first], queue [message.guild.id] [second]] = [queue [message.guild.id] [second], queue [message.guild.id] [first]]
			message.channel.send (`I've swapped ${queue [message.guild.id] [second].title} at index ${first + 1} with ${queue [message.guild.id] [first].title} at index ${second + 1}, you shitty admiral!`);

			if (first === index || second === index) {
				try {
					play (message, queue [message.guild.id] [index]);
				} catch (error) {
					console.log (error);
					return;
				}
			}
		}
	}
}

function skip (query, message) {
	if (! connection [message.guild.id]) {
		message.channel.send ("I can't skip music without being in a voice channel, you stupid admiral!");
	} else if (queue [message.guild.id].length < 1) {
		message.channel.send ("There isn't any music to skip, you shitty admiral!");
	} else {
		var newIndex = parseInt (query, 10);

		if (! query) {
			index ++;

			if (index >= queue [message.guild.id].length) {
				message.channel.send (`You skipped to the end of the queue, you stupid admiral!`);
				stop (message);
				return;
			}

			try {
				play (message, queue [message.guild.id] [index]);
			} catch (error) {
				console.log (error);
				return;
			}
		} else if (isNaN (newIndex)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (newIndex < 1 || newIndex > queue [message.guild.id].length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			index = newIndex;
			index --;
			message.channel.send (`I've skipped to index ${index + 1}, which is ${queue [message.guild.id] [index].title}, you shitty admiral!`);

			try {
				play (message, queue [message.guild.id] [index]);
			} catch (error) {
				console.log (error);
				return;
			}
		}
	}
}

function remove (query, message) {
	if (! connection [message.guild.id]) {
		message.channel.send ("I can't remove music without being in a voice channel, you stupid admiral!");
	} else if (queue [message.guild.id].length < 1) {
		message.channel.send ("There isn't any music to remove, you shitty admiral!");
	} else {
		var newIndex = parseInt (query, 10);

		if (! query || isNaN (newIndex)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (newIndex < 1 || newIndex > queue [message.guild.id].length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			newIndex --;

			const song = queue [message.guild.id] [newIndex];

			queue [message.guild.id].splice (newIndex, 1);
			message.channel.send (`I've removed **${song.title}** for you, you shitty admiral!`);

			if (newIndex <= index) {
				if (newIndex < index) {
					index --;
				}

				if (queue [message.guild.id].length < 1) {
					stop (message);
					return;
				}

				try {
					play (message, queue [message.guild.id] [index]);
				} catch (error) {
					console.log (error);
					return;
				}
			}
		}
	}
}

function stop (message) {
	queue [message.guild.id] = [];
	index = 0;

	if (! connection [message.guild.id]) {
		message.channel.send ("I can't stop music without being in a voice channel, you stupid admiral!");
	} else {
		connection [message.guild.id].channel.leave ();
		message.channel.send ("I've cleared the queue and left the voice channel, you shitty admiral!");

		if (connection [message.guild.id].dispatcher) {
			connection [message.guild.id].dispatcher.end ();
			message.channel.send ("I've stopped playing your horrible music, you shitty admiral!");
		}
	}
}

function play (message, song) {
	if (! song) {
		message.channel.send ("I've reached the end of the queue, you shitty admiral!");
		stop (message);
		return;
	}

	const dispatcher = connection [message.guild.id].play (`${song.url}`).on ("finish", () => {
		index ++;

		switch (loopState) {
			case 1:
				if (index === queue [message.guild.id].length) {
					index = 0;
				}

				break;
			case 2:
				index --;
				break;
		}

		play (message, queue [message.guild.id] [index]);
	}).on ("error", error => console.error (error));

	dispatcher.setVolumeLogarithmic (1);
	message.channel.send (`I'm currently playing **${song.title}** for you! You better be grateful, you shitty admiral!`);
}

function listQueue (message, songs, search) {
	var i, list;

	if (search) {
		list = `These are my search results, you shitty admiral!\n`
	} else {
		list = `This is the current queue, you shitty admiral! `;

		switch (loopState) {
			case 0:
				list += `I'm not looping anything right now, you shitty admiral!\n`;
				break;
			case 1:
				list += `I'm looping the queue right now, you shitty admiral!\n`;
				break;
			case 2:
				list += `I'm looping the current song right now, you shitty admiral!\n`;
				break;
		}
	}

	if (songs.length === 0) {
		if (search) {
			message.channel.send ("I didn't find anything in my search, you shitty admiral!");
		} else {
			message.channel.send ("The queue is empty, you stupid admiral!");
		}

		return;
	}

	for (i = 0; i < songs.length; i ++) {
		if (! search && i === index) {
			list += `[Current] `;
		}

		list += `${i + 1} - ${songs [i].title} (${songs [i].length})\n`;
	}

	message.channel.send (list);
}

function loop (message) {
	if (loopState < 2) {
		loopState ++;
	} else {
		loopState = 0;
	}

	switch (loopState) {
		case 0:
			message.channel.send ("I'm not looping anything, you shitty admiral!");
			break;
		case 1:
			message.channel.send ("I'm looping the queue, you shitty admiral!");
			break;
		case 2:
			message.channel.send ("I'm looping the current song, you shitty admiral!");
			break;
	}
}

client.login (token);
