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
            const embed = new EmbedBuilder()
                .setColor(colors.bot)
                .addFields(
                    {
                        name: 'Anime:',
                        value: `${quote.anime}`,
                        inline: true
                    },
                    {
                        name: 'Character:',
                        value: `${quote.character}`
                    },
                    {
                        name: 'Quote:',
                        value: `${quote.quote}`,
                        inline: true
                    }
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
