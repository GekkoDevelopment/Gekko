import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import colors from "../../../models/colors.js";
import config from "../../../config.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";

export default {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll the dice."),
  async execute(interaction) {
    const dice = Math.floor(Math.random() * 6) + 1;
    DiscordExtensions.checkIfRestricted(interaction);

    let diceEmoji;
    switch (dice) {
      case 1:
        diceEmoji = config.emojis.d1;
        break;
      case 2:
        diceEmoji = config.emojis.d2;
        break;
      case 3:
        diceEmoji = config.emojis.d3;
        break;
      case 4:
        diceEmoji = config.emojis.d4;
        break;
      case 5:
        diceEmoji = config.emojis.d5;
        break;
      case 6:
        diceEmoji = config.emojis.d6;
        break;
      default:
        diceEmoji = ":question:";
    }

    const diceEmbed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.user.tag}` })
      .setColor(colors.bot)
      .setTimestamp()
      .setDescription(`**You rolled a ${dice}** ${diceEmoji}`)
      .setFooter({
        text: `${interaction.client.user.username}`,
        iconUR: `${interaction.client.displayAvatarURL}`,
      });

    await interaction.reply({ embeds: [diceEmbed] });
  },
};
