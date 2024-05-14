const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('../../../models/mysql');

const games = [
    'CS-GO',
    'Apex Legends',
    'World of Warcraft',
    'Diablo III',
    'Hearthstone',
    'StarCraft II',
    'Diablo III',
    ''
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steam-info').setDescription("Give you your or another user's steam info. (name, hex, etc.)")
        .addStringOption(option => option.setName('username').setDescription('The user you want to look up').addChoices(games).setRequired(true)),
    async execute(interaction) {
        
    }
}