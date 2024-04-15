const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, PermissionFlagsBits, ButtonStyle } = require('discord.js')
const colors = require('../../models/colors');
const MySQL = require('../../models/mysql');
const Utility = require('../../models/utility');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Configure Ticketing system in your guild')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => option.setName('channel').setDescription('Select a ticketing Channel').setRequired(true))
        .addChannelOption(option => option.setName('ticket-category').setDescription('Where will tickets open?').setRequired(true))
        .addRoleOption(option => option.setName('support-role').setDescription('Chose a support Role').setRequired(true)),
    async execute(interaction) {

        const guildId = interaction.guild.id;
        const ticketChannel = interaction.options.getChannel('channel');
        const ticketCategory = interaction.options.getChannel('ticket-category');
        const supportRole = interaction.options.getRole('support-role');

        await MySQL.insertOrUpdateValue('tickets', 'guild_id', guildId);

        Utility.Delay(1000);

        await MySQL.updateColumnValue('tickets', guildId, 'support_role_id', supportRole.id);
        await MySQL.updateColumnValue('tickets',guildId, 'ticket_channel_id', ticketChannel.id);
        await MySQL.updateColumnValue('tickets',guildId, 'ticket_category', ticketCategory.id);
        await MySQL.updateColumnValue('tickets',guildId, 'support_role_id', supportRole.id);

        const embed = new EmbedBuilder()
            .setTitle('Contact Support')
            .setDescription('Create a ticket and contact the support team with the button below.')
            .setColor(colors.bot)
        
        const ticketBtn = new ButtonBuilder()
            .setCustomId('ticketBtn')
            .setLabel('Create a Ticket')
            .setEmoji('📩')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(ticketBtn)

        const successEmbed = new EmbedBuilder()
            .setTitle('Ticket Channel Set')
            .setDescription(`> Ticketing Embed has been sent to ${ticketChannel}`)
            .setColor('Green')
            .setTimestamp()
        
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        await ticketChannel.send({ embeds: [embed], components: [row] });
    }
}