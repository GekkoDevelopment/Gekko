import delay from 'node:timers/promises';
import { GuildBan } from 'discord.js';
import MySQL from './mysql.js';

export default class DiscordExtensions {
    
    /**
     * Delay an action before moving on to the next piece of code.
     * @param {string} ms 
     */
    static Delay(ms) {
        delay.setTimeout(ms);
    }

    /**
     * Logs Discord errors.
     * @param {string} error 
     */
    static logError(error) {
        console.error(error);
    }
    
    /**
     * Ban a user from discord server.
     * @param {string} userId 
     * @param {string} reason 
     */
    static banUser(userId, reason, interaction) {
        user: (interaction) => {
            const guildId = interaction.guild.id;
        }

    }

    static async checkIfRestricted(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === "true") {
            const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true,});
        }

        return;
    }
}