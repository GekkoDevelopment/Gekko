const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonComponent } = require('discord.js');
const pInterval = require('interval-promise');
const MySQL = require('../../models/mysql');
const Tetris = require('../../models/tetrisGame');

const squareMap = new Map([
    ["red", "🟥"],
    ["blue", "🟦"],
    ["cyan", "🟦"],
    ["orange", "🟧"],
    ["yellow", "🟨"],
    ["green", "🟩"],
    ["magenta", "🟪"],
    ["black", "⬛"],
    ["white", "⬜"],
]);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tetris').setDescription('Play a game of tetris.'),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50105')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYour guild has been banned by Gekkō Development. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
        const leftButton = new ButtonBuilder().setCustomId('tetrisMoveLeftBtn').setLabel('←').setStyle(ButtonStyle.Primary);
        const rightButton = new ButtonBuilder().setCustomId('tetrisMoveLeftBtn').setLabel('→').setStyle(ButtonStyle.Primary);
        const hardDropButton = new ButtonBuilder().setCustomId('tetrisMoveLeftBtn').setLabel('↓').setStyle(ButtonStyle.Primary);
        const rotateButton = new ButtonBuilder().setCustomId('tetrisMoveLeftBtn').setLabel('↻').setStyle(ButtonStyle.Primary);

        const blockedButton1 = new ButtonBuilder().setCustomId('tetrisBlocked1').setDisabled(true);
        const blockedButton2 = new ButtonBuilder().setCustomId('tetrisBlocked2').setDisabled(true);
        
        const actionRow = new ActionRowBuilder().addComponents(leftButton, rotateButton, rightButton);
        const actionRow2 = new ActionRowBuilder().addComponents(blockedButton1, hardDropButton, blockedButton2);
    }
}