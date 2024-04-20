const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-prefix').setDescription('Changes the prefix for prefix based commands.')
        .addStringOption(option => option.setName('prefix').setDescription('The new prefix for the bot.').setRequired(true)),
    async execute(interaction) {

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
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.warning} Permissions Error: 50013`)
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou need the MANAGE_GUILD permission to use this command.```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
        return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const newPrefix = interaction.options.getString('prefix');

        MySQL.editColumnInGuilds(guildId, 'guild_prefix', newPrefix);

        const prefixEmbed = new EmbedBuilder()
        .setTitle(`${config.emojis.passed} Prefix successfully set`)
        .setDescription(`You're new bot prefix has been changed to: \`${newPrefix}\``)
        .setColor('Green')
        .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setImage(config.assets.gekkoBanner);

        await interaction.reply({ embeds: [prefixEmbed] });
    }
}