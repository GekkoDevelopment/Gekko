const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { NodeactylClient } = require('nodeactyl');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.js');
const color = require('./models/colors.js');
const utils = require('./models/utility.js');

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true}
});

const pterodactyl = new NodeactylClient(config.panel.host, config.panel.apiKey);

//////// Prefix Commands ////////
// --- Developer Commands --- //
client.on('messageCreate', async message => {
    let prefix = "-d"
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === 'bot-restart') {
        if (message.guild.id !== config.developer.devGuild) return;

        message.channel.send('Gekkō is now restarting; this will take a few seconds...');
        let logChannel = client.guilds.cache.get(config.developer.devGuild).channels.cache.get(config.developer.devTestChannel);

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
        if (message.guild.id !== '1226501941249576980' || message.channel.id === config.developer) return;

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

    let userPrefix = '!';
    if (!message.content.startsWith(userPrefix) || message.author.bot) return;

    const userArgs = message.content.slice(userPrefix.length).split(/ +/);
    const userCommand = args.shift().toLocaleLowerCase();

    if (userCommand === 'help') {
        const options = [
            {
                label: 'General Commands',
                emoji: '1️⃣',
                value: 'general_commands'
            },
            {
                label: 'Admin Commands',
                emoji: '2️⃣',
                value: 'admin_commands'
            },
            {
                label: 'Moderation Commands',
                emoji: '3️⃣',
                value: 'moderation_commands'
            },
            {
                label: 'Anime Commands',
                emoji: '4️⃣',
                value: 'anime_commands'
            },
            {
                label: 'Minigame Commands',
                emoji: '5️⃣',
                value: 'minigame_commands'
            },
            {
                label: 'Fun Commands',
                emoji: '6️⃣',
                value: 'fun_commands'
            }
        ];
        
        let selectMenu = new StringSelectMenuBuilder()
            .setCustomId('command_select_prefix')
            .setPlaceholder('Select a category')
            .addOptions(options);

        const actionRow = new ActionRowBuilder().addComponents(selectMenu);

        const helpEmbed = new EmbedBuilder()
            .setTitle('Gekkō Command Library')
            .setDescription('Please select a category from the dropdown menu below:')
            .setColor('#7B598D')
            .setImage('https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&');

        await message.channel.send({ embeds: [helpEmbed], components: [actionRow] });
        
        const filter = i => i.customId === 'command_select_prefix' && i.user.id === message.author.id;
        const collector = message.channel.createMessageCollector({
            filter,
            time: null,
            max: 1
        });

        collector.on('end', async collected => {
            const val = collected.first().values[0];

            try {
                switch (val) {
                    case 'general_commands':
                        const gCom = new EmbedBuilder()
                        .setTitle('General Commands:')
                        .addFields(
                            { name: 'Commands', value: 'Help \nPing \nBug Report \nGekko', inline: true },
                            { name: 'Usage:', value: '`!help`, `/help` \n`!ping`, `/ping` \n`!bugreport`, `/bug-report` \n`!gekko`, `/gekko`', inline: true },
                        )
                        .setImage('https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&');
                        
                        await interaction.editReply({ embeds: [gCom], components: [actionRow] });
                    break;
                    
                    case 'admin_commands':
                        const aCom = new EmbedBuilder()
                        .setTitle('Admin Commands:')
                        .addFields
                        (
                            { name: 'Commands', value: 'Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko', inline: true },
                            { name: 'Commands', value: '/set-logging-channel \n!set-prefix \n/set-welcome \nGekko', inline: true }
                        )
                        .setImage('https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&');
                        
                        await interaction.editReply({ embeds: [aCom], components: [actionRow] });
                        break;
    
                    case 'moderation_commands':
                        break;
    
                    case 'anime_commands':
                        break;
    
                    case 'minigame_commands':
                        break;
    
                    case 'fun_commands':
                        break;
    
                    default:
                        break;
                }
            } catch (err) {
                // do nothing
            }
        });
    }

    if (userCommand === 'bugreport' || userCommand === 'bug') {
        
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