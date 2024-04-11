const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');

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
                
                const embed = new EmbedBuilder()
                    .setTitle(animeInfo.attributes.canonicalTitle)
                    .setDescription(`${synopsis}...[View More](https://kitsu.io/anime/${animeInfo.id})`)
                    .addFields(
                        {
                            name: 'Rating',
                            value: animeInfo.attributes.averageRating || 'Not available',
                            inline: false 
                        },
                        {
                            name: 'Status',
                            value: animeInfo.attributes.status || 'Not available',
                            inline: false 
                        },
                        {
                            name: 'Episodes',
                            value: animeInfo.attributes.episodeCount || 'Not available',
                            inline: false 
                        }
                    )
                    .setImage(animeInfo.attributes.posterImage.original)
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
