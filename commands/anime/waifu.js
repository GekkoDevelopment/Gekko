const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Rnadom waifu generator!'),
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
            console.error('Error fetching image:', error);
        }
    }
};
