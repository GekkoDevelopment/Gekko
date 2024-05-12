const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const MySQL = require("../../../models/mysql");
const colors = require("../../../models/colors");
const config = require("../../../config");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('explore').setDescription('Start an exploration to find rewards!'),
    async execute(interaction) {
        const isEnabled = await MySQL.getValueFromTableWithCondition('guilds', 'economy_enabled', 'guild_id', interaction.guild.id);
        if (isEnabled === 'false') {
            const econdisabledEmbed = embeds.get('economyDisabled')(interaction);
            await interaction.reply({ embeds: [econdisabledEmbed], ephemeral: true });
        }

        const loadingMsg = new EmbedBuilder()
        .setTitle(`${config.emojis.gekkoStar} Exploration Started...`)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`${interaction.user} has started an Exploration... \n${config.emojis.gekkoWalking} ██-------- 20%`)
        .setColor(colors.bot);
        const msg = await interaction.reply({ content: `${interaction.user}`, embeds: [loadingMsg] });

        await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'guild_id'], [[interaction.user.id, interaction.guild.id]]);

        setTimeout(() => {
            const loadingMsg = new EmbedBuilder()
            .setTitle(`${config.emojis.gekkoStar} Exploration Started...`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${interaction.user} has started an Exploration... \n${config.emojis.gekkoWalking} ████------ 40%`)
            .setColor(colors.bot);
            msg.edit({ content: `${interaction.user}`, embeds: [loadingMsg] });
        }, 5000)
        setTimeout(() => {
            const loadingMsg = new EmbedBuilder()
            .setTitle(`${config.emojis.gekkoStar} Exploration Started...`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${interaction.user} has started an Exploration... \n${config.emojis.gekkoWalking} ██████---- 60%`)
            .setColor(colors.bot);
            msg.edit({ content: `${interaction.user}`, embeds: [loadingMsg] });
        }, 10000)
        setTimeout(() => {
            const loadingMsg = new EmbedBuilder()
            .setTitle(`${config.emojis.gekkoStar} Exploration Started...`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${interaction.user} has started an Exploration... \n${config.emojis.gekkoWalking} ████████-- 80%`)
            .setColor(colors.bot);
            msg.edit({ content: `${interaction.user}`, embeds: [loadingMsg] });
        }, 15000)
        setTimeout(() => {
            const loadingMsg = new EmbedBuilder()
            .setTitle(`${config.emojis.gekkoStar} Exploration Finished!`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${interaction.user} has finsihed an Exploration... \n${config.emojis.gekkoWalking} ██████████ 100%`)
            .setColor(colors.bot);
            const resultsBtn = new ButtonBuilder()
            .setCustomId('exploreResultsBtn')
            .setLabel('View Results')
            .setStyle(ButtonStyle.Success);

            const actionRow = new ActionRowBuilder().addComponents(resultsBtn);

            msg.edit({ content: `${interaction.user}`, embeds: [loadingMsg], components: [actionRow] });
        }, 20000)

    }
}