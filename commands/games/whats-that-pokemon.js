const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GuessThePokemon } = require('discord-gamecord');
const color = require('../../models/colors.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whats-that-pokemon').setDescription('Guess that Pokémon! (guess the random Pokémon).'),
    async execute(interaction) {
        const game = new GuessThePokemon({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Who's that Pokémon?",
                color: color.beige
            },
            timeoutTime: null,
            winMessage: 'You won! the Pokémon was **{pokemon}**.',
            loseMessage: 'You lost! the Pokémon was **{pokemon}**.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        game.startGame();
        game.on('gameOver', result => {
        });
    }
}
