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

            const role = await member.guild.roles.fetch(joinRole.toString());

            member.roles.add(role);
            
        } catch (error) {
            console.error(error);
        }
    }
}