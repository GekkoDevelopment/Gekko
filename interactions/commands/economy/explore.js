import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
import MySQL from '../../../models/mysql';
import colors from '../../../models/colors';
import config from '../../../config';

const cooldowns = new Map();

function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

export default {
    data: new SlashCommandBuilder()
    .setName('explore').setDescription('Start an exploration to find rewards!'),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition(
            "guilds",
            "restricted_guild",
            "guild_id",
            interaction.guild.id
          );
      
        if (restricted === "true") {
        const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
        return await interaction.reply({
            embeds: [permissionErrorEmbed],
            ephemeral: true,
        });
        }

        const isEnabled = await MySQL.getValueFromTableWithCondition('guilds', 'economy_enabled', 'guild_id', interaction.guild.id);
        if (isEnabled === 'false') {
            const econdisabledEmbed = embeds.get('economyDisabled')(interaction);
            await interaction.reply({ embeds: [econdisabledEmbed], ephemeral: true });
        }

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

        const cooldownTime = 24 * 60 * 60 * 1000;
        const expirationTime = Date.now() + cooldownTime;
        cooldowns.set(interaction.user.id, expirationTime);

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