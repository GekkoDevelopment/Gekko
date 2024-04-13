const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../models/mysql');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disallow-nsfw-anime').setDescription('Disallow NSFW anime command. This feature is usually off by default.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const isNsfw = await MySQL.getColumnValuesWithGuildId(guildId, 'nsfw_enabled');

        try {
            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator) && isNsfw.toString() === 'true') {
                const disableEmbed = new EmbedBuilder()
                .setDescription('Okay, NSFW Commands are disabled!')
                .setColor(colors.deepPink);
    
                MySQL.editColumnInGuilds(guildId, 'nsfw_enabled', 'false');
                interaction.reply({ embeds: [disableEmbed], ephemeral: true });
            }    
        } catch (err) {
           console.log(err);
        }
    }
}