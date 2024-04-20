const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../models/mysql');
const colors = require('../../models/colors');
const { emojis } = require('../../config');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disallow-nsfw').setDescription('Disallow NSFW commands. The NSFW feature is usually off by default.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const isNsfw = await MySQL.getColumnValuesWithGuildId(guildId, 'nsfw_enabled');
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
            if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) && isNsfw.toString() === 'true') {
                const disableEmbed = new EmbedBuilder()
                .setTitle(`${emojis.passed} NSFW disabled`)
                .setDescription('Okay, **NSFW** Commands are disabled!')
                .setColor(colors.deepPink)
                .setTimestamp()
                .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() });
    
                MySQL.editColumnInGuilds(guildId, 'nsfw_enabled', 'false');
                await interaction.reply({ embeds: [disableEmbed], ephemeral: true });
            } else {
                if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) && isNsfw.toString() === 'false'){
                    const disabledEmbed = new EmbedBuilder()
                    .setTitle(`${emojis.warning} Command Error:`)
                    .setDescription(' **NSFW** is already disabled in this guild.')
                    .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor(colors.deepPink);
                    await interaction.reply({ embeds: [disabledEmbed], ephemeral: true })
                }
            } 
        } catch (error) {
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle(`${emojis.warning} Unexpected Error:`)
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
}