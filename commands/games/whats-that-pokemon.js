const { SlashCommandBuilder } = require('discord.js');
const { GuessThePokemon } = require('discord-gamecord');
const MySQL = require('../../models/mysql');

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

        game.startGame();
        game.on('gameOver', result => {
        });
    }
}
