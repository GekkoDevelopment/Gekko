const { EmbedBuilder } = require('discord.js');
const colors = require('../../models/colors');

module.exports = 
    {
        embed: ( interaction, data ) =>  new EmbedBuilder()
            .setTitle('Ticket Panel')
            .setDescription('Use the buttons below to manage this ticket.')
            .setTimestamp()
            .setColor(colors.bot)
    }
