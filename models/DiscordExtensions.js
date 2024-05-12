import delay from 'node:timers/promises';
import { GuildBan } from 'discord.js';

export class DiscordExtensions {
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
    static banUser(userId, reason) {
        user: (interaction) => {
            const guildId = interaction.guild.id;
        }
    }
}