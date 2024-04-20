const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme.'),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50105')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYour guild has been banned by Gekkō Development. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
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
                    .setColor(colors.bot)
                    .setURL(`https://www.reddit.com${memeData.permalink}`)
                    .setFooter({ text: `Posted by ${author}` });

                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                const stackLines = error.stack.split('\n');
                const relevantLine = stackLines[1];
                const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
                const errorDescription = error.message;

                const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
                await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
            }
        }

        meme();
    },
};
