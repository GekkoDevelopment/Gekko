import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import MySQL from "../../../models/mysql";
import colors from "../../../models/colors";
import config from "../../../config";

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hearts-exchange').setDescription('Exchange Gekkō Hearts for Bills'),
    async execute(interaction) {
        const currentHeartsBal = await MySQL.getValueFromTableWithCondition('economy', 'cash_amount', 'user_id', interaction.user.id);
        if (currentHeartsBal === null || currentHeartsBal < 100) {
            const balanceError = new EmbedBuilder()
            .setTitle(`${config.emojis.noted} There seems to be a transaction error...`)
            .setDescription(`${interaction.user}, after looking through your finances, you don't have enough to complete this transaction! \n\n***Here's a breakdown of your accounts:***`)
            .setColor(colors.bot)
            .addFields(
                {
                    name: '**Current Balance**',
                    value: `${config.emojis.gekkoCoin} \`0\``,
                },
                {
                    name: '**What you need**',
                    value: `${config.emojis.gekkoCoin} \`100\``,
                }
            );
            return await interaction.reply({ embeds: [balanceError] });
        }
    }
}