const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('mysql');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from this server')
    .addUserOption(option => option.setName('user').setDescription('The user you want to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for Kick')),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.guild.me.permissions.has('KICK_MEMBERS')) {
            return await interaction.reply({ content: 'I do not have permission to Kick people from this guild.', ephemeral: true });
        }

        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return await interaction.reply({ content: 'You do not have permission to kick members from this guild.', ephemeral: true });
        }

        try {
            await interaction.guild.members.kick(user, reason);
            await interaction.reply({ content: `Successfully kicked ${user.tag}!`, ephemeral: true });
        } catch (error) {
            console.error('Error kicking user:', error);
            await interaction.reply({ content: 'There was an error kicking the user.', ephemeral: true });
        }
    },
};