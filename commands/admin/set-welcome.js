const { Events, SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const db = require('mysql');
const config = require('../../config');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.name
});

mysql.query(`
    CREATE TABLE IF NOT EXISTS welcome_settings (
        guild_id VARCHAR(255) PRIMARY KEY,
        welcome_message TEXT NOT NULL,
        image_url VARCHAR(255),
        welcome_channel_id VARCHAR(255) NOT NULL
    )
`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome').setDescription('Set welcome message, image, and channel for the guild.')
        .addChannelOption(option => option.setName('channel').setDescription('Welcome channel').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Welcome message').setRequired(true))
        .addStringOption(option => option.setName('image-url').setDescription('Image URL (optional)').setRequired(false)),

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
                const successEmbed = new EmbedBuilder()
                .setDescription('Welcome message, image, and channel has been set successfully!')
                .setColor('Green')
                interaction.reply({ embeds: [successEmbed] });
            }
        );
    }
};