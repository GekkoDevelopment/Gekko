const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-cash-amount').setDescription('Set your starting cash amount for this server!')
        .addIntegerOption(option => option.setName('amount').setDescription('The starting cash amount. (Limit is 99999)').setRequired(true).setMinValue(0).setMaxValue(99999)),
    async execute(interaction) {
        const startingAmount = interaction.options.getInteger('amount')
        const guildId = interaction.member.guild.id;
        const userId = interaction.user.id;
        
        const loggingChannel = MySQL.getColumnValuesWithGuildId(guildId, 'logging_channel');
        const channel = interaction.guilds.roles.cache.get(loggingChannel.toString());

        MySQL.insertInto('economy', 'guild_id', guildId);
        MySQL.insertInto('economy', 'user_id', userId);
        MySQL.insertInto('economy', 'cash_amount', startingAmount);
        MySQL.insertInto('economy', 'starting_amount', )

        const embed = new EmbedBuilder()
        .setDescription(`Success! Your starting amount is now set to ${startingAmount}`)
        .setColor('Green');
        
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}