const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const color = require('../../models/colors.js');
const MySQL = require('../../models/mysql.js');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-prefix').setDescription('Reset the prefix back to the default which is "!"'),
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
        const originalPrefix = '!';

        MySQL.editColumnInGuilds(guildId, 'guild_prefix', originalPrefix);
        
        const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.passed} Prefix successfully set`)
        .setDescription('The bot prefix has been set back to: `!`')
        .setColor('Green')
        .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp()
        .setImage(config.assets.gekkoBanner);

        interaction.reply({ embeds: [embed] });
    }
}