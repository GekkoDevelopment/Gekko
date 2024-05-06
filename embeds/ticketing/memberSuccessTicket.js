const { EmbedBuilder } = require('discord.js');

module.exports = 
    {
        embed: ( interaction, data ) =>  new EmbedBuilder()
            .setTitle('Ticket Created')
            .setDescription(`> I have created a ticket for you at ${data.channel}`)
            .setColor('Green')
            .setTimestamp()
    }
