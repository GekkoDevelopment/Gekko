const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../../models/mysql');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-prefix').setDescription('Changes the prefix for prefix based commands.')
        .addStringOption(option => option.setName('prefix').setDescription('The new prefix for the bot.').setRequired(true)),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = embeds.get('guildRestricted')(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get('permissionsError')(interaction);
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