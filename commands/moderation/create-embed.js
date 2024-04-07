const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.js');
const db = require('mysql');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.host
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-embed').setDescription('Create a custom embed!')
        .addStringOption(option => option.setName('title').setDescription('Set the title of the custom embed.')),
    async execute(interaction) {

    }
}