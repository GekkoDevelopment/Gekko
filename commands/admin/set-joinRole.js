const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-join-roles').setDescription('Set welcome message, image, and channel for the guild.')
        .addRoleOption(option => option.setName('role').setDescription('Select a join role').setRequired(true)),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const role = interaction.options.getRole('role');

        MySQL.editColumnInGuilds(guildId, 'join_role', role.id);

        const roleEmbed = new EmbedBuilder()
        .setDescription(`New members will be given ${role} when they join your guild`)
        .setColor('Green')
        .setImage(config.assets.gekkoBanner);

        await interaction.reply({ embeds: [roleEmbed] });

    }
};