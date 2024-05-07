const { EmbedBuilder } = require("discord.js");
const { emojis } = require("../../config");

module.exports = {
  embed: (interaction, data) =>
    new EmbedBuilder()
      .setTitle(`${emojis.warning} Unexpected Error:`)
      .setDescription(
        `\`\`\`\n${data.errorMessage} \n\n${data.errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`
      )
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL(),
      }),
};
