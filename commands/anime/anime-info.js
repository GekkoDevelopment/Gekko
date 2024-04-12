const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors.js');
const emojis = require('../../config.js');
const Utility = require('../../models/utility.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime-info')
        .setDescription('Look up information about a specific anime.')
        .addStringOption(option => option.setName('anime').setDescription('The anime to get information from.').setRequired(true)),
    async execute(interaction) {
        try {
            const animeName = interaction.options.getString('anime');
            let option = {
                url: `https://kitsu.io/api/edge/anime?filter[text]=${animeName}`,
                method: `GET`,
                headers: {
                    'Content-Type': "application/vnd.api+json",
                    'Accept': "application/vnd.api+json",
                }
            };
            
            const response = await fetch(option.url, option);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const animeInfo = data.data[0];
                let synopsis = animeInfo.attributes.synopsis || 'No synopsis available.';
                synopsis = synopsis.length > 300 ? synopsis.substring(0, 300) + '...' : synopsis;

                let ratingEmoji;
                if (animeInfo.attributes.averageRating >= 70) {
                    ratingEmoji = emojis.ratingGreen;
                } else if (animeInfo.attributes.averageRating >= 40) {
                    ratingEmoji = emojis.ratingAmber;
                } else {
                    ratingEmoji = emojis.ratingRed;
                }

                let statusEmoji;
                switch (animeInfo.attributes.status) {
                    case 'current':
                        statusEmoji = emojis.ratingGreen;
                        break;
                    case 'finished':
                        statusEmoji = emojis.ratingRed;
                        break;
                    case 'tba':
                        statusEmoji = emojis.ratingNa;
                        break;
                    case 'unreleased':
                        statusEmoji = emojis.ratingNa;
                        break;
                    case 'upcoming':
                        statusEmoji = emojis.ratingAmber;
                        break;
                    default:
                        statusEmoji = '';
                }

                let nsfwCheck = animeInfo.attributes.nsfw;
                let isNsfw = nsfwCheck === false ? '✔️ Safe For Work' : '⚠️ Not Safe For Work';

                const embed = new EmbedBuilder()
                    .setTitle(`${animeInfo.attributes.canonicalTitle}`)
                    .setFooter({text: animeInfo.attributes.titles.en, iconURL: interaction.client.user.avatarURL() })
                    .setDescription(`> ${synopsis}[[View More]](https://kitsu.io/anime/${animeInfo.id})`)
                    .addFields(
                        {
                            name: 'Rating',
                            value: `${ratingEmoji} ${animeInfo.attributes.averageRating}%` || 'Not available',
                            inline: true 
                        },
                        {
                            name: 'Status',
                            value: `${statusEmoji} ${animeInfo.attributes.status}` || 'Not available',
                            inline: true 
                        },
                        {
                            name: 'Episode Length',
                            value: `📺 ${String(animeInfo.attributes.episodeLength)} minutes` || 'Not available',
                            inline: true 
                        },
                        {
                            name: 'Is NSFW',
                            value: `\`${isNsfw}\``,
                            inline: true
                        },
                        {
                            name: 'Age Rating',
                            value: `\`${animeInfo.attributes.ageRating}\`` || 'Not available',
                            inline: true 
                        },
                        {
                            name: 'Start Date:',
                            value: `\`${animeInfo.attributes.startDate}\``,
                            inline: true
                        },
                        {
                            name: 'End Date',
                            value: `\`${animeInfo.attributes.endDate}\``,
                            inline: true
                        }
                    )
                    .setURL(`https://kitsu.io/anime/${animeInfo.id}`)
                    .setColor(colors.bot);
                
                if (animeInfo.attributes.coverImage && animeInfo.attributes.coverImage.original) {
                    embed.setImage(animeInfo.attributes.coverImage.original);
                }

                await interaction.reply({ embeds: [embed] });
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Search Error:')
                    .setColor('Red')
                    .setDescription('No anime found with that name.');

                await interaction.reply({ embeds: [errorEmbed] });
            }
        } catch(error) {
            const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${error}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red');
            
            await interaction.reply({ embeds: [catchErrorEmbed] });
        }
    },
};