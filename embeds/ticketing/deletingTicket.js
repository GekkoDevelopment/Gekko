const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setDescription(`${config.emojis.warning} *Deleting Ticket...*`)
      .setColor("Red"),
};
