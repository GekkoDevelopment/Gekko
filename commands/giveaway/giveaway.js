const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const giveaways = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway').setDescription('Start a givaway with prizes.')
        .addStringOption(option => option.setName('prize').setDescription('The prize for the giveaway.').setRequired(true))
        .addIntegerOption(option => option.setName('winners').setDescription('The amount of winners for the giveaway').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('The duration that giveaway lasts in minutes.').setRequired(true)),
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const winnersCount = interaction.options.getInteger('winners');
        const duration = interaction.options.getInteger('duration');

        const giveawayEmbed = new EmbedBuilder()
        .setColor('Gold')
        .setTitle(`🎉 ${prize} Giveaway! 🎉`)
        .setDescription(`React with 🎉 to enter!\n**Winners**: ${winnersCount}\n**Duration**: ${duration} ${duration === 1 ? 'minute.' :  'minutes.'}`);

        const giveawayMessage = await interaction.channel.send({ embeds: [giveawayEmbed] });
        await giveawayMessage.react('🎉');

        giveawayMessage.awaitReactions({ filter: (reaction, user) => reaction.emoji.name === '🎉' })
            .then(collected => {
                const participants = collected.get('🎉').users.cache.filter(user => !user.bot).map(user => user.id);
                console.log("Participants:", participants);

                giveaways.set(giveawayMessage.id, {
                    prize,
                    winnersCount,
                    endTime: Date.now() + duration * 60 * 1000,
                    participants
                });
            })
            .catch(console.error);

        setTimeout(() => endGiveaway(interaction, giveawayMessage), duration * 60 * 1000);
    },
};

async function endGiveaway(interaction, giveawayMessage) {
    const giveawayData = giveaways.get(giveawayMessage.id);

    if (!giveawayData) return;

    const participants = giveawayData.participants.filter(userId => userId !== interaction.client.user.id);
    const winnersCount = giveawayData.winnersCount;

    if (participants.length === 0 || winnersCount <= 0) {
        interaction.channel.send('No participants or invalid winners count. Giveaway canceled.');
        giveaways.delete(giveawayMessage.id);
        return;
    }

    const winners = [];
    while (winners.length < winnersCount && participants.length > 0) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants.splice(randomIndex, 1)[0];
        winners.push(winner);
    }

    const winnerNames = winners.map(winner => `<@${winner}>`).join(', ');
    await interaction.channel.send(`🎉 Congratulations to ${winnerNames}! You have won ${giveawayData.prize}! 🎉`);

    giveaways.delete(giveawayMessage.id);
}