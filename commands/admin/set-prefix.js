const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('mysql');
const config = require('../../config');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.databaseName
});

let currentPrefix = '!';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-prefix').setDescription('Changes the prefix for prefix based commands.')
        .addStringOption(option => option.setName('prefix').setDescription('The new prefix for the bot.').setRequired(true)),
    async execute(interaction) {
        const newPrefix = interaction.options.getString('prefix');
        const guild = await interaction.guild.id;
        
        let setPrefix = mysql.query('SELECT guild ', function (error, results, fields) {
            if (error) {
                throw error;
            }
        });
        currentPrefix = setPrefix;
        
        const prefixEmbed = new EmbedBuilder()
        .setDescription(`You're new bot prefix has been changed to **${currentPrefix}**`)
        .setColor('Green')
        .setTimestamp();

        await interaction.reply({ embeds: [prefixEmbed] });
    }
}