import { SlashCommandBuilder } from 'discord.js';
import { GuessThePokemon } from 'discord-gamecord';
import MySQL from '../../../models/mysql';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whats-that-pokemon")
    .setDescription("Guess that Pokémon! (guess the random Pokémon)."),
  async execute(interaction) {
    const game = new GuessThePokemon({
      message: interaction,
      isSlashGame: false,
      embed: {
        title: "Who's that Pokémon?",
        color: "Orange",
      },
      timeoutTime: null,
      winMessage: "You won! The Pokémon was **{pokemon}**.",
      loseMessage: "You lost! The Pokémon was **{pokemon}**.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    const restricted = MySQL.getValueFromTableWithCondition(
      "guilds",
      "restricted_guild",
      "guild_id",
      interaction.guild.id
    );

    if (restricted === "true") {
      const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    game.startGame();
    game.on("gameOver", (result) => {});
  },
};
