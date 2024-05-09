const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (
      !(
        interaction.isChatInputCommand() ||
        interaction.isButton() ||
        interaction.isModalSubmit() ||
        interaction.isStringSelectMenu()
      )
    )
      return;
    const command = interaction.client.interactions[
      interaction.isChatInputCommand() ? "commands" : "components"
    ].get(interaction.commandName ?? interaction.customId);

    if (!command) {
      console.error(
        `No command matching ${
          interaction.commandName ?? interaction.customId
        } was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
