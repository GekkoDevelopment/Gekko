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
            "nsfw_enabled VARCHAR(255) DEFAULT 'false'",
            "guild_prefix VARCHAR(255) DEFAULT '!'"
        ];

        const economyColumns = [
            "guild_id VARCHAR(255) NOT NULL PRIMARY KEY",
            "user_id VARCHAR(255) DEFAULT '0'",
            "cash_amount VARCHAR(255) DEFAULT '0'",
            "bank_amount VARCHAR(255) DEFAULT '0'",
            "economy_enabled VARCHAR(255) DEFAULT 'false'",
        ];

        const mutedUsersColumns = [
            "guild_id VARCHAR(255) NOT NULL PRIMARY KEY",
            "role_id VARCHAR(255) DEFAULT '0'",
            "reason VARCHAR(255) DEFAULT NULL"
        ];

        const ticketsColumns = [
            "guild_id VARCHAR(255) NOT NULL PRIMARY KEY",
            "user_id VARCHAR(255) DEFAULT '0'",
            "ticket_id VARCHAR(255) DEFAULT '0'",
            "ticket_channel_id VARCHAR(255) DEFAULT '0'",
            "ticket_category VARCHAR(255) DEFAULT '0'"
        ];

        MySQL.createTable('guilds', columns);
        MySQL.createTable('economy', economyColumns);
        MySQL.createTable('muted_users', mutedUsersColumns);
        MySQL.createTable('tickets', ticketsColumns);
    }
};