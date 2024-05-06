const { EmbedBuilder } = require('discord.js');
const { emojis } = require('../../config');

module.exports = 
    {
        embed: ( interaction, data ) =>  new EmbedBuilder()
        .setTitle(`${emojis.warning} Permissions Error: 50013`)
        .addFields(
            {
                name: 'Error Message:',
                value: '```\nI lack permissions to perform that action \nPlease check my permissions, or reinvite me to use my default permissions.```',
                inline: true
            }
        )
        .setColor('Red')
        .setTimestamp()
        .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() })
    }
