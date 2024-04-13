const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../models/mysql');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disallow-nsfw-anime').setDescription('Disallow NSFW anime command. This feature is usually off by default.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const isNsfw = await MySQL.getColumnValuesWithGuildId(guildId, 'nsfw_enabled');

        try {
            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator) && isNsfw.toString() === 'true') {
                const disableEmbed = new EmbedBuilder()
                .setDescription('Okay, NSFW Commands are disabled!')
                .setColor(colors.deepPink);
    
                MySQL.editColumnInGuilds(guildId, 'nsfw_enabled', 'false');
                interaction.reply({ embeds: [disableEmbed], ephemeral: true });
            }    
        } catch (error) {
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle('Unexpected Error:')
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
}