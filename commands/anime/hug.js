const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug another user!')
        .addUserOption(option => option.setName('user').setDescription('chose a user').setRequired(true)),
    async execute(interaction) { 
        try {
            const user = interaction.options.getUser('user');
            const response = await fetch("https://api.waifu.pics/sfw/hug");
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            const content = `<@${user.id}>`
            const embed = new EmbedBuilder()
                .setTitle('Here\'s a hug!')
                .setColor(colors.bot)
                .setImage(`${data.url}`)

            await interaction.reply({ content: content, embeds: [embed] });
        } catch(error) {
            console.error('Error fetching image:', error);
        }
    }
};
