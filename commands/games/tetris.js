const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

let board = [];
let numbOfRows = 18;
let numbOfCols = 10;
let points = 0;
let lines = 0;

const emptySquare = ':black_large_square:';
const blueSquare = ':blue_square:';
const brownSquare = ':brown_square:';
const orangeSquare = ':orange_square:';
const yellowSquare = ':yellow_square:';
const greenSquare = ':green_square:';
const purpleSquare = ':purple_square:';
const redSquare = ':red_square:';
const embedColor = '#0x077ff7';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tetris').setDescription('Play a game of tetris.'),
    async execute(interaction) {
        const tutorialEmbed = new EmbedBuilder()
        .setTitle('Tetris')
        .setColor('Red')
        .addFields
        ({
            name: 'Controls',
            value: 'Use the buttons below to move left, right, and down respectively. Use 🔄 to rotate the pieces. \nPress ▶️ to start the game.'
        });

        const rightButton = new ButtonBuilder().setCustomId('tetris-right-button').setStyle(ButtonStyle.Primary).setEmoji('➡️');
        const leftButton = new ButtonBuilder().setCustomId('tetris-left-button').setStyle(ButtonStyle.Primary).setEmoji('⬅️');
        const downButton = new ButtonBuilder().setCustomId('tetris-down-button').setStyle(ButtonStyle.Primary).setEmoji('⬇️');
        const rotateButton = new ButtonBuilder().setCustomId('tetris-rotate-button').setStyle(ButtonStyle.Primary).setEmoji('🔄');

        const stopGameButton = new ButtonBuilder().setCustomId('tetris-stop-button').setStyle(ButtonStyle.Danger).setLabel('Stop');

        const disabledButton1 = new ButtonBuilder().setCustomId('tetris-disabled1-button').setDisabled(true);
        const disabledButton2 = new ButtonBuilder().setCustomId('tetris-disabled2-button').setDisabled(true);

        let actionRow1 = new ActionRowBuilder().addComponents(disabledButton1, rotateButton, disabledButton2, stopGameButton);
        let actionRow2 = new ActionRowBuilder().addComponents(leftButton, downButton, rightButton);

        let message = await interaction.reply({ embeds: [tutorialEmbed] });
        message.react('▶️');

        const reactFilter = (reaction, user) => {
            return reaction.emoji.name === '▶️' && user.id == message.author.id;
        }

        const collector = message.createReactionCollector(reactFilter, { time: 15000 });

        collector.on('collect', (reaction, user) => {
            // todo: game logic
        });

        collector.on('end', collected => {
            // do nothing.
        });
    }
}