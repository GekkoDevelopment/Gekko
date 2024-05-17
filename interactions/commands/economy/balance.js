import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, Embed } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import colors from '../../../models/colors.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';


export default {
    data: new SlashCommandBuilder()
    .setName('balance').setDescription('View yours, or someone else\'s Gekkō Balance')
    .addUserOption(option => option.setName('user').setDescription('Select a user')),
    async execute(interaction) {
        let user;
        const selectedUser = interaction.options.getUser('user');
        DiscordExtensions.checkIfRestricted(interaction);

        if (selectedUser) {
            user = selectedUser;
        } else {
            user = interaction.user;
        }

        let heartsBalance;
        let billsBalance;

        const cashBalance = await MySQL.getValueFromTableWithCondition('economy', 'cash_amount', 'user_id', user.id);
        const bankBalance = await MySQL.getValueFromTableWithCondition('economy', 'bank_amount', 'user_id', user.id);

        if (cashBalance === null){
            heartsBalance = `0`;
        } else {
            heartsBalance = cashBalance;
        }

        if (bankBalance === null){
            billsBalance = `0`;
        } else {
            billsBalance = bankBalance;
        }

        const balanceEmbed = new EmbedBuilder()
        .setTitle(`${user.username}'s Gekkō Balance`)
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(`> **Gekkō Hearts** \n> ${config.emojis.gekkoCoin} \`${heartsBalance}\` \n> **Gekkō Bills:** \n> ${config.emojis.gekkoBill} \`${billsBalance}\``)
        .setColor(colors.bot);

        await interaction.reply({ embeds: [balanceEmbed] });

    }
}