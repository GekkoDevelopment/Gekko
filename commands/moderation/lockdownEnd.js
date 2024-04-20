const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../models/mysql.js');
const config = require('../../config.js');
const colors = require('../../models/colors.js');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown-end').setDescription('End Lockdown'),
    
    async execute(interaction) {
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
        
        try {

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Permissions Error: 50013')
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nYou lack permissions to perform that action```',
                        inline: true
                    }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
            }
    
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Permissions Error: 50013')
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nI lack permissions to perform that action \nPlease check my permissions, or reinvite me to use my default permissions.```',
                        inline: true
                    }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
            }

            const channelIds = await MySQL.getValueFromTableWithCondition('lockdown_config', 'channel_id', 'guild_id', interaction.guild.id);
    
            const channelIdsArray = channelIds.split(',');
            const affectedChannels = [];
    
            for (const channelId of channelIdsArray) {
                const channel = interaction.guild.channels.cache.get(channelId);
                if (channel) {
                    await channel.permissionOverwrites.edit(interaction.guild.id, {
                        SendMessages: true
                    });
                    affectedChannels.push(`<#${channel.id}>`);
                } else {
                    console.log(`Channel with ID ${channelId} not found.`);
                }
            }
            const successEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.passed} Lockdown Ended`)
                .setDescription(`> Your server has been unlocked.`)
                .addFields(
                    {
                        name: 'Affected Channels',
                        value: affectedChannels.join('\n')
                    },
                    {
                        name: `Invoked by:`,
                        value: `<@${interaction.user.id}>`
                    }
                )
                .setColor('Green')
                .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed] })

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
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
}