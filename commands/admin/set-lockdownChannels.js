const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown-config').setDescription('Add lockdown channels')
        .addStringOption(option => option.setName('channels').setDescription('Enter the channels (seperated by commas)').setRequired(true)),
    
    async execute(interaction) {
        const channelsInput = interaction.options.getString('channels')
        const channelIds = channelsInput.match(/\d+/g);
        console.log(channelIds)

        await MySQL.editColumnValue('lockdown_config', 'guild_id', interaction.guild.id);
        await MySQL.editColumnValue('lockdown_config', 'channel_id', channelIds.toString());

        await interaction.reply({ content: 'done.', ephemeral: true })
    }
}