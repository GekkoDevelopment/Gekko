const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { emojis } = require('../../../config');
const MySQL = require('../../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock').setDescription('Unlock a channel')
        .addChannelOption(option => option.setName('channel').setDescription('Chose a channel to unlock').setRequired(true)),

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
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle(`${emojis.failed} Permissions Error: 50013`)
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```You lack permissions to perform this action```',
                        inline: true
                    }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle(`${emojis.failed} Permissions Error: 50013`)
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```I do not have permission to perform this action```',
                        inline: true
                    }
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const user = interaction.user;
        
        try {

            const unlockedEmbed = new EmbedBuilder()
                .setTitle(`${emojis.passed} Channel Unlocked`)
                .setDescription('This channel has been unlocked')
                .addFields(
                    {
                        name: 'Moderator:',
                        value: `<@${user.id}>`,
                        inline: true
                    }
                )
                .setFooter({  text: 'Gekkō', iconURL: interaction.client.user.avatarURL() })
                .setTimestamp()
                .setColor('Green');
            
            const successEmbed = new EmbedBuilder()
                .setTitle(`${emojis.passed} Channel Unlocked`)
                .setDescription(`${channel} successfully unlocked.`)
                .setColor('Green')
                .setTimestamp()
                .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.avatarURL() });
            
            await channel.permissionOverwrites.edit(interaction.guild.id, {SendMessages: true})    
            await interaction.reply({ embeds: [successEmbed], ephemeral: true })
            await channel.send({ embeds: [unlockedEmbed] })
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