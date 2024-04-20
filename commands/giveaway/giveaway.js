const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const giveaways = new Map();
const delay = require('node:timers/promises').setTimeout;
const MySQL = require('../../models/mysql');

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
    
        const restricted = await MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);
    
        if (restricted === 'true') {
            const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Permissions Error: 50105')
                .addFields({
                    name: 'Error Message:',
                    value: '```\nYour guild has been banned by Gekkō Development. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                    inline: true
                })
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
    
        const giveawayEmbed = new EmbedBuilder()
            .setColor('Gold')
            .setTitle(`🎉 ${prize} Giveaway! 🎉`)
            .setDescription(`React with 🎉 to enter!\n**Winners**: ${winnersCount}\n**Duration**: ${duration} ${duration === 1 ? 'minute.' :  'minutes.'}`);
    
        await interaction.reply({ content: 'Giveaway Launched!', ephemeral: true });
        const giveawayMessage = await interaction.channel.send({ embeds: [giveawayEmbed] });
        await giveawayMessage.react('🎉');
    
        const filter = (reaction, user) => reaction.emoji.name === '🎉' && !user.bot;
        const collector = giveawayMessage.createReactionCollector({ filter, time: duration * 60 * 1000 });
    
        collector.on('end', async (collected) => {
            const reaction = collected.get('🎉');
            if (!reaction) {
                const failEmbed = new EmbedBuilder()
                .setTitle(' ☹️ Give Away Cancelled ')
                .setDescription('No participants or invalid winners count. Giveaway cancelled.')
                .setTimestamp()
                .setColor('Gold');
                interaction.channel.send({ embeds: [failEmbed] });
                return endGiveaway(interaction, giveawayMessage);
            }
    
            const participants = reaction.users.cache.map(user => user.id);
            console.log("Participants:", participants);
    
            await giveaways.set(giveawayMessage.id, {
                prize,
                winnersCount,
                endTime: Date.now() + duration * 60 * 1000,
                participants
            });
    
            endGiveaway(interaction, giveawayMessage);
        });
    }
}

async function endGiveaway(interaction, giveawayMessage) {
    const giveawayData = await giveaways.get(giveawayMessage.id);
    console.log("GiveMessage ID:", giveawayMessage.id);

    console.log("Giveaway Data:", giveawayData);
    if (!giveawayData) {
        console.log("No giveaway data found. Exiting...");
        return;
    }

    const participants = giveawayData.participants.filter(userId => userId !== interaction.client.user.id);
    console.log("Filtered Participants:", participants);
    const winnersCount = giveawayData.winnersCount;
    console.log("Winners Count:", winnersCount);

    if (participants.length === 0 || winnersCount <= 0) {
        console.log("No participants or invalid winners count. Giveaway Cancelled .");
        interaction.channel.send('No participants or invalid winners count. Giveaway Cancelled .');
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
    console.log("Winners:", winnerNames);
    const winnersEmbed = new EmbedBuilder()
    .setTitle('🎉 Giveaway Results!')
    .setColor('Green')
    .setDescription(`Congratulations to ${winnerNames}! 🎉 \nYou have won ***${giveawayData.prize}*** 👏`)
    await interaction.channel.send({ content: `${winnerNames}`, embeds: [winnersEmbed] });

    giveaways.delete(giveawayMessage.id);
}