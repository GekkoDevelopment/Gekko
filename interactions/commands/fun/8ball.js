import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import MySQL from "../../../models/mysql.js";
import color from "../../../models/colors.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";
import embeds from '../../../embeds/index.js';

let respones = [
  'https://i.imgur.com/rnGq8PZ.png',
  'https://i.imgur.com/CQVT7xD.png',
  'https://i.imgur.com/F8rL6fV.png',
  'https://i.imgur.com/5WV3LfK.png',
  'https://i.imgur.com/iGOZUEr.png',
  'https://i.imgur.com/1fvmYu6.png',
  'https://i.imgur.com/T2oPBZS.png',
  'https://i.imgur.com/ebRev4L.png',
  'https://i.imgur.com/1Rhib7i.png',
  'https://i.imgur.com/lzDmFy1.png',
  'https://i.imgur.com/GRvWfKv.png',
  'https://i.imgur.com/2HPTR9y.png',
  'https://i.imgur.com/rDu4nLA.png',
  'https://i.imgur.com/yToNbYX.png',
  'https://i.imgur.com/AgIE33w.png',
  'https://i.imgur.com/sIui50d.png',
  'https://i.imgur.com/A5pQg4j.png',
  'https://i.imgur.com/7DypU3T.png',
  'https://i.imgur.com/eBdme3N.png',
  'https://i.imgur.com/uAE4vhV.png',
]

export default {
  data: new SlashCommandBuilder()
    .setName("8-ball")
    .setDescription("Ask the magic 8-Ball a question.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to ask the magic 8-Ball.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question");
    const randomResponse = respones[Math.floor(Math.random() * respones.length)];

    DiscordExtensions.checkIfRestricted(interaction);

    const embed = new EmbedBuilder()
      .setTitle("Magic 8-Ball")
      .setDescription(
        `**You're question is:** \n${question} \n\n**The Magic 8-Ball responded with:**`
      )
      .setImage(randomResponse)
      .setColor(color.midnightBlue);

    await interaction.reply({ embeds: [embed] });
  },
};
