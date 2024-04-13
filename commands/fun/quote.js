const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { motivationalQuotes, mindfulnessQuotes, psychologyQuotes, romanceQuotes, natureQuotes, humorQuotes } = require('../../models/quotes');
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
            { name:"Psychology", value: "psychology"},
            { name:"Romance", value: "romance"},
            { name:"Nature", value: "nature"},
            { name:"Humor", value: "humor"}
        )),
    async execute(interaction) {
        const category = interaction.options.getString('quote-category');
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
                ({ quote, author } = getRandomQuote(psychologyQuotes.quotes));
                title = '❃ Psychology Quotes! ❃';
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

