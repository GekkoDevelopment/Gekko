import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql';
import fetch from 'node-fetch';
import { Http } from '../../../models/HTTP';

export default {
    data: new SlashCommandBuilder()
        .setName('battlenet-status').setDescription("Check the status of Battle.NET"),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition("guilds", "restricted_guild", "guild_id", interaction.guild.id);
        
        if (restricted === "true") {
            const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true,});
        }
    }
}