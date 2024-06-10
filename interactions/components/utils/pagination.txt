import { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import emoji from '../../../models/emoji.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';

export default Pagination = async(interaction, pages, time = 30 * 1000) => {
    try {
        if (!interaction || !pages || !time) throw new Error('[PAGINATION] Invalid Arguments.');

        await interaction.deferReply();

        if (pages.length === 1) {
            return await interaction.editReply({ embeds: pages, components: [], fetchReply: true });
        }

        var index = 0;

        const firstBtn = new ButtonBuilder().setCustomId('firstpage').setEmoji(emoji.fastReverse).setStyle(ButtonStyle.Primary).setDisabled(true);
        const prevBtn = new ButtonBuilder().setCustomId('prevpage').setEmoji(emoji.backArrow).setStyle(ButtonStyle.Primary).setDisabled(true);
        const pageCount = new ButtonBuilder().setCustomId('pageCount').setLabel(`${index +  1}/${pages.length}`).setStyle(ButtonStyle.Secondary).setDisabled(true);
        const nextBtn = new ButtonBuilder().setCustomId('nextpage').setEmoji(emoji.backArrow).setStyle(ButtonStyle.Primary);
        const lastBtn = new ButtonBuilder().setCustomId('lastpage').setEmoji(emoji.fastForward).setStyle(ButtonStyle.Primary)

        const buttons = new ActionRowBuilder().addComponents([ firstBtn, prevBtn, pageCount, nextBtn, lastBtn ]);
        const message = await interaction.editReply({ embeds: [pages[index]], components: [buttons], fetchReply: true });

        const collector = await message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: time
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return await i.reply({ content: `Only **${interaction.user.username}** can use these page buttons!`, ephemeral: true });

            await i.deferReply();

            switch (i.customId) {
                case 'firstpage':
                    index = 0;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                    break;

                case 'prevpage':
                    if (index > 0) index--;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                    break;

                case 'nextpage':
                    if (index < pages.length - 1) {
                        index++;
                        pageCount.setLabel(`${index + 1}/${pages.length}`);    
                    }
                    break;

                case 'lastpage':
                    index = pages.length - 1;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                    break;

                default:
                    break;
            }

            if (index === 0) {
                firstBtn.setDisabled(true);
                prevBtn.setDisabled(true);
            } else {
                firstBtn.setDisabled(false);
                prevBtn.setDisabled(false);
            }

            await message.edit({ embeds: [pages[index]], components: [buttons] }).catch(error => {});
            collector.resetTimer();
        });

        collector.on('end', async() => {
            await message.edit({ embeds: [pages[index]], components: [buttons] }).catch(error => {});
        });

        return message;
    } catch (error) {
        DiscordExtensions.sendErrorEmbed(error, interaction);
    }
}