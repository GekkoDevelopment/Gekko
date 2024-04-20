const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
            const participants = collected.get('🎉').users.cache.map(user => user.id);
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
    if (!giveawayData) {
        return;
    }

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