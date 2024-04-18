const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown-config').setDescription('Add lockdown channels')
        .addStringOption(option => option.setName('channels').setDescription('Enter the channels (seperated by commas)').setRequired(true)),
    
    async execute(interaction) {
        const channels = interaction.options.getString('channels')
        console.log(channels)

        await interaction.reply({ content: 'done.', ephemeral: true })
    }
}