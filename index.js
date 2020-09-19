const { prefix, token } = require ("./config.json");
const database = require ("./database.json");
const aliases = require ("./aliases.json");
const fetch = require ("node-fetch");
const ytdl = require ("ytdl-core");
const ytdlInfo = require ("ytdl-getinfo");
const Discord = require ("discord.js");
const client = new Discord.Client ();

var connection;
var queue = [];
var counter = 0;
var index = 0;

client.once ("ready", () => {
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
			message.channel.send (`My command prefix is **${prefix}**, but you already knew that, you shitty admiral! My commands are:\n**${prefix}waifu**\n**${prefix}play**\n**${prefix}skip**\n**${prefix}stop**\n**${prefix}queue**\n\nI also have secret commands, not that I'll tell you what they are, you shitty admiral!`);
		} else {
			var query = `${prefix}${arguments.join (" ")}`

			if (arguments [0] === "help") {
				message.channel.send (`Huh? Are you an idiot? **${query}** just tells you my commands! **Bolded phrases** are commands, while [bracketed arguments] are optional, you stupid admiral!`);
			} else if (arguments [0] === "waifu") {
				message.channel.send (`Why are you so interested in other girls, huh? If you're so needy, you can use **${query} name** to get a picture of your waifu, you perverted admiral!`);
			} else if (arguments [0] === "play") {
				message.channel.send (`Your music is annoying! Why would anybody let you use **${query} youtube_song_url** to play music, huh!? You shitty admiral!`);
			} else if (arguments [0] === "skip") {
				message.channel.send (`Since you apparently don't know how, you can use **${query} [song_index]** to skip to a different song on the queue, you stupid admiral!`)
			} else if (arguments [0] === "stop") {
				message.channel.send (`Is this a blessing? You're finally goign to use **${query}** to stop playing that horrible music? This must be a trick, you shitty admiral!`);
			} else if (arguments [0] === "queue") {
				message.channel.send (`Are you so brainless that you can't remember what's on the queue without using **${query}**? What a stupid admiral!`);
			} else {
				message.channel.send (`Are you trying to trick me? **${query}** isn't one of my commands, you shitty admiral!`);
			}
		}
	} else if (command === "waifu") {
		waifu (arguments, message);
	} else if (command === "headpat") {
		message.channel.send ("H-hey! Where do you think you're touching, you shitty... admiral...");
	} else if (command === "explosion") {
		message.channel.send ("https://media.tenor.com/images/f0f5cd220ef082c4a9b9cc30bcdbd45c/tenor.gif")
	} else if (command === "cheer") {
		message.channel.send ("https://cdn.donmai.us/original/43/c0/__shikinami_kantai_collection_drawn_by_onio__43c00ac5e146da1b20b54fa32791b3d9.gif");
	} else if (command === "play") {
		const query = `${arguments.join (" ")}`;
		execute (query, message);
	} else if (command === "skip") {
		skip (arguments [0], message);
	} else if (command === "stop") {
		stop (message);
	} else if (command === "queue") {
		var i, list = ``;

		if (queue.length === 0) {
			message.channel.send ("The queue is empty, you stupid admiral!");
			return;
		}

		for (i = 0; i < queue.length; i ++) {
			if (i === index) {
				list += `[Current] `;
			}

			list += `${i + 1} - ${queue [i].title}\n`;
		}

		message.channel.send (list);
	} else {
		message.channel.send (`**${prefix}${arguments.join (" ")}** isn't one of my commands, you stupid admiral!`);
	}
});

function waifu (arguments, message) {
	if (! arguments.length) {
		message.channel.send ("I need a waifu to find, you shitty admiral!");
		return;
	}

	var query = `${arguments.join (" ")}`;

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

	for (var key in database) {
		if (key === query) {
			const images = database [key];

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
		id: info.items [0].id
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

function skip (query, message) {
	if (! message.member.voice.channel) {
		message.channel.send ("I can't skip music without being in a voice channel, you stupid admiral!");
	} else if (! queue) {
		message.channel.send ("There isn't any music to skip, you shitty admiral!");
	} else {
		if (query === "0") {
			message.channel.send (`**${query}** isn't a valid index, you stupid admiral!`);
			return;
		} else {
			var newIndex = parseInt (query);

			if (! newIndex) {
				console.log("no");
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
			} else if (newIndex < 1 || newIndex > queue.length) {
				message.channel.send (`**${newIndex}** isn't a valid index, you stupid admiral!`);
			} else {
				index = newIndex;
				index --;
				
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
	if (! message.member.voice.channel) {
		message.channel.send ("I can't stop music without being in a voice channel, you stupid admiral!");
	} else if (! connection.dispatcher) {
		message.channel.send ("I can't stop music if I'm not fully connected, you stupid admiral!");
	} else {
		queue.songs = [];
		connection.dispatcher.end ();
		message.channel.send ("I've stopped playing your horrible music, you shitty admiral!")
	}
}

function play (message, song) {
	if (! song) {
		stop (message);
		return;
	}

	const dispatcher = connection.play (/* ytdl (`https://www.youtube.com/watch?v=${song.id}`) */`${song.url}`).on ("finish", () => {
		index ++;
		play (message, queue [index]);
	}).on ("error", error => console.error (error));

	dispatcher.setVolumeLogarithmic (1);
	message.channel.send (`I'm currently playing **${song.title}** for you! You better be grateful, you shitty admiral!`);
}

client.login (token);