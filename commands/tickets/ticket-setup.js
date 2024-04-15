const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, PermissionFlagsBits, ButtonStyle } = require('discord.js')
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Configure Ticketing system in your guild')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => option.setName('channel').setDescription('Select a ticketing Channel').setRequired(true)),
    async execute(interaction) {

        const ticketChannel = interaction.options.getChannel('channel')

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