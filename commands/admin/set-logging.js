const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-logging').setDescription('Set a specific channel that contains discord logs.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to have discord logging').setRequired(true)),
    async execute(interaction) {
        const setChannel = interaction.options.getChannel('channel');
        
        const embed = new EmbedBuilder()
        .setTitle('Gekkō Logging')
        .addFields
        ({
            name: `${config.emojis.exclamationMark} Getting Started:`,
            value: 'Use the drop-down menu below to start configuring the type of logging you wish to have.'
        },
        {
            name: `${config.emojis.questionMark} Further Support`,
            value: 'For more help on setting up the bot, feel free to read our Documentation, or join our support server for help.'
        })
        .setColor(colors.bot)
        .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
        
        const options = [
            {
                label: 'Moderation',
                emoji: config.emojis.configuration,
                value: 'mod'
            },
            {
                label: 'Ticketing',
                emoji: config.emojis.configuration,
                value: 'ticket'
            },
            {
                label: 'Commands',
                emoji: config.emojis.configuration,
                value: 'command'
            },
            {
                label: 'Messages',
                emoji: config.emojis.configuration,
                value: 'message'
            },
            {
                label: 'Audit Logs',
                emoji: config.emote,
                value: 'audit'
            },
            {
                label: 'All',
                emoji: config.emojis.configuration,
                value: 'all'
            }
        ];

        const logSelect = new StringSelectMenuBuilder()
        .setCustomId('config_logging')
        .setPlaceholder('Type of logging.')
        .addOptions(options);

        const actionRow = new ActionRowBuilder().addComponents(logSelect);
        await interaction.reply({ embeds: [embed], components: [actionRow] });

        const filter = i => i.customId === 'config_logging' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: null, max: 1 });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                return;
            }

            const value = collected.values[0];

            try {
                switch (value) {
                    case 'mod':
                        const logReplyMod = new EmbedBuilder()
                        .setDescription(`Ok! Logging for Moderation has been enabled and the logging channel is set to ${setChannel}`)
                        .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                        
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', interaction.channel.id);
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'log_type', interaction.customId);

                        interaction.editReply({ embeds: [logReplyMod] });
                        break;
                        
                    case 'ticket':
                        const logReplyTicket = new EmbedBuilder()
                        .setDescription(`Ok! Logging for tickets has been enabled and the logging channel is set to ${setChannel}`)
                        .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                        
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', interaction.channel.id);
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'log_type', interaction.customId);

                        interaction.editReply({ embeds: [logReplyTicket] });
                        break;

                    case 'message':
                        const logReplyMessage = new EmbedBuilder()
                        .setDescription(`Ok! Logging for messages has been enabled and the logging channel is set to ${setChannel}`)
                        .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                        
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', interaction.channel.id);
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'log_type', interaction.customId);

                        interaction.editReply({ embeds: [logReplyMessage] });
                        break;
                        
                    case 'auditLogging':
                        const logReplyAudit = new EmbedBuilder()
                        .setDescription(`Ok! Logging for audit logs has been enabled and the logging channel is set to ${setChannel}`)
                        .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                        
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', interaction.channel.id);
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'log_type', interaction.customId);

                        interaction.editReply({ embeds: [logReplyAudit] });
                        break;

                    case 'all':
                        const logReplyAll = new EmbedBuilder()
                        .setDescription(`Ok! All logging has been enabled and the logging channel is set to ${setChannel}`)
                        .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                        
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', interaction.channel.id);
                        await MySQL.editColumnInGuilds(interaction.guild.id, 'log_type', interaction.customId);

                        interaction.editReply({ embeds: [logReplyAll] });
                        break;
                        
                    default:
                        break;
                }
            } catch (error) {
                const stackLines = error.stack.split('\n');
                const relevantLine = stackLines[1];
                const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
                const errorDescription = error.message;

                const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
                
                await interaction.channel.send({ embeds: [catchErrorEmbed] });
            }
        });
    }
}