const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');
const config = require('../config');
const MySQL = require('../models/mysql');

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        const loggingType = await MySQL.getValueFromTableWithCondition('guilds', 'logging_type', 'guild_id', channel.guild.id);
        
        if (!loggingType) {
            return;
        }

        else if (loggingType === 'all' || loggingType === 'auditLogging' ) {

            const logChannelId = await MySQL.getValueFromTableWithCondition('guilds', 'logging_channel', 'guild_id', channel.guild.id);
            const logChannel = channel.guild.channels.cache.get(logChannelId);

            if (!logChannel) {
                console.log(`${logChannelId} not found.`);
                return;
            }

            if (channel.type === 0) {
                const fetchedLogs = await channel.guild.fetchAuditLogs({
                    type: AuditLogEvent.ChannelCreate,
                    limit: 1
                });

                const firstEntry = fetchedLogs.entries.first();
                if (!firstEntry || !firstEntry.executor) {
                    return;
                }

                const executor = firstEntry.executor;

                const embed = new EmbedBuilder()
                    .setTitle(`${config.emojis.warning} Text Channel Deleted`)
                    .setDescription(`> **Channel Name:** ${channel.name} (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Deleted by:** <@${executor.id}>`)
                    .setColor('Red')
                    .setTimestamp()
                    .setThumbnail(executor.displayAvatarURL())
                    .setFooter({ text: 'Gekkō', iconURL: channel.client.user.displayAvatarURL() });

                logChannel.send({ embeds: [embed] });
            }

            if (channel.type === 2) {
                const fetchedLogs = await channel.guild.fetchAuditLogs({
                    type: AuditLogEvent.ChannelCreate,
                    limit: 1
                });

                const firstEntry = fetchedLogs.entries.first();
                if (!firstEntry || !firstEntry.executor) {
                    return;
                }

                const executor = firstEntry.executor;

                const embed = new EmbedBuilder()
                    .setTitle(`${config.emojis.warning} Voice Channel Deleted`)
                    .setDescription(`> **Channel Name:** ${channel.name} (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Rtc Region:** ${channel.rtcRegion} \n> **Bit Rate:** ${channel.bitrate} \n> **User Limit:** ${channel.userLimit} \n> **Deleted by:** <@${executor.id}>`)
                    .setColor('Red')
                    .setTimestamp()
                    .setThumbnail(executor.displayAvatarURL())
                    .setFooter({ text: 'Gekkō', iconURL: channel.client.user.displayAvatarURL() });

                logChannel.send({ embeds: [embed] });
            }

            if (channel.type === 15) {
                const fetchedLogs = await channel.guild.fetchAuditLogs({
                    type: AuditLogEvent.ChannelCreate,
                    limit: 1
                });

                const firstEntry = fetchedLogs.entries.first();
                if (!firstEntry || !firstEntry.executor) {
                    return;
                }

                const executor = firstEntry.executor;

                const embed = new EmbedBuilder()
                    .setTitle(`${config.emojis.warning} Forum Channel Deleted`)
                    .setDescription(`> **Channel Name:** ${channel.name} (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Channel Tags:** ${channel.availableTags} \n> **Channel Default Emoji:** ${channel.defaultReactEmoji || 'None'} \n> **Deleted by:** <@${executor.id}>`)
                    .setColor('Red')
                    .setTimestamp()
                    .setThumbnail(executor.displayAvatarURL())
                    .setFooter({ text: 'Gekkō', iconURL: channel.client.user.displayAvatarURL() });

                logChannel.send({ embeds: [embed] });
            }   

            if (channel.type === 5) {
                const fetchedLogs = await channel.guild.fetchAuditLogs({
                    type: AuditLogEvent.ChannelCreate,
                    limit: 1
                });

                const firstEntry = fetchedLogs.entries.first();
                if (!firstEntry || !firstEntry.executor) {
                    return;
                }

                const executor = firstEntry.executor;

                const embed = new EmbedBuilder()
                    .setTitle(`${config.emojis.warning} Announcement Channel Deleted`)
                    .setDescription(`> **Channel Name:** ${channel.name} (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Deleted by:** <@${executor.id}>`)
                    .setColor('Red')
                    .setTimestamp()
                    .setThumbnail(executor.displayAvatarURL())
                    .setFooter({ text: 'Gekkō', iconURL: channel.client.user.displayAvatarURL() });

                logChannel.send({ embeds: [embed] });
            }

            if (channel.type === 13) {
                const fetchedLogs = await channel.guild.fetchAuditLogs({
                    type: AuditLogEvent.ChannelDelete,
                    limit: 1
                });

                const firstEntry = fetchedLogs.entries.first();
                if (!firstEntry || !firstEntry.executor) {
                    return;
                }

                const executor = firstEntry.executor;

                const embed = new EmbedBuilder()
                    .setTitle(`${config.emojis.warning} Stage Channel Deleted`)
                    .setDescription(`> **Channel Name:** ${channel.name} (||${channel.id}||) \n> **Channel Topic:** ${channel.topic} \n> **NSFW Status:** ${channel.nsfw} \n> **Category:** <#${channel.parentId}> \n> **Raw Position:** ${channel.rawPosition} \n> **Rtc Region:** ${channel.rtcRegion} \n> **Bit Rate:** ${channel.bitrate} \n> **User Limit:** ${channel.userLimit} \n> **Deleted by:** <@${executor.id}>`)
                    .setColor('Red')
                    .setTimestamp()
                    .setThumbnail(executor.displayAvatarURL())
                    .setFooter({ text: 'Gekkō', iconURL: channel.client.user.displayAvatarURL() });

                logChannel.send({ embeds: [embed] });   
            }

        }
    }
}