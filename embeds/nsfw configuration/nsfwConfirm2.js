const { EmbedBuilder } = require('discord.js');
const { emojis } = require('../../config');
const colors = require('../../models/colors');

module.exports = 
    {
        embed: ( interaction, data ) =>  new EmbedBuilder()
        .setTitle(`${emojis.warning} Enable Not Safe For Work Feature`)
        .setColor(colors.deepPink)
        .setDescription("**Are you sure you're sure?**")
    }
