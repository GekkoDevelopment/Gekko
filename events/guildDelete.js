const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');
const config = require('../config.js');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {

        const guildId = guild.id;
        MySQL.deleteRow('guilds', 'guild_id', guildId);

        const guildCreateEmbed = new EmbedBuilder()
            .setTitle('I was removed from a guild')
            .setColor('Red')
            .addFields(
                {
                    name: 'Guild Name',
                    value: `${guild.name}`,
                    inline: true
                },
                {
                    name: 'Guild ID:',
                    value: `\`${guild.id}\``,
                    inline: true
                }
            )
            .setTimestamp();

        const client = guild.client
        const loggingChannelId = config.developer.devTestLogChannel
        const loggingChannel = client.channels.cache.get(loggingChannelId)
        await loggingChannel.send({ embeds: [guildCreateEmbed] })

    }
}