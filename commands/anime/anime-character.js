const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');
const { emojis } = require('../../config');
const animeInfo = require('./anime-info');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime-character')
        .setDescription('Look up information about a specific anime character.')
        .addStringOption(option => option.setName('character').setDescription('The anime character to get information from.').setRequired(true)),
    async execute(interaction) {
        try {
            const characterName = interaction.options.getString('character');
            let option = {
                url: `https://kitsu.io/api/edge/characters?filter[name]=${characterName}`,
                method: `GET`,
                headers: {
                    'Content-Type': "application/vnd.api+json",
                    'Accept': "application/vnd.api+json",
                }
            };
            
            const response = await fetch(option.url, option);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const characterInfo = data.data[0]; 
            
                const embed = new EmbedBuilder()
                    .setTitle(`${characterInfo.attributes.canonicalName}`)
                    .setColor(colors.bot)
                    .setImage(characterInfo.attributes.image.original)
                    .setFooter({text: characterInfo.attributes.slug || 'No slug data', iconURL: interaction.client.user.avatarURL() });
                
                await interaction.reply({ embeds: [embed] });
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Search Error:')
                    .setColor('Red')
                    .setDescription('No character found with that name.')
                await interaction.reply({ embeds: [errorEmbed] });
            }
        } catch(error) {
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle('Unexpected Error:')
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    },
};