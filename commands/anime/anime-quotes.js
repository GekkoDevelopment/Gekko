const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime-quote')
        .setDescription('Get a random Anime Quote.'),
    async execute(interaction) { 
        try {
            const response = await fetch("https://animechan.xyz/api/random");
            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }
            const quote = await response.json();
            const colorsArray = Object.entries(colors);
            const randomColorIndex = Math.floor(Math.random() * colorsArray.length);
            const randomColor = colorsArray[randomColorIndex][1];
            const embed = new EmbedBuilder()
                .setColor(randomColor)
                .addFields(
                    {
                        name: '<:keqingheart:1228074361311858810> Anime Quote:',
                        value: `\`\`\`\n${quote.quote}\`\`\``,
                        inline: false
                    },
                    {
                        name: 'Anime:',
                        value: `${quote.anime}`,
                        inline: true
                    },
                    {
                        name: 'Character:',
                        value: `${quote.character}`,
                        inline: true
                    },

                )

            await interaction.reply({ embeds: [embed] });

        } catch(error) {
            const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${error}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
            await interaction.reply({ embeds: [catchErrorEmbed] });
        }
    }
};
