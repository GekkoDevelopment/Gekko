const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelFlags, ChannelType, MediaChannel, TextChannel, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const db = require('mysql');
const config = require('../../config.js');
const colors = require('../../models/colors');

const mysql = db.createConnection({
    
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('allow-nsfw-anime').setDescription('This feature is off by default. If you want NSFW anime stuff on turn it on using this command.'),
    async execute(interaction) {
        
        const confirmButton1 = new ButtonBuilder().setLabel('Yes').setCustomId('confirm_nsfw_1').setStyle(ButtonStyle.Success);
        const denyButton1 = new ButtonBuilder().setLabel('No').setCustomId('deny_nsfw_1').setStyle(ButtonStyle.Danger);

        const confirmButton2 = new ButtonBuilder().setLabel('Yes').setCustomId('confirm_nsfw_2').setStyle(ButtonStyle.Success);
        const denyButton2 = new ButtonBuilder().setLabel('No').setCustomId('deny_nsfw_2').setStyle(ButtonStyle.Danger);
        
        const embedConfirmEmbed1 = new EmbedBuilder()
        .setTitle('Enable Not Safe For Work Feature')
        .setColor(colors.deepPink)
        .setDescription("This command turns on NSFW anime features (such as the waifu command will show NSFW images)." + 
        "This command/feature is turned off by default... **Are you sure you want to enable this feature?**");

        const embedConfirmEmbed2 = new EmbedBuilder()
        .setTitle('Enable Not Safe For Work Feature')
        .setColor(colors.deepPink)
        .setDescription("**Are you sure you're sure?**");

        const actionRow1 = new ActionRowBuilder().addComponents(confirmButton1, denyButton1);
        const actionRow2 = new ActionRowBuilder().addComponents(confirmButton2, denyButton2);

        let message = interaction.fetchReply();

        if (!message.channel.nsfw && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action, and you are not in a NSFW channel.```',
                    inline: true
                }
            )
            .setColor('Red');

            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (message.channel.nsfw && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action, and you are not in a NSFW channel.```',
                    inline: true
                }
            )
            .setColor('Red');
            
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
    }
}