const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.js');
const db = require('mysql');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime-character').setDescription('Get information about an anime character.')
        .addStringOption(option => option.setName('character').setDescription('The anime character to get information about.').setRequired(true)),
    async execute(interaction) {
        const animeCharacter = interaction.options.getString('character');
        
    }
}