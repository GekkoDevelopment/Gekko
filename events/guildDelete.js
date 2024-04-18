const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {

        const guildId = guild.id;
        MySQL.deleteRow('guilds', 'guild_id', guildId);

        console.log('guild data cleared from database.');

    }
}