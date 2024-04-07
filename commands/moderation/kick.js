const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from this server')
        .addUserOption(option => option.setName('user').setDescription('The user you want to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for Kick')),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return await interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!user) {
            return await interaction.reply({ content: "Please specify a user to kick.", ephemeral: true });
        }

        try {
            await interaction.guild.members.kick(user, reason);
            await interaction.reply({ content: `${user.tag} has been kicked.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error kicking the user.', ephemeral: true });
        }
    },
};

// TO DO:
// Check Can't kick bot.
// Check Can't kick staff / admin.
// Build embeds.
