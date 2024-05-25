import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import OpenAI from 'openai';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import dotenv from 'dotenv';
import embeds from '../../../embeds/index.js';

dotenv.config();

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API });

export default {
    data: new SlashCommandBuilder()
        .setName('chatgpt').setDescription('Ask ChatGPT a question.')
        .addStringOption(option => option.setName('question').setDescription('The question you are going to ask ChatGPT').setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        DiscordExtensions.checkIfRestricted(interaction);

        await interaction.deferReply();

        try {
            const response = await openAi.completions.create({
                model: 'gpt-3.5-turbo-instruct',
                max_tokens: 2048,
                temperature: 0.5,
                prompt: question
            });

            const embed = new EmbedBuilder()
            .setDescription(`\`\`\`${response.choices[0].text}\`\``)
            .setColor('Green');
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const stackLines = error.stack.split("\n");
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
            const errorDescription = error.message;

            const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
                errorMessage,
                errorDescription,
            });

            await interaction.editReply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
}