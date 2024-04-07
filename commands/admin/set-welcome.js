const { Events, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('mysql');
const config = require('../../config');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.databaseName
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_welcome')
        .setDescription('Set welcome message, image, and channel for the guild.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Welcome channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Welcome message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Image URL (optional)')
                .setRequired(false)),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const welcomeMessage = interaction.options.getString('message');
        const imageUrl = interaction.options.getString('image');
        const welcomeChannelId = interaction.options.getChannel('channel').id;

        mysql.query(
            'INSERT INTO welcome_settings (guild_id, welcome_message, image_url, welcome_channel_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE welcome_message = VALUES(welcome_message), image_url = VALUES(image_url), welcome_channel_id = VALUES(welcome_channel_id)',
            [guildId, welcomeMessage, imageUrl, welcomeChannelId],
            (err, result) => {
                if (err) {
                    console.error('Error saving welcome settings:', err);
                    return interaction.reply('Failed to set welcome message, image, and channel.');
                }
                interaction.reply('Welcome message, image, and channel set successfully!');
            }
        );
    }
};