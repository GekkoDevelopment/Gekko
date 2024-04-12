const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const color = require('../../models/colors.js');
const config = require('../../config.js');
const MySQL = require('../../models/mysql.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('current-prefix').setDescription('Tells you what the current bot prefix is.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const currentPrefix = await MySQL.getColumnValuesWithGuildId(guildId, 'guild_prefix');
        
        const embed = new EmbedBuilder()
        .setDescription(`The current prefix for the bot is *${currentPrefix.toString()}*`)
        .setColor(color.bot)
        .setImage(config.assets.gekkoBanner);

        interaction.reply({ embeds: [embed] });
    }
}