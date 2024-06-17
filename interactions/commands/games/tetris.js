import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('tetris').setDescription('Play a game of Tetris!'),
    async execute(interaction) {
        
        const numOfRows = 18;
        const numOfCols = 10;
        const emptySquare = '⬛';
        const blueSquare = '🟦';
        const brownSquare = '🟫';
        const orangeSquare = '🟧';
        const yellowSquare = '🟨';
        const greenSquare = '🟩';
        const purpleSquare = '🟪';
        const redSquare = '🟥';
        const embedColor = 0x077ff7;

        let board = [];
        
        let points = 0;
        let lines = 0;
        let rotationPos = 0;
        let hMovement = 0;
        let index = 0;

        let downPressed = false;
        let rotateClockwise = false;
        let isNewShape = false;
        let startHigher = false;
        let gameOver = false;

        const mainWallKicks = [
            [[0, 0], [0, -1], [-1, -1], [2, 0], [2, -1]],
            [[0, 0], [0, 1], [1, 1], [-2, 0], [-2, 1]],
            [[0, 0], [0, 1], [-1, 1], [2, 0], [2, 1]],
            [[0, 0], [0, -1], [1, -1], [-2, 0], [-2, -1]]
        ];
        
        const iWallKicks = [
            [[0, 0], [0, -2], [0, 1], [1, -2], [-2, 1]],
            [[0, 0], [0, -1], [0, 2], [-2, -1], [1, 2]],
            [[0, 0], [0, 2], [0, -1], [-1, 2], [2, -1]],
            [[0, 0], [0, 1], [0, -2], [2, 1], [-1, -2]]
        ];


        const rotAdjustments = {
            '🟦': [[0, 1], [-1, -1], [0, 0], [-1, 0]],
            '🟫': [[0, 0], [0, 1], [0, 0], [0, -1]],
            '🟧': [[0, -1], [0, 0], [-1, 1], [0, 0]],
            '🟨': [[0, 0], [0, 0], [0, 0], [0, 0]],
            '🟩': [[0, 0], [0, 0], [0, 0], [0, 0]],
            '🟪': [[0, 0], [1, 1], [0, -1], [0, 1]],
            '🟥': [[1, -1], [-1, -1], [0, 2], [-1, -1]]
        };

        class Tetronimo {
            constructor(startingPos, color, rotationPoints) {
                this.startingPos = startingPos;
                this.color = color;
                this.rotationPoints = rotationPoints;
            }
        }

        const shapeI = new Tetronimo([[0, 3], [0, 4], [0, 5], [0, 6]], blueSquare, [1, 1, 1, 1]);
        const shapeJ = new Tetronimo([[0, 3], [0, 4], [0, 5], [-1, 3]], brownSquare, [1, 1, 2, 2]);
        const shapeL = new Tetronimo([[0, 3], [0, 4], [0, 5], [-1, 5]], orangeSquare, [1, 2, 2, 1]);
        const shapeO = new Tetronimo([[0, 4], [0, 5], [-1, 4], [-1, 5]], yellowSquare, [1, 1, 1, 1]);
        const shapeS = new Tetronimo([[0, 3], [0, 4], [-1, 4], [-1, 5]], greenSquare, [2, 2, 2, 2]);
        const shapeT = new Tetronimo([[0, 3], [0, 4], [0, 5], [-1, 4]], purpleSquare, [1, 1, 3, 0]);
        const shapeZ = new Tetronimo([[0, 4], [0, 5], [-1, 3], [-1, 4]], redSquare, [0, 1, 0, 2]);

        function makeEmptyBoard() {
            board = [];

            for (let row = 0; row < num_of_rows; row++) {
                let rowArray = [];
                
                for (let col = 0; col < num_of_cols; col++) {
                    rowArray.push(empty_square);
                }
                board.push(rowArray);
            }
        }

        function fillBoard(emoji) {
            for (let row = 0; row < numOfRows; row++) {
                for (let col = 0; col < numOfCols; col++) {
                    if (board[row][col] !== emoji) {
                        board[row][col] = emoji;
                    }
                }
            }
        }

        function formatBoardAsStr() {
            let boardAsStr = '';

            for (let row = 0; row < numOfRows; row++) {
                for (let col = 0; col < numOfCols; col++) {
                    boardAsStr += board[row][col];
                }

                boardAsStr += "\n ";
            }

            return boardAsStr;
        }

        function getRandomShape() {
            let shapes = [shapeI, shapeJ, shapeL, shapeO, shapeS, shapeT, shapeZ];
            let randomShape = shapes[Math.floor(Math.random() * 7)];

            if (startHigher) {
                for (let s of randomShape.startingPos) {
                    s[0] -= 1;
                }
            } else {
                let startingPos = randomShape.startingPos.slice();
            }

            isNewShape = true;
            return [randomShape.startingPos.slice(), randomShape.color, randomShape.rotationPoints];
        }


        await interaction.deferReply();
        await resetGame();

        const embed = new EmbedBuilder()
        .setTitle('TETRIS')
        .setDescription(formatBoardAsStr())
        .setColor(embedColor)
        .addFields
        ({ 
            name: 'How to Play:', 
            value: 'Use ⬅ ⬇ ➡ to move left, down, and right respectively. \n Use 🔃 to rotate the shape clockwise. \n Press ▶ to Play.' 
        });

        let message = await interaction.editReply({ embeds: [embed] });
        await message.react("▶");

        const filter = (reaction, user) => {
            return ['⬅', '⬇', '➡', '🔃', '▶'].includes(reaction.emoji.name) && !user.bot;
        };

        const collector = message.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name === "▶") {
                await reset_game();
                const embed = new EmbedBuilder().setDescription(formatBoardAsStr()).setColor(embedColor);
                await message.reactions.removeAll();
                await message.react("⬅");
                await message.react("⬇");
                await message.react("➡");
                await message.react("🔃");
                await message.react("❌");
                let startingShape = getRandomShape();
                await run_game(message, startingShape);
            }
        });
    }
}