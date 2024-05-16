import { EmbedBuilder } from 'discord.js';
import config from '../../../config.js';
import MySQL from '../../../models/mysql.js';
import colors from '../../../models/colors.js';

export default {
    data: { name: "exploreResultsBtn" },
    async execute(interaction) {
        const content = interaction.message.content.match(/<@!?(\d+)>/); 
        const userId = content[1];
        
        if (userId !== interaction.user.id) {
            const error = new EmbedBuilder()
            .setTitle(`${config.emojis.warning} Economy Error`)
            .setDescription('You are not the intended user of this interaction')
            .setColor('Red');
            await interaction.reply({ embeds: [error], ephemeral: true });
        }

        const foundHearts = Math.floor(Math.random() * (100 - 5 + 1)) + 5;
        const foundBills = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

        const prevHeartsBal = await MySQL.getValueFromTableWithCondition('economy', 'cash_amount', 'user_id', interaction.user.id);
        const prevBillBal = await MySQL.getValueFromTableWithCondition('economy', 'bank_amount', 'user_id', interaction.user.id);

        const newHeartsBal = parseInt(prevHeartsBal) + foundHearts;
        const newBillBal = parseInt(prevBillBal) + foundBills;

        await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'cash_amount', 'bank_amount'], [[interaction.user.id, newHeartsBal, newBillBal]]);
        
        const resultsEmbed = new EmbedBuilder()
        .setTitle('🎒 Here\'s what you picked up...')
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`> **Gekkō Hearts** \n> ${config.emojis.gekkoCoin} \`${foundHearts}\` \n> **Gekkō Bills:** \n> ${config.emojis.gekkoBill} \`${foundBills}\` \n\n*Use the \`/balance\` command to view you balance*`)
        .setColor(colors.bot);

        await interaction.message.edit({ components: [] });
        await interaction.reply({ embeds: [resultsEmbed] });
    },
};