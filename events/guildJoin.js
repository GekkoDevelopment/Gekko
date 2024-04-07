const { Events, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.js');
const db = require('mysql');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.databaseName
});

module.exports.guildMemberAdd = {
    name: 'guildMemberAdd',
    async execute(member) {
        mysql.query(
            'SELECT welcome_message, image_url, welcome_channel_id FROM welcome_settings WHERE guild_id = ?',
            [member.guild.id],
            (err, rows) => {
                if (err) {
                    console.error('Error fetching welcome settings:', err);
                    return;
                }

                const welcomeSettings = rows[0];
                if (!welcomeSettings) return;

                const welcomeMessage = welcomeSettings.welcome_message;
                const imageUrl = welcomeSettings.image_url;
                const welcomeChannelId = welcomeSettings.welcome_channel_id;

                const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
                if (!welcomeChannel) return;

                welcomeChannel.send(welcomeMessage, { files: [imageUrl] })
                    .catch(err => console.error('Error sending welcome message:', err));
            }
        );
    }
};