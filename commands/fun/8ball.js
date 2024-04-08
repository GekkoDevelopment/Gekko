const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const color = require('../../models/colors.js');

let respones = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8-ball').setDescription('Ask the magic 8-Ball a question.')
        .addStringOption(option => option.setName('question').setDescription('The question to ask the magic 8-Ball.').setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const randomResponse = respones[Math.floor(Math.random() * respones.length)];

        const embed = new EmbedBuilder()
        .setTitle('Magic 8-Ball')
        .setDescription(`You're question is: ${question} \n The Magic 8-Ball responded with: **${randomResponse}**`)
        .setColor(color.midnightBlue);

        await interaction.reply({ embeds: [embed] });
    }
}