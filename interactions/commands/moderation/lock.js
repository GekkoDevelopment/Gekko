const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { emojis } = require('../../../config');
const MySQL = require('../../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock').setDescription('Lock a channel')
        .addChannelOption(option => option.setName('channel').setDescription('Chose a channel to lock').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for channel-lock').setRequired(true)),

    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = embeds.get('guildRestricted')(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const errorEmbed = embeds.get('permissionsError')(interaction);
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const errorEmbed = embeds.get('botPermissionsError')(interaction);
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const reason = interaction.options.getString('reason');
        const user = interaction.user;
        
        try {

            const lockedEmbed = new EmbedBuilder()
                .setTitle(`${emojis.warning} Channel Locked`)
                .setDescription('This channel has been temporarily locked down')
                .addFields(
                    {
                        name: 'Moderator:',
                        value: `<@${user.id}>`,
                        inline: true
                    },
                    {
                        name: 'Reason:',
                        value: `*${reason}*`,
                        inline: true
                    },
                )
                .setFooter({  text: 'Gekkō', iconURL: interaction.client.user.avatarURL() })
                .setTimestamp()
                .setColor('Orange');
            
            const successEmbed = new EmbedBuilder()
                .setTitle(`${emojis.passed} Channel Locked`)
                .setDescription(`${channel} successfully locked down.`)
                .setColor('Green')
                .setTimestamp()
                .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.avatarURL() });
            
            await channel.permissionOverwrites.edit(interaction.guild.id, {SendMessages: false})
            await interaction.reply({ embeds: [successEmbed], ephemeral: true })
            await channel.send({ embeds: [lockedEmbed] })
        } catch (error) {
            console.log(error)
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle(`${emojis.failed} Unexpected Error:`)
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    },
};