const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.js');
const colors = require('../../models/colors.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help').setDescription('View Gekkō\'s command library.'),
    async execute(interaction) {
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

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('command_select')
            .setPlaceholder('Select a category')
            .addOptions(options);

        const actionRow = new ActionRowBuilder().addComponents(selectMenu);

        const helpEmbed = new EmbedBuilder()
            .setTitle('Gekkō Command Library')
            .setDescription('Please select a category from the dropdown menu below:')
            .setColor(colors.bot)
            .setImage(config.assets.gekkoBanner);

        await interaction.reply({ embeds: [helpEmbed], components: [actionRow] });

        const filter = i => i.customId === 'command_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: null,
            max: 1
        });

        collector.on('end', async collected => {
            const value = collected.first().values[0];
            try {
                switch (value) {
                    case 'general_commands':
                        const gCom = new EmbedBuilder()
                        .setTitle('General Commands:')
                        .addFields(
                            { name: 'Commands', value: 'Help \nPing \nBug Report \nGekko', inline: true },
                            { name: 'Usage:', value: '`!help`, `/help` \n`!ping`, `/ping` \n`!bugreport`, `/bug-report` \n`!gekko`, `/gekko`', inline: true },
                        )
                        .setImage(config.assets.gekkoBanner);
                        
                        await interaction.editReply({ embeds: [gCom], components: [actionRow], ephemeral: true });
                    break;
                    
                    case 'admin_commands':
                        const aCom = new EmbedBuilder()
                        .setTitle('Admin Commands:')
                        .addFields
                        (
                            { name: 'Commands', value: 'Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko', inline: true },
                            { name: 'Commands', value: '/set-logging-channel \n!set-prefix \n/set-welcome \nGekko', inline: true }
                        )
                        .setImage(config.assets.gekkoBanner);
                        
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
                const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${error}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
                await interaction.editReply({ embeds: [catchErrorEmbed] });
            }
        });
    }
};
