import { Events } from 'discord.js';

let inviteCreatedHandled = false;

export default {
  name: Events.InviteCreate,
  async execute(invite) {
    if (inviteCreatedHandled) return;
  },
};
