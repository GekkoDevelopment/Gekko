const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-prefix').setDescription('Changes the prefix for prefix based commands.')
        .addStringOption(option => option.setName('prefix').setDescription('The new prefix for the bot.').setRequired(true)),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const newPrefix = interaction.options.getString('prefix');

        MySQL.editColumnInGuilds(guildId, 'guild_prefix', newPrefix);

        const prefixEmbed = new EmbedBuilder()
        .setDescription(`You're new bot prefix has been changed to *${newPrefix}*`)
        .setColor('Green')
        .setImage(config.assets.gekkoBanner);

        await interaction.reply({ embeds: [prefixEmbed] });
    }
}