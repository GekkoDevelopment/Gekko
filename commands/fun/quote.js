const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { motivationalQuotes, mindfulnessQuotes, philosophyQuotes, romanceQuotes, natureQuotes, humorQuotes } = require('../../models/quotes');
const colors = require('../../models/colors');

function getRandomQuote(quotes) {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote').setDescription('Generate a random quote.')
        .addStringOption(option => option.setName('quote-category').setDescription('Select a category!').setRequired(true).addChoices(
            { name:"Motivational", value: "motivational"},
            { name:"Mindfulness", value: "mindfulness"},
            { name:"Philosophy", value: "philosophy"},
            { name:"Romance", value: "romance"},
            { name:"Nature", value: "nature"},
            { name:"Humor", value: "humor"}
        )),
    async execute(interaction) {
        const category = interaction.options.getString('quote-category');

        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50105')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYour guild has been banned by the Gekkō Development Team. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        let quote, author;

        switch (category) {
            case 'motivational':
                ({ quote, author } = getRandomQuote(motivationalQuotes.quotes));
                title = 'ꨄ︎ Motivational Quotes! ꨄ︎';
                break;
            case 'mindfulness':
                ({ quote, author } = getRandomQuote(mindfulnessQuotes.quotes));
                title = '𓆩☻𓆪 Mindfulness Quotes! 𓆩☻𓆪';
                break;
            case 'psychology':
                ({ quote, author } = getRandomQuote(philosophyQuotes.quotes));
                title = '❃ Philosophy Quotes! ❃';
                break;
            case 'romance':
                ({ quote, author } = getRandomQuote(romanceQuotes.quotes));
                title = '❤ Romance Quotes! ❤';
                break;
            case 'nature':
                ({ quote, author } = getRandomQuote(natureQuotes.quotes));
                title = '⍋ Nature Quotes! ⍋';
                break;
            case 'humor':
                ({ quote, author } = getRandomQuote(humorQuotes.quotes));
                title = '★ Funny Quotes! ★';
                break;
            default:
                return
        }

        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setDescription(`\`\`\`\n“${quote}”\`\`\``)
            .setFooter({ text: `${author}` })
            .setColor(colors.bot)
        await interaction.reply({ embeds: [embed] })
    }
};

