const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from this server')
        .addUserOption(option => option.setName('user').setDescription('The user you want to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for ban')),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return await interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!user) {
            return await interaction.reply({ content: "Please specify a user to ban.", ephemeral: true });
        }

        try {
            await interaction.guild.members.ban(user, { reason });
            await interaction.reply({ content: `${user.tag} has been banned.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error banning the user.', ephemeral: true });
        }
    },
};

// TO DO:
// Check Can't kick bot.
// Check Can't kick staff / admin.
// Build embeds.