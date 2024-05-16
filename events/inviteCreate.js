import { Events } from 'discord.js';

let inviteCreatedHandled = false;

module.exports = {
  name: Events.InviteCreate,
  async execute(invite) {
    if (inviteCreatedHandled) return;
  },
};
