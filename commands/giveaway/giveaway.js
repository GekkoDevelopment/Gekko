const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const giveaways = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway').setDescription('Start a givaway with prizes.')
        .addStringOption(option => option.setName('prize').setDescription('The prize for the giveaway.').setRequired(true))
        .addIntegerOption(option => option.setName('winners').setDescription('The amount of winners for the giveaway').setRequired(true))
        .addIntegerOption(option => option.setName('duraction').setDescription('The duration that giveaway lasts in minutes.').setRequired(true)),
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const winnerCount = interaction.options.getInteger('winners');
        const duration = interaction.options.getInteger('duration');

        const endTime = Date.now() + duration * 60 * 1000;

        giveaways.set(interaction.id, {
            prize,
            winnersCount,
            endTime,
            participants: []
        });

        setTimeout(() => endGiveaway(interaction), duration * 60 * 1000);
        await interaction.reply(`Giveaway for ${prize} has started! Winners will be selected in ${duration} minutes.`);
    }
};

function endGiveaway(interaction) {
    const giveawayData = giveaways.get(interaction.id);
    
    if (!giveawayData) return;

    const participants = giveawayData.participants;
    const winnersCount = giveawayData.winnersCount;

    if (participants.length === 0 || winnersCount <= 0) {
        interaction.channel.send('No participants or invalid winners count. Giveaway canceled.');
        giveaways.delete(interaction.id);
        return;
    }

    const winners = [];
    if (winners.length < winnersCount) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[randomIndex];

        if (!winners.includes(winner)) {
            winners.push(winner);
        }
    }

    const winnerNames = winners.map(winner => `<@${winner}>`).join(', ');
    interaction.channel.send(`Congratulations to ${winnerNames}! You have won ${giveawayData.prize}.`);

    giveaways.delete(interaction.id);
}