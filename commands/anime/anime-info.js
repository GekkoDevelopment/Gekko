const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');
const { emojis } = require('../../config');

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
                synopsis = synopsis.length > 200 ? synopsis.substring(0, 200) + '...' : synopsis;

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
                
                const embed = new EmbedBuilder()
                    .setTitle(`${animeInfo.attributes.canonicalTitle}`)
                    .setFooter({text: animeInfo.attributes.titles.en_jp, iconURL: interaction.client.user.avatarURL() })
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
                            name: 'Episodes',
                            value: `📺 ${String(animeInfo.attributes.episodeCount)}` || 'Not available',
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
                    .setImage(animeInfo.attributes.coverImage.original)
                    .setURL(`https://kitsu.io/anime/${animeInfo.id}`)
                    .setColor(colors.bot);

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ content: 'No anime found with that name.' });
            }
        } catch(error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while fetching anime info.' });
        }
    },
};
