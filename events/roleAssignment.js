const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');
const config = require('../config.js');


module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        const joinRoleId = await MySQL.getColumnValuesWithGuildId(member.guild.id, 'join_role')
        if (joinRoleId) {
            console.log(joinRoleId)

            const joinRole = member.guild.roles.cache.get(joinRoleId)
            await member.roles.add(joinRole)
        } else {
            return; // Do nothing
        }

    }
}