const { EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setDescription(`${emojis.warning} *Deleting Ticket...*`)
      .setColor("Red"),
};
