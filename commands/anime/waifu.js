const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu').setDescription('Random waifu generator!'),
    async execute(interaction) { 
        try {
            const response = await fetch("https://api.waifu.pics/sfw/waifu");
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            const embed = new EmbedBuilder()
                .setTitle('Waifu!')
                .setColor(colors.bot)
                .setImage(`${data.url}`)

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
