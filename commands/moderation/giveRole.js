const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
const colors = require('../../models/colors');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give-role').setDescription('Give a role to a user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select a role to assign to the user').setRequired(true)),
    
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

        try {
            const user = interaction.options.getMember('user');
            const role = interaction.options.getRole('role');
            const member = await interaction.guild.members.fetch(user);

            const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

            if (restricted === 'true') {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Permissions Error: 50105')
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nYour guild has been banned by the Gekkō Development Team. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                        inline: true
                    }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
            }

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
                        value: '```\nMy role is NOT higher than the role you want to assign.```',
                        inline: true
                    }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });   
            }

            await member.roles.add(role);
            
            const embed = new EmbedBuilder()
            .setTitle(`${config.emojis.passed} Successfully Added Roles`)
            .setDescription(`${interaction.user} gave ${user} the ${role} role`)
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