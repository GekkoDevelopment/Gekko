const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MySQL = require("../../../models/mysql");
const colors = require("../../../models/colors");
const config = require("../../../config");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('transfer-hearts').setDescription('Transfer your hearts to another user/account')
    .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('The Amount you\'d like to transfer').setRequired(true)),
    async execute(interaction) {
        const recipient = interaction.options.getUser('user');
        const sendersTransfer = await interaction.options.getInteger('amount');
        const sendersPrevHeartsBal = await MySQL.getValueFromTableWithCondition('economy', 'cash_amount', 'user_id', interaction.user.id);
        if (sendersPrevHeartsBal === null) {
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
                    name: '**Transfer Amount**',
                    value: `${config.emojis.gekkoCoin} \`${sendersTransfer}\``,
                }
            );
            return await interaction.reply({ embeds: [balanceError] });
        } else {
            const sendersNewHeartsBal = parseInt(sendersPrevHeartsBal) - sendersTransfer;

            if (sendersPrevHeartsBal < sendersTransfer) {
                const balanceError = new EmbedBuilder()
                .setTitle(`${config.emojis.noted} There seems to be a transaction error...`)
                .setDescription(`${interaction.user}, after looking through your finances, you don't have enough to complete this transaction! \n\n***Here's a breakdown of your accounts:***`)
                .setColor(colors.bot)
                .addFields(
                    {
                        name: '**Current Balance**',
                        value: `${config.emojis.gekkoCoin} \`${sendersPrevHeartsBal}\``,
                    },
                    {
                        name: '**Transfer Amount**',
                        value: `${config.emojis.gekkoCoin} \`${sendersTransfer}\``,
                    }
                );
                return await interaction.reply({ embeds: [balanceError] });
            } else {
                const recipientPrevHeartsBal = await MySQL.getValueFromTableWithCondition('economy', 'cash_amount', 'user_id', recipient.id);
                if (recipientPrevHeartsBal === null) {
                    const recipientNewHeartsBal = sendersTransfer; 
                    await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'guild_id', 'cash_amount'], [[recipient.id, interaction.guild.id, recipientNewHeartsBal]]);
                    await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'cash_amount'], [[interaction.user.id, sendersNewHeartsBal]]);
        
                    const transferEmbed = new EmbedBuilder()
                    .setTitle(`${config.emojis.passed} Transaction Complete!`)
                    .setDescription(`${interaction.user} has sent ${recipient} ${config.emojis.gekkoCoin} \`${sendersTransfer}\` into their account`)
                    .setColor(colors.bot);
        
                    await interaction.reply({ content: `${recipient}`, embeds: [transferEmbed] });
                } else {
                    const recipientNewHeartsBal = parseInt(recipientPrevHeartsBal) + sendersTransfer;
    
                    await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'cash_amount'], [[recipient.id, recipientNewHeartsBal]]);
                    await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'cash_amount'], [[interaction.user.id, sendersNewHeartsBal]]);
        
                    const transferEmbed = new EmbedBuilder()
                    .setTitle(`${config.emojis.passed} Transaction Complete!`)
                    .setDescription(`${interaction.user} has sent ${recipient} ${config.emojis.gekkoCoin} \`${sendersTransfer}\` into their account`)
                    .setColor(colors.bot);
        
                    await interaction.reply({ content: `${recipient}`, embeds: [transferEmbed] });
                }
            }   
        }
    }
}