const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from this server')
        .addUserOption(option => option.setName('user').setDescription('The user you want to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for Kick')),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action```',
                    inline: true
                }
            )
            .setColor('#7B598D');
        return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            const successEmbed = new EmbedBuilder()
            .setTitle('User Kicked')
            .setDescription(`> \`${user.tag}\` has been kicked. \n> \n> **Moderator:** \n> <@${interaction.member.id}> \n> **Reason:** \n> \`${reason}\``)
            .setColor('#7B598D');

            await interaction.guild.members.kick(user, reason);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle('Unexpected Error:')
            .setDescription(`\`\`\`\n${error}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('#7B598D')

            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    },
};

// TO DO:
// Check Can't kick bot.
// Check Can't kick staff / admin.
