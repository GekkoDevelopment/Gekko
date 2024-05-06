const { EmbedBuilder } = require('discord.js');
const { emojis } = require('../../config');

module.exports = 
    {
        embed: ( interaction, data ) =>  new EmbedBuilder()
        .setTitle(`${emojis.warning} Permissions Error: 50013`)
        .addFields(
            {
                name: 'Error Message:',
                value: '```\nYou lack permissions to perform that action```',
                inline: true
            }
        )
        .setColor('Red')
        .setTimestamp()
        .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() })
    }
