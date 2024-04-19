const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-role').setDescription('Remove a role to a user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select a role to assign to the user').setRequired(true)),
    
    async execute(interaction) {
        try {
            const user = interaction.options.getMember('user');
            const role = interaction.options.getRole('role');
            const member = await interaction.guild.members.fetch(user);

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nYou need the MANAGE_ROLES permission to use this command.```',
                        inline: true
                    }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
            }
            
            if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nMy role is NOT higher than the role you want to remove.```',
                        inline: true
                    }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });   
            }

            await member.roles.remove(role);

            const embed = new EmbedBuilder()
            .setTitle(`${config.emojis.passed} Successfully Removed Roles`)
            .setDescription(`${interaction.user} removed the ${role} role from ${user}`)
            .setColor('Green')
            .setTimestamp()
            .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] })
        } catch(error) {
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle('Unexpected Error:')
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
}