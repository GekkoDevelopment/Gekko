const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../../models/mysql');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steam-status').setDescription("Check the status of Steam."),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition("guilds", "restricted_guild", "guild_id", interaction.guild.id);
        
        if (restricted === "true") {
            const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true,});
        }

    }
}