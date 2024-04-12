const { Events, EmbedBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const guildId = member.guild.id;

        const welcomeMessage = await MySQL.getColumnValuesWithGuildId(guildId, 'welcome_message')
        const imageUrl = await MySQL.getColumnValuesWithGuildId(guildId, 'image_url');
        const welcomeChannelId = await MySQL.getColumnValuesWithGuildId(guildId, 'welcome_channel_id');

        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        if (!welcomeChannel) return;

        const joinMessage = new EmbedBuilder()
        .setTitle('Welcome!')
        .setDescription(welcomeMessage.toString())
        .setImage(imageUrl);

        const content = `Welcome to the server, <@${member.user.id}>!`; 

        welcomeChannel.send({ content: content, embeds: [joinMessage] })
        .catch(err => console.error('Error sending welcome message:', err));
    }
};