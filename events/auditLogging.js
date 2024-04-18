const { AuditLogEvent, Events, EmbedBuilder } = require('discord.js');
const colors = require('../models/colors');
const MySQL = require('../models/mysql');

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    async execute(entry) {
        const logChannel = MySQL.getValueFromTableWithCondition('guilds', 'logging_channel', 'guild_id', entry.guild.id);
        const logType = await MySQL.getValueFromTableWithCondition('guilds', 'log_type', 'guild_id', entry.guild.id);

        const channel = entry.guild.channels.cache.get(logChannel.toString())
        const target = entry.users.fetch(entry.targetId);
        const executer = entry.users.fetch(entry.executerId);

        if (logType.toString() === 'mod') {

            if (entry.action === AuditLogEvent.MemberKick) {
                const embed = new EmbedBuilder()
                .setTitle('Member Kicked')
                .setColor(colors.bot)
                .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() })
                .addFields
                ({
                    name: 'Target',
                    value: `${target}`,
                    inline: true
                },
                {
                    name: 'Target ID',
                    value: `${target.id}`,
                    inline: true
                },
                {
                    name: 'Executer',
                    value: `${executer}`,
                    inline: true
                },
                {
                    name: 'Reason',
                    value: `${entry.reason}` || 'No Reason Provided.',
                    inline: true        
                });
                
                channel.send({ embeds: [embed] });
            }

            if (entry.action === AuditLogEvent.MemberBanAdd) {
                const embed = new EmbedBuilder()
                .setTitle('Member Banned')
                .setColor(colors.bot)
                .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() })
                .addFields
                ({
                    name: 'Target',
                    value: `${target}`,
                    inline: true
                },
                {
                    name: 'Target ID',
                    value: `${target.id}`,
                    inline: true
                },
                {
                    name: 'Executer',
                    value: `${executer}`,
                    inline: true
                },
                {
                    name: 'Reason',
                    value: `${entry.reason}` || 'No Reason Provided.',
                    inline: true        
                });
                
                channel.send({ embeds: [embed] });
            }
        } else {
            return;
        }
    }
};
