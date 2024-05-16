import { EmbedBuilder } from 'discord.js';
import config from '../../config';

module.exports = {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Unexpected Error:`)
      .setDescription(
        `\`\`\`\n${data.errorMessage} \n\n${data.errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`
      )
      .setColor("Red")
      .setTimestamp()
      .setFooter({
        text: "Gekkō Development",
        iconURL: interaction.client.user.displayAvatarURL() || message.client.user.displayAvatarURL(),
      }),
};
