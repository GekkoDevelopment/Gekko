const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../models/mysql');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-join-roles').setDescription('Set welcome message, image, and channel for the guild.')
        .addStringOption(option => option.setName('roles').setDescription('Enter the roles you want to give new users').setRequired(true)),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou need the MANAGE_GUILD permission to use this command.```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nI need the MANAGE_ROLES permission to use this command.```',
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true })
        }

        const guildId = interaction.guild.id;
        const rolesInput = interaction.options.getString('roles');
        const roleIds = rolesInput.match(/\d+/g);

        console.log(roleIds);

        await MySQL.editColumnInGuilds(guildId, 'join_role', roleIds.toString());
        console.log('db updated');
        await interaction.reply({ content: 'done', ephemeral: true })

        /*const roleEmbed = new EmbedBuilder()
        .setTitle(`${config.emojis.passed} Join Roles successfully set`)
        .setDescription(`New members will be given ${role} roles(s) when they join your guild`)
        .setColor('Green')
        .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setImage(config.assets.gekkoBanner);

        await interaction.reply({ embeds: [roleEmbed] });*/
    }
};