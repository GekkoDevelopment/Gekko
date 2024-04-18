const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');


module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const joinRoleId = await MySQL.getColumnValuesWithGuildId(member.guild.id, 'join_role')

            if (joinRoleId) {
                const joinRole = member.guild.roles.cache.get(joinRoleId)
                await member.roles.add(joinRole)
            } else {
                return; // Do nothing
            }

            member.roles.add(role);
            
        } catch (error) {
            console.error(error);
        }
    }
}