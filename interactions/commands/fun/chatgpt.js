import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import OpenAI from 'openai';
import MySQL from '../../../models/mysql.js';
import { apiKeys } from '../../../config.js';

const openAi = new OpenAI({ apiKey: apiKeys.openaiApi });

export default {
    data: new SlashCommandBuilder()
        .setName('chatgpt').setDescription('Ask ChatGPT a question.')
        .addStringOption(option => option.setName('question').setDescription('The question you are going to ask ChatGPT').setRequired(true)),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition("guilds", "restricted_guild", "guild_id", interaction.guild.id);
        const question = interaction.options.getString('question');

        if (restricted === "true") {
            const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true,});
        }

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