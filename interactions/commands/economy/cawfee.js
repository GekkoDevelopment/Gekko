import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import colors from '../../../models/colors.js';
import config from '../../../config.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';

const cooldowns = new Map();

function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

export default {
    data: new SlashCommandBuilder()
    .setName('cawfee').setDescription('Give a user a Cawfee to earn Gekkō Hearts')
    .addUserOption(option => option.setName('user').setDescription('Select a user')),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);

        if (cooldowns.has(interaction.user.id)) {
            const expirationTime = cooldowns.get(interaction.user.id);
            const currentTime = Date.now();
            const remainingTime = expirationTime - currentTime;

            if (remainingTime > 0) {
                const cooldownEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.warning} Economy Error`)
                .setDescription(`You are on cooldown. Please wait ${formatTime(remainingTime)}.`)
                .setColor('Red');

                await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
                return;
            }
        }

        const cooldownTime = 1 * 60 * 60 * 1000;
        const expirationTime = Date.now() + cooldownTime;
        cooldowns.set(interaction.user.id, expirationTime);

        let user;
        const selectedUser = interaction.options.getUser('user');

        if (selectedUser) {
            user = selectedUser;
        } else {
            user = interaction.client.user;
        }

        if (user === interaction.user) {
            const cawfeeEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.gekkoCawfee} Cawfee time!! \n${interaction.user.username} treated themself to a cawfee!`)
            .setDescription(`${interaction.user} can't tip themself though, so they earnt nothing...`)
            .setColor(colors.bot);

            return await interaction.reply({ embeds: [cawfeeEmbed] });
        }

        const earnedHearts = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
        const prevHeartsBal = await MySQL.getValueFromTableWithCondition('economy', 'cash_amount', 'user_id', interaction.user.id);

        if (prevHeartsBal === null){
            const newHeartsBal = earnedHearts;   
            await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'guild_id', 'cash_amount'], [[interaction.user.id, interaction.guild.id, newHeartsBal]]);

            const cawfeeEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.gekkoCawfee} Cawfee time!! \n${interaction.user.username} gave ${user.username} a cawfee!`)
            .setDescription(`${interaction.user} earned ${config.emojis.gekkoCoin} \`${earnedHearts}\` \n*You can actually treat our Dev\'s to a coffee via [BuyMeACoffee](https://buymeacoffee.com/)*`)
            .setColor(colors.bot)
      
            await interaction.reply({ embeds: [cawfeeEmbed] });
        } else {
            const newHeartsBal = parseInt(prevHeartsBal) + earnedHearts;
            await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'cash_amount'], [[interaction.user.id, newHeartsBal]]);

            const cawfeeEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.gekkoCawfee} Cawfee time!! \n${interaction.user.username} gave ${user.username} a cawfee!`)
            .setDescription(`${interaction.user} earned ${config.emojis.gekkoCoin} \`${earnedHearts}\` \n*You can actually treat our Dev\'s to a coffee via [BuyMeACoffee](https://buymeacoffee.com/)*`)
            .setColor(colors.bot)
      
            await interaction.reply({ embeds: [cawfeeEmbed] });
        }

    }
}