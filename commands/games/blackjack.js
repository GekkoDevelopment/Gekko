const { SlashCommandBuilder } = require('discord.js');

// Function to create a deck of cards
function createDeck() {
    const suits = ['♠️', '♣️', '♥️', '♦️'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}${suit}`);
        }
    }
    return deck;
}

// Function to shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to calculate the value of a hand
function calculateHandValue(hand) {
    let sum = 0;
    let numAces = 0;
    for (const card of hand) {
        const rank = card.substring(0, card.length - 1);
        if (rank === 'A') {
            numAces++;
            sum += 11; // Aces count as 11 by default
        } else if (['J', 'Q', 'K'].includes(rank)) {
            sum += 10; // Face cards count as 10
        } else {
            sum += parseInt(rank, 10); // Other cards count as their numerical value
        }
    }
    // Adjust for aces if necessary
    while (sum > 21 && numAces > 0) {
        sum -= 10; // Convert ace from 11 to 1
        numAces--;
    }
    return sum;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Start a game of Blackjack!')
        .addUserOption(option => option.setName('user').setDescription('The user you want to play with.').setRequired(true)),
        async execute(interaction) {

        }
};
