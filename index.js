const { prefix, token } = require ("./config.json");
const database = require ("./database.json");
const aliases = require ("./aliases.json");
const insults = require ("./insults.json");
const ytdlInfo = require ("ytdl-getinfo");
const Discord = require ("discord.js");
const client = new Discord.Client ();

const waitTime = 10000;
var connection;
var queue = [];
var random = [];
var counter = 0;
var index = 0;
var loopState = 0;

client.once ("ready", () => {
	client.user.setActivity (`Use ${prefix}help if you need me, you shitty admiral!`);

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
			message.channel.send (`Special-type destroyer number 18, 8th of the Ayanami-class, Akebono. My command prefix is **${prefix}**, but you already knew that, you shitty admiral! You can use **${prefix}help command_name** to find out how to use that command, you stupid admiral! My commands are:\n**${prefix}waifu\n${prefix}list\n${prefix}play\n${prefix}search\n${prefix}info\n${prefix}move\n${prefix}swap\n${prefix}skip\n${prefix}remove\n${prefix}stop\n${prefix}queue**\nI also have secret commands, not that I'll tell you what they are, you shitty admiral!\nIf you want to contact my shitty admiral to offer suggestions, report bugs, or offer waifu pictures, join my support server at https://discord.gg/hFQQEcZ, you equally shitty admiral! If you want to examine me, you can go to my GitHub at https://github.com/zuiun/akebot, you perverted admiral!`);
		} else {
			var query = `${prefix}${arguments [0]}`

			if (arguments [0] === "help") {
				message.channel.send (`Huh? Are you an idiot? **${query}** just tells you my commands! **Bolded phrases** are commands, while [bracketed arguments] are optional, you stupid admiral!`);
			} else if (arguments [0] === "waifu") {
				message.channel.send (`Why are you so interested in other girls, huh? If you're so needy, you can use **${query} name** to get a picture of your waifu, you perverted admiral! If you don't care who you get, you can use **${query} random**, you shitty admiral!`);
			} else if (arguments [0] === "list") {
				message.channel.send (`How disgusting! Are you keeping a track of your waifus using **${query}**!? You perverted admiral!`);
			} else if (arguments [0] === "play") {
				message.channel.send (`Your music is annoying! Why would anybody let you use **${query} youtube_query** to play music, huh!? You shitty admiral!`);
			} else if (arguments [0] === "search") {
				message.channel.send (`You can pick and choose a song out of ten by using **${query} youtube_query** and then typing the song number afterwards. Now you can be extra specific with your torture, you shitty admiral!`);
			} else if (arguments [0] === "info") {
				message.channel.send (`Are you so inept that you need to use **${query} [song_index]** to find information about the current song or a song at a given index? You stupid admiral!`);
			} else if (arguments [0] === "move") {
				message.channel.send (`Since you're so indecisive, you can use **${query} song_index destination_index** to change a song's position on the queue, you shitty admiral!`);
			} else if (arguments [0] === "swap") {
				message.channel.send (`Since you somehow mistook two completely different songs, you can use **${query} song_one_index song_two_index** to swap two songs' position on the queue, you shitty admiral!`);
			} else if (arguments [0] === "skip") {
				message.channel.send (`Since you apparently didn't already know, you can use **${query} [song_index]** to skip to the next song or to a different song on the queue, you stupid admiral!`);
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
		listQueue (message, queue, false);
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

function aniball() {
	const responses = [
		"M-maybe. Baka!",
		"Nyope!",
		"Yup. Trust me - I'm the STRONGEST!",
		"ERRR... uhm... Why do YOU want to know?!?",
		".......",
		"Yeah, if you think so!",
		"NIGERUNDAYO SMOKEY!!",
		"Se~no!",
	];
	
	const randomIndex = Math.floor(Math.random() * responses.length);
	
	//sends animegirl associated with line
	if(randomIndex === 0)
	bot.reply("https://safebooru.donmai.us/data/sample/__misaka_mikoto_to_aru_majutsu_no_index_and_1_more_drawn_by_ranf__sample-4dc545929c3e836487450f0cc9fbe541.jpg");
	if randomIndex === 1)
	bot.reply("https://media1.tenor.com/images/117ac22a4b54cbf139310c9d77dcaadd/tenor.gif?itemid=17810041");
	else if(randomIndex === 2)
	bot.reply("https://i3.kym-cdn.com/entries/icons/facebook/000/018/206/bT561.jpg");
	else if(randomIndex === 3)
	bot.reply("http://img3.wikia.nocookie.net/__cb20131224061720/tora-dora/images/8/88/29_taiga_blush_again.jpg");
	else if(randomIndex === 4)
	bot.reply("https://d235zo2kjgm9jl.cloudfront.net/original/2X/7/736c82596ebf6821a75946dcdaf99f560765dd4a.png");
	else if(randomIndex === 5)
	bot.reply("https://safebooru.donmai.us/data/sample/__rem_re_zero_kara_hajimeru_isekai_seikatsu_drawn_by_sekina__sample-de3f6f4dfbb8cc0feb79c1a40e704ed6.jpg");
	else if(randomIndex === 6)
	bot.reply("https://66.media.tumblr.com/7f61c596ce36186c9fb670bebaa3fb65/tumblr_inline_ozxgtf5YUZ1up66o7_500.jpg");
	else if(randomIndex === 7)
	bot.reply("https://i.ytimg.com/vi/pW_BuE42Nk8/maxresdefault.jpg");
	
	//sends reply
	bot.reply(message, responses[randomIndex]);
	
}
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

	connection = await voiceChannel.join ();

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

function info (query, message) {
	if (queue.length < 1) {
		message.channel.send ("There isn't any music to describe, you shitty admiral!");
	} else {
		var newIndex = parseInt (query, 10);

		if (! query) {
			message.channel.send (`You're at ${timestamp (connection.dispatcher.streamTime)} out of a total of ${queue [index].length} in the song ${queue [index].title}, which can be found at https://www.youtube.com/watch?v=${queue [index].id}, you shitty admiral!`);
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
	if (! connection) {
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
	if (! connection) {
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
	if (! connection) {
		message.channel.send ("I can't skip music without being in a voice channel, you stupid admiral!");
	} else if (queue.length < 1) {
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
	if (! connection) {
		message.channel.send ("I can't remove music without being in a voice channel, you stupid admiral!");
	} else if (queue.length < 1) {
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

			if (newIndex <= index) {
				if (newIndex < index) {
					index --;
				}

				if (queue.length < 1) {
					stop (message);
					return;
				}

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

	if (! connection) {
		message.channel.send ("I can't stop music without being in a voice channel, you stupid admiral!");
	}

	connection.disconnect ();
	message.channel.send ("I've cleared the queue and left the voice channel, you shitty admiral!");

	if (connection.dispatcher) {
		connection.dispatcher.end ();
		message.channel.send ("I've stopped playing your horrible music, you shitty admiral!");
	}
}

function play (message, song) {
	if (! song) {
		message.channel.send ("I've reached the end of the queue, you shitty admiral!");
		stop (message);
		return;
	}

	const dispatcher = connection.play (`${song.url}`).on ("finish", () => {
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
