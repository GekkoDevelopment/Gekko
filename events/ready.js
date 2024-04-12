const { Events } = require('discord.js');
const MySQL = require('../models/mysql.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        MySQL.connectToDatabase();
        console.log(`✅ Latency is ${client.ws.ping}ms`);
        console.log(`✅ ${client.user.username} (${client.user.id}) is ready to use!`);

        client.user.setActivity({
            name: "/gekko"
        });

        const columns = [
            'guild_id VARCHAR(255) NOT NULL PRIMARY KEY',
            'welcome_channel_id VARCHAR(255) NOT NULL',
            'welcome_message VARCHAR(255) NOT NULL',
            'image_url VARCHAR(255) NOT NULL',
            'muted_role_id VARCHAR(255) NOT NULL',
            'muted_user_id VARCHAR(255) NOT NULL',
            'nsfw_enabled VARCHAR(255) NOT NULL'
        ];
        MySQL.createTable('guilds', columns);
    }
};