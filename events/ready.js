import { Events } from 'discord.js';
import MySQL from '../models/mysql'

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    MySQL.connectToDatabase();
    console.log(
      `✅ ${client.user.username} (${client.user.id}) is ready to use!`
    );

    client.user.setActivity({
      name: "/gekko",
    });

    // most of these lines are database table columns, and rows.
    const columns = [
      "guild_id VARCHAR(255) NOT NULL PRIMARY KEY",
      "welcome_channel_id VARCHAR(255) DEFAULT NULL",
      "welcome_message LONGTEXT DEFAULT NULL",
      "image_url VARCHAR(255) DEFAULT NULL",
      "nsfw_enabled VARCHAR(255) DEFAULT 'false'",
      "guild_prefix VARCHAR(255) DEFAULT '!'",
      "join_role VARCHAR(255) DEFAULT NULL",
      "economy_enabled VARCHAR(255) DEFAULT 'false'",
      "starting_amount VARCHAR(5) DEFAULT '1500'",
      "restricted_guild VARCHAR(255) DEFAULT 'false'", // When talking about "restricted guilds" this is referring to guilds that are blacklisted by the bot and the bot will not be used.
    ];

    const lockdownColumns = [
      "guild_id VARCHAR(255) NOT NULL DEFAULT '0'",
      "channel_id VARCHAR(255) DEFAULT NULL",
    ];

    const ticketDataColumns = [
      "guild_id VARCHAR(255) NOT NULL",
      "ticket_id VARCHAR(255) PRIMARY KEY DEFAULT '0'",
      "user_id VARCHAR(255) DEFAULT NULL",
    ];

    const economyColumns = [
      "user_id VARCHAR(255) NOT NULL PRIMARY KEY",
      "guild_id VARCHAR(255) NOT NULL DEFAULT '0'",
      "cash_amount VARCHAR(255) DEFAULT '0'",
      "bank_amount VARCHAR(255) DEFAULT '0'"
    ];

    const mutedUsersColumns = [
      "guild_id VARCHAR(255) NOT NULL DEFAULT '0'",
      "role_id VARCHAR(255) DEFAULT NULL",
      "muted_member_id VARCHAR(255) DEFAULT NULL",
      "reason VARCHAR(255) DEFAULT NULL",
    ];

    const ticketsColumns = [
      "guild_id VARCHAR(255) NOT NULL PRIMARY KEY",
      "ticket_channel_id VARCHAR(255) DEFAULT NULL",
      "ticket_category VARCHAR(255) DEFAULT NULL",
      "support_role_id VARCHAR(255) DEFAULT NULL",
    ];

    const loggingColumns = [
      "guild_id VARCHAR(255) NOT NULL PRIMARY KEY",
      "moderation_log VARCHAR(255) DEFAULT 'false'",
      "moderation_channel VARCHAR(255) DEFAULT NULL",
      "ticket_log VARCHAR(255) DEFAULT 'false'",
      "ticket_channel VARCHAR(255) DEFAULT NULL",
      "commands_log VARCHAR(255) DEFAULT 'false'",
      "commands_Channel VARCHAR(255) DEFAULT NULL",
      "message_log VARCHAR(255) DEFAULT 'false'",
      "message_channel VARCHAR(255) DEFAULT NULL",
      "audit_log VARCHAR(255) DEFAULT 'false'",
      "audit_channel VARCHAR(255) DEFAULT NULL",
    ];

    const punishmentColumn = [
      "guild_id VARCHAR(255) NOT NULL PRIMARY KEY",
      "user_id VARCHAR(255) DEFAULT NULL",
      "punishment_id VARCHAR(255) DEFAULT NULL",
      ""
    ]

    MySQL.createTable("guilds", columns);
    MySQL.createTable("economy", economyColumns);
    MySQL.createTable("muted_users", mutedUsersColumns);
    MySQL.createTable("tickets", ticketsColumns);
    MySQL.createTable("ticket_data", ticketDataColumns);
    MySQL.createTable("lockdown_config", lockdownColumns);
    MySQL.createTable("logging", loggingColumns);
    MySQL.createTable("punishment_data", punishmentColumn);
  },
};
