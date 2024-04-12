const { Events } = require('discord.js');
const MySQL = require('../models/mysql.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        MySQL.connectToDatabase();
        console.log(`✅ ${client.user.username} (${client.user.id}) is ready to use!`);

        client.user.setActivity({
            name: "/gekko"
        });

        const columns = [
            "guild_id VARCHAR(255) NOT NULL PRIMARY KEY",
            "welcome_channel_id VARCHAR(255) DEFAULT NULL",
            "welcome_message VARCHAR(255) DEFAULT NULL",
            "image_url VARCHAR(255) DEFAULT NULL",
            "embed_clr VARCHAR(255) DEFAULT '#7B598D'",
            "muted_role_id VARCHAR(255) DEFAULT '0'",
            "muted_user_id VARCHAR(255) DEFAULT '0'",
            "nsfw_enabled VARCHAR(255) DEFAULT 'false'",
            "guild_prefix VARCHAR(255) DEFAULT '!'"
        ];

        MySQL.createTable('guilds', columns);
    }
};