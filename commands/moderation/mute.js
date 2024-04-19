const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.js');
const color = require('../../models/colors.js');
const MySQL = require('../../models/mysql.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute').setDescription('Mute a user from your discord server.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to mute.').setRequired(true)),
    async execute(interaction) {
        
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

        try {
            if (mutedRoleId === 'null' || mutedRoleId === 'undefined') {
                let mutedRole = interaction.guild.roles.cache.find(x => x.name === 'muted');
    
                if (typeof mutedRoles === undefined) {
                    interaction.guild.roles.create
                    ({
                        name: 'muted',
                        permissionOverwrites: 
                        [
                            {
                                id: mutedRole.id,
                                deny: [PermissionFlagsBits.SendMessages],
                                
                            },
                            {
                                id: mutedRole.id,
                                deny: [PermissionFlagsBits.SendVoiceMessages],
                                
                            },
                            {
                                id: mutedRole.id,
                                deny: [PermissionFlagsBits.SendTTSMessages],
                            },
                            {
                                id: mutedRole.id,
                                deny: [PermissionFlagsBits.SendMessagesInThreads],
                            },
                            {
                                id: mutedRole.id,
                                deny: [PermissionFlagsBits.UseExternalSounds],
                            },
                            {
                                id: mutedRole.id,
                                deny: [PermissionFlagsBits.SendMessagesInThreads],
                            },
                            {
                                id: mutedRole.id,
                                deny: [PermissionFlagsBits.UseSoundboard]
                            }
                        ]
                    });
    
                    MySQL.updateValueInTableWithCondition('muted_users', 'role_id', roleId, 'guild_id', guildId);
                    MySQL.updateValueInTableWithCondition('muted_users', 'muted_user_id', mutedUser.id, 'guild_id', guildId );
    
                    await mutedUser.role.add(muted)
    
                    interaction.editReply({ content: "I couldn't find a muted role so I created one for you!", ephemeral: true });
                } else {
                    MySQL.updateValueInTableWithCondition('muted_users', 'muted_user_id', mutedUser.id, 'guild_id', guildId );
                    await mutedUser.role.add(muted);
                    
                    await interaction.editReply(`Muted: ${mutedUser.name}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }  
};