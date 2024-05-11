const { PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuBuilder, RoleSelectMenuBuilder } = require("discord.js");
const MySQL = require("../../../models/mysql");

module.exports = {
  data: { name: "lockdownConfigSelect" },
  async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const value = interaction.values[0];
        console.log(value)
        if (value === 'lockdownChannel') {
            const lockdownChannelsSelect = new ChannelSelectMenuBuilder()
            .setCustomId('lockdownChannelsSelect')
            .setChannelTypes('GuildText')
            .setMinValues(1)
            .setMaxValues(25)
            .setPlaceholder('✧˚ · . Select or Search for Roles');

            const actionRow1 = new ActionRowBuilder().addComponents(lockdownChannelsSelect);

            const msg = '🔍 Select, or Search for channels';
            await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
            
        }

        if (value === 'disable') {
            MySQL.deleteRow('lockdown_config', 'guild_id', interaction.guild.id);

            const disabledEmbed = embeds.get('featureDisabled')(interaction);
            await interaction.reply({ embeds: [disabledEmbed], ephemeral: true });
        }
    }
}

/*
module.exports = {
  data: { name: "lockdownConfigSelect" },
  async execute(interaction) {
        const value = interaction.values;
        await MySQL.bulkInsertOrUpdate('lockdown_config', ['guild_id', 'channel_id'], [[interaction.guild.id, value]]);

        const formattedChannels = value.map((channelId) => `<#${channelId}>`).join("\n");

        const successEmbed = embeds.get('lockdownChannelSuccess')(interaction, {formattedChannels});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
*/