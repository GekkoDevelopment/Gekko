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

        collector.on('collect', async interaction => {
            console.log(interaction.values[0])
            const value = interaction.values[0];
            try {
                if (value === 'general_commands') {
                    await interaction.deferUpdate();
                    const gCom = new EmbedBuilder()
                    .setTitle('General Commands:')
                    .addFields(
                        { name: 'Commands', value: 'Help \nPing \nBug Report \nGekko', inline: true },
                        { name: 'Usage:', value: '`!help`, `/help` \n`!ping`, `/ping` \n`!bugreport`, `/bug-report` \n`!gekko`, `/gekko`', inline: true },
                    )
                    .setImage(config.assets.gekkoBanner);
                    
                    await interaction.editReply({ embeds: [gCom], components: [actionRow] });

                } if (value === 'admin_commands') {
                    await interaction.deferUpdate();
                    const aCom = new EmbedBuilder()
                    .setTitle('Admin Commands:')
                    .addFields
                    (
                        { name: 'Commands', value: 'Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko', inline: true },
                        { name: 'Commands', value: '/set-logging-channel \n!set-prefix \n/set-welcome \nGekko', inline: true }
                    )
                    .setImage(config.assets.gekkoBanner);
                    
                    await interaction.editReply({ embeds: [aCom], components: [actionRow] });

                } if (value === 'moderation_commands') {
                    await interaction.deferUpdate();
                    const mCom = new EmbedBuilder()
                    .setTitle('Moderation Commands:')
                    .addFields
                    (
                        { name: 'Commands', value: 'Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko', inline: true },
                        { name: 'Commands', value: '/set-logging-channel \n!set-prefix \n/set-welcome \nGekko', inline: true }
                    )
                    .setImage(config.assets.gekkoBanner);
                    
                    await interaction.editReply({ embeds: [mCom], components: [actionRow] });
                
                } if (value === 'anime_commands') {
                    await interaction.deferUpdate();
                    const animCom = new EmbedBuilder()
                    .setTitle('Anime Commands:')
                    .addFields
                    (
                        { name: 'Commands', value: 'Anime Character \nAnime Info \nAnime Quotes \nHug \nWaifu', inline: true },
                        { name: 'Commands', value: '/anime-character \n!anime-info \n/anime-quotes \n/hug \n/waifu', inline: true },
                     )
                    .setImage(config.assets.gekkoBanner);
                    
                    await interaction.editReply({ embeds: [animCom], components: [actionRow] });

                } if (value === 'minigame_commands') {
                    await interaction.deferUpdate();
                    const miniCom = new EmbedBuilder()
                    .setTitle('Minigame Commands:')
                    .addFields
                    (
                        { name: 'Commands', value: 'Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko', inline: true },
                        { name: 'Commands', value: '/set-logging-channel \n!set-prefix \n/set-welcome \nGekko', inline: true }
                    )
                    .setImage(config.assets.gekkoBanner);
                    
                    await interaction.editReply({ embeds: [miniCom], components: [actionRow] });
                
                } if (value === 'fun_commands') {
                    await interaction.deferUpdate();
                    const fCom = new EmbedBuilder()
                    .setTitle('Fun Commands:')
                    .addFields
                    (
                        { name: 'Commands', value: 'Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko', inline: true },
                        { name: 'Commands', value: '/set-logging-channel \n!set-prefix \n/set-welcome \nGekko', inline: true }
                    )
                    .setImage(config.assets.gekkoBanner);
                    
                    await interaction.editReply({ embeds: [fCom], components: [actionRow] }); 
                }
                
            } catch (error) {
                const stackLines = error.stack.split('\n');
                const relevantLine = stackLines[1];
                const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
                const errorDescription = error.message;

                const catchErrorEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.warning} Unexpected Error:`)
                .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
            }
        });
    }
};
