const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice').setDescription('Roll the dice.'),
    async execute(interaction) {
        
    }
}