const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const MySQL = require('../../../models/mysql');
const colors = require('../../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots').setDescription('Play some slots and see if you can win a prize.')
        .addIntegerOption(option => option.setName('amount').setDescription('the amount of money you want to play with.')),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = embeds.get('guildRestricted')(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
    }
}