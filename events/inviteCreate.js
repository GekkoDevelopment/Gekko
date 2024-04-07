const { Events } = require('discord.js');
const config = require('../config.js');

let inviteCreatedHandled = false;

module.exports = {
    name: Events.InviteCreate,
    async execute(invite) {
        if (inviteCreatedHandled) return;
    }
}