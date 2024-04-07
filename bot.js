const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { NodeactylClient } = require('nodeactyl');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.js');
const color = require('./models/colors.js');

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true}
});

const pterodactyl = new NodeactylClient(config.panel.host, config.panel.apiKey);

///// Prefix Commands ////

client.on('messageCreate', async message => {
    let prefix = "-d"
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === 'bot-restart') {
        if (message.guild.id !== '1226501941249576980') return;

        message.channel.send('Gekkō is now restarting; this will take a few seconds...');
        let logChannel = client.guilds.cache.get('1226501941249576980').channels.cache.get('1226548220801450074');

        let logEmbed = new EmbedBuilder()
            .setTitle('Gekkō Restart')
            .setColor(`${color.bot}`)
            .addFields(
                { name: 'Restarter', value: `${message.author}`, inline: true },
                { name: 'Restarter ID', value: `${message.author.id}`, inline: true }
            );

        let permissionErrorEmbed = new EmbedBuilder()
            .setTitle('**Permissions Error: 50013**')
            .addFields(
                { name: 'Error Message:', value: '```You lack permissions to perform that action```' }
            );

        if (message.author.id !== config.developer.dev1Id && message.author.id !== config.developer.dev2Id) {
            message.channel.send({ embeds: [permissionErrorEmbed] });
            return; // Exit if permission denied
        }

        setTimeout(function() {
            pterodactyl.restartServer(config.panel.gekkoServerId);
        }, 3000);
        
        logChannel.send({ embeds: [logEmbed] });
    }

    if (command === 'bot-stats' && (message.author.id === config.developer.dev1Id || message.author.id === config.developer.dev2Id)) {
        if (message.guild.id !== '1226501941249576980' || message.channel.id === '') return;

        let logChannel = client.guilds.cache.get('1226501941249576980').channels.cache.get('1226548220801450074');
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        
        totalSeconds %= 86400;

        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} days, ${hours} hours, ${minutes} minutes & ${seconds} seconds`;
        let latency = `${client.ws.ping}ms`;

        let logEmbed = new EmbedBuilder()
            .setTitle('Gekkō Stats Log')
            .setColor(`${color.bot}`)
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                { name: 'Requester', value: `${message.author}`, inline: true },
                { name: 'Requester ID', value: `${message.author.id}`, inline: true }
            );

        let permissionErrorEmbed = new EmbedBuilder()
            .setTitle('**Permissions Error: 50013**')
            .setColor('Red')
            .addFields(
                { name: 'Error Message:', value: '```You lack permission to perform this action.```' }
            );

        if (message.author.id !== config.developer.dev1Id && message.author.id !== config.developer.dev2Id) {
            message.channel.send({ embeds: [permissionErrorEmbed] });
            return; // Exit if permission denied
        }

        let statEmbed = new EmbedBuilder()
            .setTitle('Gekkō Bot Stats')
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(color.bot)
            .addFields(
                { name: 'Server Amount', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Latency', value: `${latency}`, inline: true },
                { name: 'Client ID', value: `${client.user.id}`, inline: true },
                { name: 'Uptime', value: `\`\`\`${uptime}\`\`\``, inline: false }
            );

        message.channel.send({ embeds: [statEmbed] });
        logChannel.send({ embeds: [logEmbed] });
    }
});

//////////////////////////////////

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
    for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING]: The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
	const event = require(filePath);

    if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
    } else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(config.bot.token);