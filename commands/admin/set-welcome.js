const { Events, SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const db = require('mysql');
const config = require('../../config');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.name
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome').setDescription('Set welcome message, image, and channel for the guild.')
        .addChannelOption(option => option.setName('channel').setDescription('Welcome channel').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Welcome message').setRequired(true))
        .addStringOption(option => option.setName('image-url').setDescription('Image URL (optional)').setRequired(false)),

    async execute(interaction) {

    }
};