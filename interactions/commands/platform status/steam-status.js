import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import { Http } from '../../../models/HTTP';

export default {
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