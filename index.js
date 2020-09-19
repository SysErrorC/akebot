const { prefix, token } = require('./config.json');
const database = require('./database.json');
const aliases = require('./aliases.json');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const client = new Discord.Client();

var counter = 0

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const arguments = message.content.slice(prefix.length).trim().split(/ +/);
	const command = arguments.shift().toLowerCase();

	if (command === 'help') {
		if (!arguments.length) {
			message.channel.send("My command prefix is !, but you already knew that, you shitty admiral! I can only find waifu pictures using the !waifu command, because apparently I'm not enough for you!");
		} else {
			if (arguments[0] === 'help') {
				message.channel.send(`Huh? Are you an idiot? ${prefix}${arguments.join(' ')} just tells you my commands, you stupid admiral!`);
			} else if (arguments[0] === 'waifu') {
				message.channel.send(`Why are you so interested in other girls, huh? If you're so needy, you can use ${prefix}${arguments.join(' ')} name to get a picture of your waifu, you perverted admiral!`);
			} else if (arguments[0] === 'headpat') {
				message.channel.send(`Don't even think about using ${prefix}${arguments.join(' ')} to make me feel loved, you perverted admiral!`);
			} else {
				message.channel.send(`Are you trying to trick me? ${prefix}${arguments.join(' ')} isn't one of my commands, you shitty admiral!`);
			}
		}
	} else if (command === 'waifu') {
		if (!arguments.length) {
			message.channel.send('I need a waifu to find, you shitty admiral!');
			return;
		}

		var query = `${arguments.join(' ')}`;

		for (var key in aliases) {
			if (key === query) {
				query = aliases[key];
			}
		}

		if (query === 'akebono') {
			if (counter < 1) {
				message.channel.send('W-why should I send you pictures of myself, you perverted admiral!?');
				counter++;
				return;
			} else if (counter === 1) {
				message.channel.send('Fine, but don\'t show anybody... SHITTY ADMIRAL!');
				counter ++;
			} else {
				message.channel.send('Shitty admiral!');
			}
		}

		for (var key in database) {
			if (key === query) {
				message.channel.send(JSON.stringify(database[key][Math.floor(Math.random() * database[key].length)], null, 2).replace(/\"/g, ""));
				return;
			}
		}

		message.channel.send(`${query} isn't one of the waifus in my database, you shitty admiral!`);
	} else if (command === 'headpat') {
		message.channel.send("H-hey! Where do you think you're touching, you... shitty... admiral...");
	}
});

client.login(token);