const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');
const config = require('../config');
const MySQL = require('../models/mysql');

module.exports = {
    name: Events.GuildEmojiDelete,
    async execute(emoji) {
        const logChannelId = await MySQL.getValueFromTableWithCondition('guilds', 'logging_channel', 'guild_id', emoji.guild.id);
        
        if (!logChannelId) {
            return;
        }

        const logChannel = emoji.guild.channels.cache.get(logChannelId);
        if (!logChannel) {
            console.log(`${logChannelId} not found.`);
            return;
        }

        const fetchedLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiDelete,
            limit: 1
        });

        const firstEntry = fetchedLogs.entries.first();
        if (!firstEntry || !firstEntry.executor) {
            return;
        }

        const executor = firstEntry.executor;

        const embed = new EmbedBuilder()
            .setTitle(`${config.emojis.warning} Emoji Created`)
            .setDescription(`> **Emoji Name:** ${emoji.name} \n> **Emoji ID:** ${emoji.id} \n> **Animated:** ${emoji.animated ? 'Yes' : 'No'} \n> **Deleted by:** <@${executor.id}>`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō', iconURL: emoji.client.user.displayAvatarURL() });

        logChannel.send({ embeds: [embed] });
        console.log(emoji)
    }
};
