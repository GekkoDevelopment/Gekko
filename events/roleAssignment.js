const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const MySQL = require('../models/mysql.js');
const config = require('../config.js');


module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        const joinRole = await MySQL.getColumnValuesWithGuildId(member.guild.id, 'join_role')
        console.log(joinRole)
        //const joinRole = member.guild.roles.cache.get('1226502598094491648')
        await member.roles.add(joinRole)


    }
}