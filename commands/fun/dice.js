const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice').setDescription('Roll the dice.'),
    async execute(interaction) {

        const dice = Math.floor(Math.random() * 6) + 1 -1 + 1;
        const diceEmbed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.tag}` })
        .setColor(colors.bot)
        .setTimestamp()
        .setDescription(`**You rolled a ${dice}** :game_die:`)
        .setFooter({ text: `${interaction.client.user.username}`, iconUR: `${interaction.client.displayAvatarURL}` });
        
        await interaction.reply({ embeds: [diceEmbed] });
    }
}