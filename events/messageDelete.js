const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');
const config = require('../config');
const MySQL = require('../models/mysql');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        const logChannelId = await MySQL.getValueFromTableWithCondition('guilds', 'logging_channel', 'guild_id', message.guild.id);
        const logChannel = message.guild.channels.cache.get(logChannelId);

        const fetchedLogs = await message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageDelete,
            limit: 1
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) {
            return;
        }

        const executor = firstEntry.executor;

        if (!logChannel) {
            console.log(`${logChannelId} not found.`);
            return;
        }

        const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Message Deleted`)
        .setDescription(`> **Channel:** ${message.channel} (||${message.channel.id}||) \n> **Message ID:** ${message.id} \n> **Message Author:** <@${message.author.id}>`)
        .addFields(
            {
                name: 'Message Content:',
                value: `\`\`\`${message.content}\`\`\``
            },
            {
                name: 'Deleted by:',
                value: `<@${executor.id}>`
            }
        )
        .setColor('Orange')
        .setTimestamp()
        .setThumbnail(executor.displayAvatarURL())
        .setFooter({ text: 'Gekkō', iconURL: message.client.user.displayAvatarURL() });

        logChannel.send({ embeds: [embed] });
    }
}
