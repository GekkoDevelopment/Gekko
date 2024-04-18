const { AuditLogEvent, Events, EmbedBuilder } = require('discord.js');
const colors = require('../models/colors');
const MySQL = require('../models/mysql');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
    }
}