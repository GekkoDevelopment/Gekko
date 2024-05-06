const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../../models/mysql.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute').setDescription('Mute a user from your discord server.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to mute.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason to mute the user. (optional)')),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50105')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYour guild has been banned by Gekkō Development. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
        await interaction.deferReply();

        const mutedUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const undefinedReason = undefined;
        const muteReason = undefinedReason ? "No Reason Provided" : `${reason}`;
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields
            ({
                name: 'Error Message:',
                value: '```\nYou lack permissions to perform that action```',
                inline: true
            })
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.editReply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const mutedRole = interaction.guild.roles.cache.get(x => x.name === 'muted');
        const mutedRoleId = mutedRole.id;
        
        const sqlRoleId = await MySQL.getValueFromTableWithCondition('muted_users', 'role_id', 'guild_id', interaction.guild.id);
        
        if (sqlRoleId === null || sqlRoleId === 'undefined') {
            
            if (mutedRole !== null) {
                MySQL.insertOrUpdateValue('muted_users', 'role_id', mutedRoleId);
                mutedUser.roles.add(mutedRole);

                interaction.editReply(`Successfully muted ${mutedUser.name} for: ${muteReason}`);
            } else {

            }
        }
    }  
};


/*
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
    
*/