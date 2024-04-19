const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const color = require('../../models/colors.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from this server')
        .addUserOption(option => option.setName('user').setDescription('The user you want to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for ban')),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nI lack permissions to perform that action \nPlease check my permissions, or reinvite me to use my default permissions.```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(user.id);

        if (user.bot) {
            const botErrorEmbed = new EmbedBuilder()
            .setTitle('Action Error:')
            .setDescription('You cannot ban a bot from the server, please do this manually.')
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [botErrorEmbed], ephemeral: true })
        }

        if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0) {
            const roleErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error:')
            .setDescription('You cannot ban a user with a role that is the same, or higher than yours.')
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [roleErrorEmbed], ephemeral: true });
        }

        try {
            const successEmbed = new EmbedBuilder()
            .setTitle('User Banned')
            .setDescription(`> \`${user.tag}\` has been banned. \n> \n> **Moderator:** \n> <@${interaction.member.id}> \n> **Reason:** \n> \`${reason}\``)
            .setColor(color.bot);
            await member.ban(reason);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle(`${emojis.warning} Unexpected Error:`)
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    },
};