const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const MySQL = require('../../models/mysql');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-config').setDescription('Configure the bot for your guild'),
    
    async execute(interaction) {
        const configEmbed = new EmbedBuilder()
            .setTitle('Gekkō Configuration')
            .addFields(
                {
                    name: `${config.emojis.exclamationMark} Getting Started:`,
                    value: 'Use the drop-down menu below to start configuring our bot.'
                },
                {
                    name: `${config.emojis.questionMark} Further Support`,
                    value: 'For more help on setting up the bot, feel free to read our Documentation, or join our support server for help.'
                }
            )
            .setColor(colors.bot)
            .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
        
        const options = [
            {
                label: 'Moderation',
                emoji: config.emojis.configuration,
                value: 'moderation'
            },
            {
                label: 'Ticketing',
                emoji: config.emojis.configuration,
                value: 'ticketing'
            },
            {
                label: 'Welcome Messages',
                emoji: config.emojis.configuration,
                value: 'welcome'
            },
            {
                label: 'Audit Logging',
                emoji: config.emojis.configuration,
                value: 'audit logging'
            },
            {
                label: 'Fun & Misc',
                emoji: config.emojis.configuration,
                value: 'misc'
            }
        ];
        
        const documentationBtn = new ButtonBuilder()
            .setLabel('Documentation')
            .setURL('https://gekko-2.gitbook.io/gekko')
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.emojis.gekko);

        const discordBtn = new ButtonBuilder()
            .setLabel('Support Server')
            .setURL('https://discord.gg/2aw45ajSw2')
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.emojis.discord);

        const configSelect = new StringSelectMenuBuilder()
            .setCustomId('config_select')
            .setPlaceholder('Edit your configuration...')
            .addOptions(options)
        
        const actionRow = new ActionRowBuilder().addComponents(configSelect);
        const actionRow2 = new ActionRowBuilder().addComponents(discordBtn, documentationBtn);
        await interaction.reply({ embeds: [configEmbed], components: [actionRow, actionRow2] });
    }
}