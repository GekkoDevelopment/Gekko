const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../../models/mysql.js');
const { emojis } = require('../../../config.js');
const delay = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown-config').setDescription('Add lockdown channels')
        .addStringOption(option => option.setName('channels').setDescription('Enter the channels you want to be able to lockdown').setRequired(true)),
    
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = embeds.get('guildRestricted')(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get('permissionsError')(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get('botPermissionsError')(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const channelsInput = interaction.options.getString('channels')
        const channelIds = channelsInput.match(/\d+/g);

        await MySQL.insertValueIfNotExists('lockdown_config', 'guild_id', interaction.guild.id);
        await delay(1000);
        await MySQL.updateValueInTableWithCondition('lockdown_config', 'channel_id', channelIds.toString(), 'guild_id', interaction.guild.id);


        const savedChannelIds = await MySQL.getValueFromTableWithCondition('lockdown_config', 'channel_id', 'guild_id', interaction.guild.id);
        const channelIdsArray = savedChannelIds.split(',');
        const formattedChannels = channelIdsArray.map(channelId => `<#${channelId}>`).join('\n');


        const successEmbed = new EmbedBuilder()
            .setTitle(`${emojis.passed} Lockdown Channels successfully set`)
            .setDescription(`${formattedChannels}`)
            .setColor('Green')
            .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [successEmbed] })
    }
}