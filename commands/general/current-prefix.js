const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const color = require('../../models/colors.js');
const config = require('../../config.js');
const MySQL = require('../../models/mysql.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('current-prefix').setDescription('Tells you what the current bot prefix is.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const currentPrefix = await MySQL.getColumnValuesWithGuildId(guildId, 'guild_prefix');
        
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

        const embed = new EmbedBuilder()
        .setDescription(`The current prefix for the bot is: \`${currentPrefix.toString()}\``)
        .setColor(color.bot)
        .setImage(config.assets.gekkoBanner);

        interaction.reply({ embeds: [embed] });
    }
}