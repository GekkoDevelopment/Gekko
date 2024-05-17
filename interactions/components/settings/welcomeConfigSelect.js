import { PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';

export default {
  data: { name: "welcomeConfigSelect" },
  async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const value = interaction.values[0];
        if (value === 'welcomeMsg') {

            const welcomeMsgModal = new ModalBuilder()
            .setCustomId('welcomeMsgModal')
            .setTitle('Custom Welcome Message');

            const messageInput = new TextInputBuilder()
            .setCustomId('welcomeMsgInput')
            .setLabel('What would you like to say?')
            .setMinLength(7)
            .setMaxLength(3000)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

            const welcomeMsgRow = new ActionRowBuilder().addComponents(messageInput);
            welcomeMsgModal.addComponents(welcomeMsgRow);
            await interaction.showModal(welcomeMsgModal);
        }

        if (value === 'welcomeImg'){

            const welcomeImgModal = new ModalBuilder()
            .setCustomId('welcomeImgModal')
            .setTitle('Custom Welcome Image');

            const imgInput = new TextInputBuilder()
            .setCustomId('welcomeImgInput')
            .setLabel('Please use an image URL')
            .setMinLength(7)
            .setMaxLength(1000)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

            const welcomeImgRow = new ActionRowBuilder().addComponents(imgInput);
            welcomeImgModal.addComponents(welcomeImgRow);
            await interaction.showModal(welcomeImgModal);
        }

        if (value === 'welcomeChannel') {
            const msg = "🔍 Select, or Search for a channel";
            const welcomeChannelSelect = new ChannelSelectMenuBuilder()
            .setCustomId('welcomeChannelSelect')
            .setPlaceholder('✧˚ · . Welcome Channels')
            .setChannelTypes('GuildText');

            const actionRow1 = new ActionRowBuilder().addComponents(welcomeChannelSelect);
            await interaction.reply({ content: msg, components: [actionRow1], ephemeral: true });
        }

        if (value === 'disable') {
            MySQL.editColumnInGuilds(interaction.guild.id, 'welcome_channel_id', null);
            MySQL.editColumnInGuilds(interaction.guild.id, 'welcome_message', null);
            MySQL.editColumnInGuilds(interaction.guild.id, 'image_url', null);

            const disabledEmbed = embeds.get('featureDisabled')(interaction);
            await interaction.reply({ embeds: [disabledEmbed], ephemeral: true });
        }
    }
}
