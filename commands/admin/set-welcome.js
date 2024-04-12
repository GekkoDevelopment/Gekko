const { Events, SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const db = require('mysql');
const config = require('../../config');
const MySQL = require('../../models/mysql')
const Utility = require('../../models/utility');

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
        const guildId = interaction.guild.id;
        const welcomeMessage = interaction.options.getString('message');
        const imageUrl = interaction.options.getString('image');
        const welcomeChannelId = interaction.options.getChannel('channel').id;

        const columns = ['guild_id', 'welcome_channel_id', 'welcome_message', 'image_url'];

        const values = [
            `${guildId}`, // guild_id
            `${welcomeChannelId}`, // welcome_channel_id
            `${welcomeMessage}`, // welcome_message
            `${imageUrl}` // image_url
        ];

        MySQL.insertIntoGuildTable(columns, values);
        Utility.Delay(1000);

        const successEmbed = new EmbedBuilder()
        .setDescription('Welcome message, image, and channel has been set successfully!')
        .setColor('Green')
        interaction.reply({ embeds: [successEmbed] });
        
        /*mysql.query(
            'INSERT INTO guilds (guild_id, welcome_message, image_url, welcome_channel_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE welcome_message = VALUES(welcome_message), image_url = VALUES(image_url), welcome_channel_id = VALUES(welcome_channel_id)',
            [guildId, welcomeMessage, imageUrl, welcomeChannelId],
            (err, result) => {
                if (err) {
                    console.error('Error saving welcome settings:', err);
                    return interaction.reply('Failed to set welcome message, image, and channel.');
                }
            }
        );*/
    }
};