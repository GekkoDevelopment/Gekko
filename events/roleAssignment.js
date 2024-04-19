const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');


module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const guildId = member.guild.id
            const roleIds = await MySQL.getValueFromTableWithCondition('guilds', 'join_role', 'guild_id', guildId)
            //const joinRoleId = await MySQL.getColumnValuesWithGuildId(member.guild.id, 'join_role')

            if (roleIds) {
                const roleIdsArray = roleIds.split(',');

                for (const roleId of roleIdsArray) {
                    const role = member.guild.roles.cache.get(roleId);
                    if (role) {
                        await member.roles.add(role)
                    } else {
                        console.log(`role with ID ${roleId} not found`);
                    }
                }
            } else {
                return; // Do nothing
            }            
        } catch (error) {
            console.error(error);
        }
    }
}