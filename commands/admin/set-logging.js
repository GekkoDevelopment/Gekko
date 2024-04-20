const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, PermissionFlagsBits, ALLOWED_SIZES } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-logging').setDescription('Set a specific channel that contains discord logs.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to have discord logging').setRequired(true)),
    async execute(interaction) {
        const setChannel = interaction.options.getChannel('channel');
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50105')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYour guild has been banned by Gekkō Development. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou need the MANAGE_GUILD permission to use this command.```',
                    inline: true
                }
            )
            .setColor('Red')
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
        return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nI need the VIEW_AUDIT_LOG permission to use this command.```',
                    inline: true
                }
            )
            .setColor('Red')
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

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
                emoji: config.emojis.configuration,
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
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: null, max: null });

        collector.on('collect', async interaction => {
            const value = interaction.values[0];

            try {
                if (value === 'mod') {
                    await interaction.deferUpdate();
                    const logReplyMod = new EmbedBuilder()
                    .setTitle(`${config.emojis.passed} Logging Channel Set`)
                    .setColor('Green')
                    .setDescription(`Ok! Logging for Moderation has been enabled and the logging channel is set to ${setChannel}`)
                    .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                    
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', setChannel.id);
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_type', interaction.customId);

                    interaction.editReply({ embeds: [logReplyMod] });

                } if (value === 'ticket') {
                    await interaction.deferUpdate();    
                    const logReplyTicket = new EmbedBuilder()
                    .setTitle(`${config.emojis.passed} Logging Channel Set`)
                    .setColor('Green')
                    .setDescription(`Ok! Logging for tickets has been enabled and the logging channel is set to ${setChannel}`)
                    .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                    
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', setChannel.id);
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_type', interaction.customId);

                    interaction.editReply({ embeds: [logReplyTicket] });

                } if (value === 'message') {
                    await interaction.deferUpdate();
                    const logReplyMessage = new EmbedBuilder()
                    .setTitle(`${config.emojis.passed} Logging Channel Set`)
                    .setColor('Green')
                    .setDescription(`Ok! Logging for messages has been enabled and the logging channel is set to ${setChannel}`)
                    .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                    
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', setChannel.id);
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_type', interaction.customId);

                    interaction.editReply({ embeds: [logReplyMessage] });

                } if (value === 'auditLogging') {
                    await interaction.deferUpdate();
                    const logReplyAudit = new EmbedBuilder()
                    .setTitle(`${config.emojis.passed} Logging Channel Set`)
                    .setColor('Green')
                    .setDescription(`Ok! Logging for audit logs has been enabled and the logging channel is set to ${setChannel}`)
                    .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                    
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', setChannel.id);
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_type', interaction.customId);

                    interaction.editReply({ embeds: [logReplyAudit] });

                } if (value === 'all') {
                    await interaction.deferUpdate();
                    const logReplyAll = new EmbedBuilder()
                    .setTitle(`${config.emojis.passed} Logging Channel Set`)
                    .setColor('Green')
                    .setDescription(`Ok! All logging has been enabled and the logging channel is set to ${setChannel}`)
                    .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                    
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', setChannel.id);
                    await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_type', interaction.customId);

                    interaction.editReply({ embeds: [logReplyAll] });
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
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                
                await interaction.channel.send({ embeds: [catchErrorEmbed] });
            }
        });
    }
}