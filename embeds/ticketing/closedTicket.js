const { EmbedBuilder } = require('discord.js');
const { emojis } = require('../../config');

module.exports = 
    {
        embed: ( interaction, data ) =>  new EmbedBuilder()
            .setTitle(`${emojis.warning} Ticket Closed`)
            .setDescription(`Ticket was closed by <@${interaction.user.id}>`)
            .setColor('Orange')
            .setTimestamp()
            .setFooter({ text: 'Ticket Closed At:' })
    }
