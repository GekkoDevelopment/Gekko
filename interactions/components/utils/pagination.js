import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import emoji from '../../../models/emoji.js';

export default async(interaction, pages, time = 30000) => {
    try {
        if (!interaction || !pages || !pages > 0) throw new Error('[GEKKO PAGINATION] Invalid args');

        await interaction.deferReply();

        if (pages.length === 1) {
            return await interaction.editReply({ embeds: pages, components: [], fetchReply: true });
        }

        var index = 0;

        const first = new ButtonBuilder()
        .setCustomId('page_first')
        .setEmoji(emoji.fastReverse)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

        const prev = new ButtonBuilder()
        .setCustomId('page_prev')
        .setEmoji(emoji.backArrow)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

        const pageCount = new ButtonBuilder()
        .setCustomId('page_count')
        .setLabel(`${index + 1}/${pages.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

        const next = new ButtonBuilder()
        .setCustomId('page_next')
        .setEmoji(emoji.rightArrow)
        .setStyle(ButtonStyle.Primary)

        const last = new EButtonBuilder()
        .setCustomId('page_last')
        .setEmoji(emoji.fastForward)
        .setStyle(ButtonStyle.Primary);

        const buttons = new ActionRowBuilder().addComponents([ first, prev, pageCount, next, last ]);
        const msg = await interaction.editReply({ embeds: [pages[index]], components: [buttons], fetchReply: true });

        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return await i.reply({ content: `Only **${interaction.user.username}** can use these page buttons.`, ephemeral: true });

            await i.deferUpdate();

            if (i.customId === 'page_first') {
                index = 0;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }

            if (i.customId === 'page_prev') {
                if (index > 0) index--;
                pageCount.setLabel(`${index + 1}/${pages.length}`);

            } else if (i.customId === 'page_next') {
                if (index < pages.length - 1) {
                    index++;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                }

            } else if (i.customId === 'page_last') {
                index = pages.length - 1;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }
            
            if (index === pages.length - 1) {
                next.setDisabled(true);
                last.setDisabled(true);
            } else {
                next.setDisabled(false);
                last.setDisabled(false);
            }

            await msg.edit({ embeds: [pages[index]], components: [buttons] }).catch(err => {});
            collector.resetTimer();
        });

        collector.on('end', async () => {
            await msg.edit({ embeds: [pages[index]], components: [] }).catch(err => {});
        });

        return msg;
    } catch (error) {
        console.error(`[ERROR] ${error}`);
    }
}