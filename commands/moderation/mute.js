const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.js');
const color = require('../../models/colors.js');
const MySQL = require('../../models/mysql.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute').setDescription('Mute a user from your discord server.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to mute.').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
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

        const mutedUser = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        MySQL.insertValueIfNotExists('muted_users', 'guild_id', guildId);
        const mutedRoleId = MySQL.getValueFromTableWithCondition('muted_users', 'muted_role_id', 'guild_id', guildId);

        if (mutedRoleId === 'null' || mutedRoleId === 'undefined') {
            
        }
    }  
};