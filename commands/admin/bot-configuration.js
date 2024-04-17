const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const MySQL = require('../../models/mysql');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-config').setDescription('Configure the bot for your guild'),
    
    async execute(interaction) {
        const configEmbed = new EmbedBuilder()
            .setTitle('Gekkō Configuration')
            .setDescription('> Use the drop-down menu below to start configuring our bot. \n\n> For more help on setting up the bot, feel free to read our Documentation, or join our support server for help.')
            .addFields(
                {
                    name: 'Getting Started:',
                    value: 'Use the drop-down menu below to start configuring our bot.'
                }
            )
            .setColor(colors.bot)
            .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
        
        await interaction.reply({ embeds: [configEmbed] });
    }
}