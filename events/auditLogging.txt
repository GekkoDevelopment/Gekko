const { AuditLogEvent, Events, EmbedBuilder } = require('discord.js');
const colors = require('../models/colors');

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    async execute(entry) {
        
        const guild = entry.client.guilds.cache.get('1226501941249576980')

        const { executor, target, action, createdAt} = entry;

        const embed = new EmbedBuilder()
            .setTitle('Audit Log Entry Created:')
            .addFields(
                {
                    name: 'Executor:',
                    value: `${executor.tag}`,
                    inline: true
                },
                {
                    name: 'Target:',
                    value: `${target ? target.tag : 'None'}`,
                    inline: true
                },
                {
                    name: 'Action:',
                    value: `${action}`,
                    inline: true
                }
            )
            .setFooter({ text: `${createdAt.toUTCString()}` })
            .setColor(colors.bot);
        
        const loggingChannelId = '1226548220801450074';
        const loggingChannel = guild.channels.cache.get(loggingChannelId);
        if (!loggingChannel || !loggingChannel.isText()) {
            console.error('Logging channel not found or not a text channel.');
            return;
        }

        loggingChannel.send({ embeds: [embed] }).catch(error => {
            console.error('Error sending embed:', error);
        });
    }
};
