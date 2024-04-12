const { Events, EmbedBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const welcomeMessage = MySQL.getValueFromGuilds(member.guild.id, 'welcome_message')
        const imageUrl = MySQL.getValueFromGuilds(member.guild.id, 'image_url');
        const welcomeChannelId = MySQL.getValueFromGuilds(member.guild.id, 'welcome_channel_id');

        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        if (!welcomeChannel) return;
        if (!welcomeMessage === null || welcomeChannelId === null) return;

        const joinMessage = new EmbedBuilder()
        .setTitle('Welcome!')
        .setDescription(welcomeMessage)
        .setImage(imageUrl)

        const content = `Welcome to the server, <@${member.user.id}>!`; 

        welcomeChannel.send({ content: content, embeds: [joinMessage] })
        .catch(err => console.error('Error sending welcome message:', err));
    }
};