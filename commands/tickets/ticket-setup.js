const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, PermissionFlagsBits, ButtonStyle } = require('discord.js')
const colors = require('../../models/colors');
const MySQL = require('../../models/mysql');

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

        const ticketChannel = interaction.options.getChannel('channel') // Store to Database with GuildId
        const ticketCategory = interaction.options.getChannel('ticket-category') // Store to Database with guildId
        const supportRole = interaction.options.getRole('support-role') // Store to Database with GuildId

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