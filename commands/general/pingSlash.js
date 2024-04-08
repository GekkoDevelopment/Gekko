const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('View Gekkō\'s current latency.'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
        const pingEmbed = new EmbedBuilder()
        .setTitle('🏓 Gekkō\'s Latency Data')
        .setDescription(`> ***Latency:*** \n> \`${timeDiff}ms\` \n\n> ***API Latency:*** \n> \`${Math.round(interaction.client.ws.ping)}ms\``)
        .setColor(colors.bot)
        .setFooter({ text: 'Gekko', iconURL: interaction.client.user.avatarURL()  });
        interaction.editReply({ content: " ", embeds: [pingEmbed] });
    }
};