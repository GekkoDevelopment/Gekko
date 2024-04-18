const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown-config').setDescription('Add lockdown channels')
        .addStringOption(option => option.setName('channels').setDescription('Enter the channels you want to be able to lockdown').setRequired(true)),
    
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action```',
                    inline: true
                }
            )
            .setColor('Red');
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
            .setColor('Red');
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }


        const channelsInput = interaction.options.getString('channels')
        const channelIds = channelsInput.match(/\d+/g);

        await MySQL.editColumnValue('lockdown_config', 'guild_id', interaction.guild.id);
        await MySQL.editColumnValue('lockdown_config', 'channel_id', channelIds.toString());

        const savedChannelIds = await MySQL.getValueFromTableWithCondition('lockdown_config', 'channel_id', 'guild_id', interaction.guild.id);
        const channelIdsArray = savedChannelIds.split(',');
        const formattedChannels = channelIdsArray.map(channelId => `<#${channelId}>`).join('\n');


        const successEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.passed} Lockdown Channels Set`)
            .setDescription(`${formattedChannels}`)
            .setColor(colors.bot)
            .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [successEmbed] })
    }
}