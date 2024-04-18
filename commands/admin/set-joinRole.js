const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-join-roles').setDescription('Set welcome message, image, and channel for the guild.')
        .addRoleOption(option => option.setName('role').setDescription('Select a join role').setRequired(true)),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action```',
                    inline: true
                }
            )
            .setColor('Red');
        return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nI lack permissions to perform that action \nPlease check my permissions, or reinvite me to use my default permissions.```',
                    inline: true
                }
            )
            .setColor('Red');
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

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