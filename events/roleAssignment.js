const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');


module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const joinRole = await MySQL.getColumnValuesWithGuildId(member.guild.id, 'join_role');
            
            if (!joinRole) {
                console.log('No join role found for the guild');
                return;
            }

<<<<<<< HEAD
            const role = await member.guild.roles.fetch(joinRole.toString());
=======
        const joinRoleId = await MySQL.getColumnValuesWithGuildId(member.guild.id, 'join_role')
        if (joinRoleId) {
            console.log(joinRoleId)

            const joinRole = member.guild.roles.cache.get(joinRoleId)
            await member.roles.add(joinRole)
        } else {
            return; // Do nothing
        }
>>>>>>> 280c6810a6c8fc913addad0df48208567330bde5

            member.roles.add(role);
            
        } catch (error) {
            console.error(error);
        }
    }
}