const { prefix, token } = require ("./config.json");
const database = require ("./database.json");
const aliases = require ("./aliases.json");
const insults = require ("./insults.json");
const ytdlInfo = require ("ytdl-getinfo");
const Discord = require ("discord.js");
const client = new Discord.Client ();

var connection;
var queue = [];
var random = [];
var counter = 0;
var index = 0;
var loopState = 0;

client.once ("ready", () => {
	client.user.setPresence ({ activity: { name: `Use ${prefix}help if you need me, you shitty admiral!` } });

	for (var i in database) {
		for (var j in database [i]) {
			random.push (database [i] [j]);
		}
	}
	
	console.log ("Ready!");
});

client.once ("reconnecting", () => {
	console.log ("Reconnecting!");
});
  
client.once ("disconnect", () => {
	console.log ("Disconnect!");
});

client.on ("message", message => {
	if (! message.content.startsWith (prefix) || message.author.bot) {
		return;
	}

	const arguments = message.content.slice (prefix.length).trim ().split(/ +/);
	const command = arguments.shift ().toLowerCase ();

	if (command === "help") {
		if (! arguments.length) {
			message.channel.send (`My command prefix is **${prefix}**, but you already knew that, you shitty admiral! You can use ${prefix}help command_name to find out how to use that command, you stupid admiral! My commands are:\n**${prefix}waifu\n${prefix}list\n${prefix}play\n${prefix}info\n${prefix}move\n${prefix}swap\n${prefix}skip\n${prefix}remove\n${prefix}stop\n${prefix}queue**\nI also have secret commands, not that I'll tell you what they are, you shitty admiral!`);
		} else {
			var query = `${prefix}${arguments [0]}`

			if (arguments [0] === "help") {
				message.channel.send (`Huh? Are you an idiot? **${query}** just tells you my commands! **Bolded phrases** are commands, while [bracketed arguments] are optional, you stupid admiral!`);
			} else if (arguments [0] === "waifu") {
				message.channel.send (`Why are you so interested in other girls, huh? If you're so needy, you can use **${query} name** to get a picture of your waifu, you perverted admiral!`);
			} else if (arguments [0] === "list") {
				message.channel.send (`How disgusting! Are you keeping a track of your waifus using **${query}**!? You perverted admiral!`);
			} else if (arguments [0] === "play") {
				message.channel.send (`Your music is annoying! Why would anybody let you use **${query} youtube_query** to play music, huh!? You shitty admiral!`);
			} else if (arguments [0] === "info") {
				message.channel.send (`Are you so inept that you need to use **${query} [song_index]** to find information about the current song or a song at a given index? You stupid admiral!`);
			} else if (arguments [0] === "move") {
				message.channel.send (`Since you're so indecisive, you can use **${query} song_index destination_index** to change a song's position on the queue, you shitty admiral!`);
			} else if (arguments [0] === "swap") {
				message.channel.send (`Since you somehow mistook two completely different songs, you can use **${query} song_one_index song_two_index** to swap two songs' position on the queue, you shitty admiral!`);
			} else if (arguments [0] === "skip") {
				message.channel.send (`Since you apparently didn't already know, you can use **${query} [song_index]** to skip to a different song on the queue, you stupid admiral!`);
			} else if (arguments [0] === "remove") {
				message.channel.send (`If you'd like to spare my ears from your torture, you can use **${query} song_index** to remove a specific song from the queue, but you'd never do that, you shitty admiral!`);
			} else if (arguments [0] === "stop") {
				message.channel.send (`Is this a blessing? You're finally going to use **${query}** to clear the queue and stop the torturous music? You must be tricking me, you shitty admiral!`);
			} else if (arguments [0] === "queue") {
				message.channel.send (`Are you so brainless that you can't remember what's on the queue without using **${query}**? What a stupid admiral!`);
			} else if (arguments [0] === "loop") {
				message.channel.send (`Using **${query}** will allow you to toggle between loop states, not that I expect you to know what that means! You stupid admiral!`);
			} else {
				message.channel.send (`Are you trying to trick me? **${query}** isn't one of my commands, you shitty admiral!`);
			}
		}
	} else if (command === "waifu") {
		waifu (arguments, message);
	} else if (command === "list") {
		var list = `Here are all of my supported waifus, you perverted admiral! They're in the format **alias (database_name)**!\nAlso I'm far too lazy to properly format these - Ike\n`;

		for (var key in aliases) {
			list += `${key} (${aliases [key]})\n`;
		}

		message.channel.send (list);
	}else if (command === "headpat") {
		message.channel.send ("H-hey! Where do you think you're touching, you shitty... admiral...");
	} else if (command === "explosion") {
		message.channel.send ("https://media.tenor.com/images/f0f5cd220ef082c4a9b9cc30bcdbd45c/tenor.gif")
	} else if (command === "cheer") {
		message.channel.send ("https://cdn.donmai.us/original/43/c0/__shikinami_kantai_collection_drawn_by_onio__43c00ac5e146da1b20b54fa32791b3d9.gif");
	} else if (command === "play") {
		const query = `${arguments.join (" ")}`;
		execute (query, message);
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
	} else if (command === "stop") {
		stop (message);
	} else if (command === "queue") {
		var i, list = `This is the current queue, you shitty admiral!\n`;

		if (queue.length === 0) {
			message.channel.send ("The queue is empty, you stupid admiral!");
			return;
		}

		for (i = 0; i < queue.length; i ++) {
			if (i === index) {
				list += `[Current] `;
			}

			list += `${i + 1} - ${queue [i].title} (${queue [i].length})\n`;
		}

		message.channel.send (list);
	} else if (command === "loop") {
		loop (message);
	} else if (command === "rickroll") {
		message.channel.send ("https://i.imgur.com/yed5Zfk.gif");
	} else if (command === "baka") {
		message.channel.send (insults ["insults"] [Math.floor (Math.random () * insults ["insults"].length)].replace ("${NAME}", `<@${message.author.id}>`));
	} else {
		message.channel.send (`**${prefix}${command}** isn't one of my commands, you stupid admiral!`);
	}
});

function waifu (query, message) {
	if (! query.length) {
		message.channel.send ("I need a waifu to find, you shitty admiral!");
		return;
	}

	if (query [0] === "random") {
		message.channel.send (random [Math.floor (Math.random () * random.length)]);
		return;
	}

	var query = `${query.join (" ")}`;

	for (var i in aliases) {
		if (i === query) {
			query = aliases [i];
		}
	}

	if (query === "akebono") {
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
		if (i === query) {
			const images = database [i];

			message.channel.send (images [Math.floor (Math.random () * images.length)]);
			return;
		}
	}

	message.channel.send (`**${query}** isn't one of the waifus in my database, you shitty admiral!`);
}

async function execute (query, message) {
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

	connection = await voiceChannel.join ();

	if (! query) {
		message.channel.send ("You didn't give me a song, you stupid admiral!");
		return;
	}

	message.channel.send (`I am currently searching for **${query}**, you shitty admiral!`);

	const info = await ytdlInfo.getInfo (query);
	const song = {
		title: info.items [0].title,
		url: info.items [0].url,
		id: info.items [0].id,
		length: timestamp (parseInt (info.items [0].duration) * 1000)
	};

	queue.push (song);
	message.channel.send (`Even though this is your job, I added **${song.title}** to the queue for you, shitty admiral!`);
	
	if (queue.length == 1) {
		try {
			play (message, queue [index]);
		} catch (error) {
			console.log (error);
			return;
		}
	}
}

function timestamp (ms) {
	const unconvertedTime = new Date (ms);
	var time = ``

	if (unconvertedTime.getMinutes () < 10) {
		time += `0`;
	}

	time += `${unconvertedTime.getMinutes ()}:`;

	if (unconvertedTime.getSeconds () < 10) {
		time += `0`;
	}

	time += `${unconvertedTime.getSeconds ()}`;
	return time;
}

function info (query, message) {
	if (! message.member.voice.channel) {
		message.channel.send ("I can't tell you about music without being in a voice channel, you stupid admiral!");
	} else if (! queue) {
		message.channel.send ("There isn't any music to describe, you shitty admiral!");
	} else {
		var newIndex = parseInt (query, 10);

		if (! query) {
			message.channel.send (`You are at ${timestamp (connection.dispatcher.streamTime)} out of a total of ${queue [index].length} in the song ${queue [index].title}, which can be found at https://www.youtube.com/watch?v=${queue [index].id}, you shitty admiral!`);
		} else if (isNaN (newIndex)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (newIndex < 1 || newIndex > queue.length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			newIndex --;
			message.channel.send (`The song at index ${newIndex + 1} is ${queue [newIndex].title} and ${queue [newIndex].length} long, which can be found at https://www.youtube.com/watch?v=${queue [newIndex].id}, you shitty admiral!`);
		}
	}
}

function move (query, message) {
	if (! message.member.voice.channel) {
		message.channel.send ("I can't move music without being in a voice channel, you stupid admiral!");
	} else if (queue.length < 2) {
		message.channel.send ("There isn't enough music to move, you shitty admiral!");
	} else if (query.length < 2) {
		message.channel.send ("You didn't give me enough indices to move music, you shitty admiral!");
	} else {
		var first = parseInt (query [0], 10), second = parseInt (query [1], 10);

		if (isNaN (first) || isNaN (second)) {
			message.channel.send (`**${first}** and/or **${second}** aren't valid indices, you stupid admiral!`);
		} else if (first < 1 || first > queue.length || second < 1 || second > queue.length) {
			message.channel.send (`**${first}** and/or **${second}** aren't inside the queue, you stupid admiral!`);
		} else {
			first --;
			second --;
			
			const song = queue [first];

    		queue.splice (first, 1);
			queue.splice (second, 0, song);
			message.channel.send (`I've moved ${song.title} from index ${first + 1} to index ${second + 1}, you shitty admiral!`);

			if (first === index || second === index) {
				try {
					play (message, queue [index]);
				} catch (error) {
					console.log (error);
					return;
				}
			}
		}
	}
}

function swap (query, message) {
	if (! message.member.voice.channel) {
		message.channel.send ("I can't swap music without being in a voice channel, you stupid admiral!");
	} else if (queue.length < 2) {
		message.channel.send ("There isn't enough music to swap, you shitty admiral!");
	} else if (query.length < 2) {
		message.channel.send ("You didn't give me enough indices to swap music, you shitty admiral!");
	} else {
		var first = parseInt (query [0], 10), second = parseInt (query [1], 10);

		if (isNaN (first) || isNaN (second)) {
			message.channel.send (`**${first}** and/or **${second}** aren't valid indices, you stupid admiral!`);
		} else if (first < 1 || first > queue.length || second < 1 || second > queue.length) {
			message.channel.send (`**${first}** and/or **${second}** aren't inside the queue, you stupid admiral!`);
		} else {
			first --;
			second --;
			[queue [first], queue [second]] = [queue [second], queue [first]]
			message.channel.send (`I've swapped ${queue [second].title} at index ${first + 1} with ${queue [first].title} at index ${second + 1}, you shitty admiral!`);

			if (first === index || second === index) {
				try {
					play (message, queue [index]);
				} catch (error) {
					console.log (error);
					return;
				}
			}
		}
	}
}

function skip (query, message) {
	if (! message.member.voice.channel) {
		message.channel.send ("I can't skip music without being in a voice channel, you stupid admiral!");
	} else if (! queue) {
		message.channel.send ("There isn't any music to skip, you shitty admiral!");
	} else {
		var newIndex = parseInt (query, 10);

		if (! query) {
			index ++;

			if (index >= queue.length) {
				message.channel.send (`You skipped to the end of the queue, you stupid admiral!`);
				stop (message);
				return;
			}
			
			try {
				play (message, queue [index]);
			} catch (error) {
				console.log (error);
				return;
			}
		} else if (isNaN (newIndex)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (newIndex < 1 || newIndex > queue.length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			index = newIndex;
			index --;
			message.channel.send (`I've skipped to index ${index + 1}, which is ${queue [index].title}, you shitty admiral!`);

			try {
				play (message, queue [index]);
			} catch (error) {
				console.log (error);
				return;
			}
		}
	}
}

function remove (query, message) {
	if (! message.member.voice.channel) {
		message.channel.send ("I can't remove music without being in a voice channel, you stupid admiral!");
	} else if (! queue) {
		message.channel.send ("There isn't any music to remove, you shitty admiral!");
	} else {
		var newIndex = parseInt (query, 10);

		if (! query || isNaN (newIndex)) {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
		} else if (newIndex < 1 || newIndex > queue.length) {
			message.channel.send (`**${query}** isn't inside the queue, you stupid admiral!`);
		} else {
			newIndex --;

			const song = queue [newIndex];
			
			queue.splice (newIndex, 1);
			message.channel.send (`I've removed **${song.title}** for you, you shitty admiral!`);

			if (newIndex === index) {
				try {
					play (message, queue [index]);
				} catch (error) {
					console.log (error);
					return;
				}
			}
		}
	}
}

function stop (message) {
	queue = [];
	index = 0;

	if (! message.member.voice.channel) {
		message.channel.send ("I can't stop music without being in a voice channel, you stupid admiral!");
	} else if (! connection.dispatcher) {
		message.channel.send ("I can't stop music if I'm not fully connected, you stupid admiral!");
	} else {
		connection.dispatcher.end ();
		message.channel.send ("I've stopped playing your horrible music, you shitty admiral!")
	}
}

function play (message, song) {
	if (! song) {
		message.channel.send ("I've reached the end of the queue, you shitty admiral!");
		stop (message);
		return;
	}

	const dispatcher = connection.play (/* ytdl (`https://www.youtube.com/watch?v=${song.id}`) */`${song.url}`).on ("finish", () => {
		index ++;

		switch (loopState) {
			case 1:
				if (index === queue.length) {
					index = 0;
				}

				break;
			case 2:
				index --;
				break;
		}

		play (message, queue [index]);
	}).on ("error", error => console.error (error));

	dispatcher.setVolumeLogarithmic (1);
	message.channel.send (`I'm currently playing **${song.title}** for you! You better be grateful, you shitty admiral!`);
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