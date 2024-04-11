const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('mysql');
const config = require('../../config.js');
const color = require('../../models/colors.js');

const mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.name,
    port: config.database.port
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('general-prefix').setDescription('reset the prefix back to the default which is "!"'),
    async execute(interaction) {
        
    }
}