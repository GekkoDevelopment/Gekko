const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('mysql');
const config = require('../../config.js');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.databaseName
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime-info').setDescription('Look up information about a specific anime.')
        .addStringOption(option => option.setName('anime').setDescription('The anime to get information from.').setRequired(true)),
    async execute(interaction) {
        const animeName = interaction.options.getString('anime');

    }
}