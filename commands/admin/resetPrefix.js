const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const color = require('../../models/colors.js');
const MySQL = require('../../models/mysql.js');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-prefix').setDescription('Reset the prefix back to the default which is "!"'),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action```',
                    inline: true
                }
            )
            .setColor('Red');
        return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const originalPrefix = '!';

        MySQL.editColumnInGuilds(guildId, 'guild_prefix', originalPrefix);
        
        const embed = new EmbedBuilder()
        .setDescription('The bot prefix has been set back to ```!```')
        .setColor(color.bot)
        .setImage(config.assets.gekkoBanner);

        interaction.reply({ embeds: [embed] });
    }
}