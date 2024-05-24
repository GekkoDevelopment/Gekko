import { parseEmoji } from 'discord.js';
import delay from 'node:timers/promises';
import emojiRegex from 'emoji-regex';
import MySQL from './mysql.js';
import embeds from '../embeds/index.js';


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

    /**
     * Checks if a guild is restricted
     * @param {*} interaction 
     * @returns 
     */
    static async checkIfRestricted(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === "true") {
            const restrictedEmbed = embeds.get("guildRestricted")(interaction);
            return await interaction.reply({ embeds: [restrictedEmbed], ephemeral: true,});
        }

        return;
    }

    static async convertEmojiToDiscordFormat(message) {
        const regex = emojiRegex();
        let newMessage = message;
        let match;

        while (match = regex.exec(message)) {
            const emoji = match[0];
            const parsedEmoji = parseEmoji(emoji);

            if (parsedEmoji && !parsedEmoji.id) {
                const unicode = Array.from(emoji).map(char => `\\u{${char.codePointAt(0).toString(16)}}`).join('');
                newMessage = newMessage.replace(emoji, unicode);
            }
        }

        return newMessage;
    }

    static async unicodeToEmoji(message) {
        return message.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, codePoint) => {
            return String.fromCodePoint(parseInt(codePoint, 16));
        });
    }

    static async sendErrorEmbed(error, interaction) {
        const stackLines = error.stack.split("\n");
        const relevantLine = stackLines[1];
        const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
        const errorDescription = error.message;
        const catchErrorEmbed = embeds.get("tryCatchError")(interaction, { errorMessage, errorDescription,});

        await interaction.editReply({ embeds: [catchErrorEmbed], ephemeral: true });
    }
}