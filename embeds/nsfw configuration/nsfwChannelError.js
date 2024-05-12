const { EmbedBuilder } = require("discord.js");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setDescription("You are not in a NSFW channel to do this!")
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL(),
      }),
};
