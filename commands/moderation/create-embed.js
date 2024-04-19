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
        .addStringOption(option => option.setName('title').setDescription('Set the title of the custom embed.').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Set the description of the embed.'))
        .addStringOption(option => option.setName('color').setDescription('The color of the embed. (you can use hex code too!)'))
        .addStringOption(option => option.setName('footer-text').setDescription('The text of the footer.'))
        .addStringOption(option => option.setName('footer-image-url').setDescription('The image url for the footer.'))
        .addStringOption(option => option.setName('thumbnail-url').setDescription('The thumbnail for the embed.')),
    async execute(interaction) {

    }
}