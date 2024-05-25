import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import color from '../../../models/colors.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import dotenv from 'dotenv';
import embeds from '../../../embeds/index.js';

dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName('steam-info').setDescription("Give you your or another user's steam info. (name, hex, etc.)")
        .addStringOption(option => option.setName('username').setDescription('The user you want to look up').setRequired(true)),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);
        
        try {
            
            const username = interaction.options.getString('username');

            let option = {
                url: '',
                method: 'GET',
                headers: {
                    "Content-Type": "application/vnd.api+json",
                    Accept: "application/vnd.api+json",
                }
            }

            const steamInfoEmbed = new EmbedBuilder()
            .setTitle('Steam Information')
            .setColor(color.midnightBlue)
            .setFields
            ({
                name: 'Steam Name',
                value: ``
            },
            {
                
            },
            {
                
            },
            {
                
            },
            {
                
            })
        } catch (error) {
            const stackLines = error.stack.split("\n");
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
            const errorDescription = error.message;

            const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
                errorMessage,
                errorDescription,
            });

            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
}