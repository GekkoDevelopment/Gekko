const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {

        const guildId = guild.id
        const columns = ['guild_id'];

        const values = [
            `${guildId}`, // guild_id
        ];

        MySQL.valueExistsInGuildsColumn(guildId, 'guild_id', guildId).then(exists => {
            if (exists) {
                MySQL.updateColumnInfo(guildId, 'guild_id', guildId);
            } else {
                MySQL.insertIntoGuildTable(columns, values);
            }
        });

    }
}