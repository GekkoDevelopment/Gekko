const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme.'),
    async execute(interaction) {
        async function meme() {
            try {
                const response = await fetch('https://www.reddit.com/r/memes/random.json');
                const data = await response.json();

                if (!data[0] || !data[0].data || !data[0].data.children || data[0].data.children.length === 0) {
                    throw new Error('No meme found.');
                }

                const memeData = data[0].data.children[0].data;
                const title = memeData.title;
                const image = memeData.url;
                const author = memeData.author;

                const embed = new EmbedBuilder()
                    .setTitle(`${title}`)
                    .setImage(`${image}`)
                    .setURL(`${image}`)
                    .setColor('Red')
                    .setURL(`https://www.reddit.com${memeData.permalink}`)
                    .setFooter({ text: `Posted by ${author}` });

                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${error}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
                await interaction.reply({ embeds: [catchErrorEmbed] });
            }
        }

        meme();
    },
};
