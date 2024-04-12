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
                .setDescription(`<@${interaction.user.id}> hugged <@${user.id}>`)
                .setColor(colors.bot)
                .setImage(`${data.url}`)

            await interaction.reply({ content: content, embeds: [embed] });
        } catch(error) {
            const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${error}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
            await interaction.reply({ embeds: [catchErrorEmbed] });
        }
    }
};
