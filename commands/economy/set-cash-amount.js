const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-cash-amount').setDescription('Set your starting cash amount for this server!')
        .addIntegerOption(option => option.setName('amount').setDescription('The starting cash amount. (Limit is 99999)').setRequired(true).setMinValue(0).setMaxValue(99999)),
    async execute(interaction) {
        let startingAmount = interaction.options.getInteger('amount')
        let guildId = interaction.member.guild.id;
        let userId = interaction.user.id;
        let loggingChannel = MySQL.getColumnValuesWithGuildId(guildId, 'logging_channel');

        MySQL.insertInto('economy', 'guild_id', guildId);
        MySQL.insertInto('economy', 'user_id', userId);
        MySQL.insertInto('economy', 'cash_amount', startingAmount);

        const embed = new EmbedBuilder()
        .setDescription(`Success! Your starting amount is now set to ${startingAmount}`)
        .setColor('Green');
        
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}