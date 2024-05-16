import delay from 'node:timers/promises';
import { GuildBan } from 'discord.js';
import MySQL from './mysql';
client.embeds = require('../embeds');

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
        const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
        
        interaction.deferReply();

        if (restricted === 'true') {
            return await interaction.editReply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        return;
    }

    static async checkIfRestricted(message) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', message.guild.id);
        const permissionErrorEmbed = embeds.get("guildRestricted")(message);
        
        if (restricted === 'true') {
            return await message.channel.send({ embeds: [permissionErrorEmbed] });
        }

        return;
    }
}