const { SlashCommandBuilder } = require('discord.js');
const { GuessThePokemon } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whats-that-pokemon').setDescription('Guess that Pokémon! (guess the random Pokémon).'),
    async execute(interaction) {
        const game = new GuessThePokemon({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Who's that Pokémon?",
                color: 'Orange'
            },
            timeoutTime: null,
            winMessage: 'You won! The Pokémon was **{pokemon}**.',
            loseMessage: 'You lost! The Pokémon was **{pokemon}**.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        game.startGame();
        game.on('gameOver', result => {
        });
    }
}
