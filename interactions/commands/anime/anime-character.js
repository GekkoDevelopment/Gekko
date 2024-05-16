import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import fetch from 'node-fetch';
import colors from '../../../models/colors.js';
import config from '../../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName("anime-character")
    .setDescription("Look up information about a specific anime character.")
    .addStringOption((option) =>
      option
        .setName("character")
        .setDescription("The anime character to get information from.")
        .setRequired(true)
    ),
  async execute(interaction) {
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

    try {
      const characterName = interaction.options.getString("character");
      let option = {
        url: `https://kitsu.io/api/edge/characters?filter[name]=${characterName}`,
        method: `GET`,
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
      };

      const response = await fetch(option.url, option);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const characterInfo = data.data[0];

        const embed = new EmbedBuilder()
          .setTitle(`${characterInfo.attributes.canonicalName}`)
          .setColor(colors.bot)
          .setImage(characterInfo.attributes.image.original)
          .setFooter({
            text: characterInfo.attributes.slug || "No slug data",
            iconURL: interaction.client.user.avatarURL(),
          });

        await interaction.reply({ embeds: [embed] });
      } else {
        const errorEmbed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Search Error:`)
          .setColor("Red")
          .setDescription("No character found with that name.")
          .setTimestamp()
          .setFooter({
            text: "Gekkō Development",
            iconURL: interaction.client.user.displayAvatarURL(),
          });
        await interaction.reply({ embeds: [errorEmbed] });
      }
    } catch (error) {
      const stackLines = error.stack.split("\n");
      const relevantLine = stackLines[1];
      const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
      const errorDescription = error.message;

      const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
        errorMessage,
        errorDescription,
      });
      await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
    }
  },
};
