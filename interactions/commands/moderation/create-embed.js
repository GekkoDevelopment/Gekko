import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';

export default {
  data: new SlashCommandBuilder()
    .setName("create-embed")
    .setDescription("Create a custom embed!")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Set the title of the custom embed.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Set the description of the embed.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("The color of the embed. (you can use hex code too!)")
    )
    .addStringOption((option) =>
      option
        .setName("field-name")
        .setDescription("The field name of the embed.")
    )
    .addStringOption((option) =>
      option
        .setName("field-value")
        .setDescription("The field value of the embed.")
    )
    .addStringOption((option) =>
      option.setName("footer-text").setDescription("The text of the footer.")
    )
    .addStringOption((option) =>
      option
        .setName("footer-image-url")
        .setDescription("The image url for the footer.")
    )
    .addStringOption((option) =>
      option
        .setName("thumbnail-url")
        .setDescription("The thumbnail for the embed.")
    )
    .addStringOption((option) =>
      option.setName("image").setDescription("The image of the embed.")
    ),
  async execute(interaction) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const color = interaction.options.getString("color");
    const fieldName = interaction.options.getString("field-name");
    const fieldValue = interaction.options.getString("field-value");
    const footerText = interaction.options.getString("footer-text");
    const footerImageUrl = interaction.options.getString("footer-image-url");
    const thumbnailUrl = interaction.options.getString("thumbnail-url");
    const image = interaction.options.getString("image");

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

    if (image) {
      if (!image.startsWith("http")) {
        return await interaction.reply({
          content: "You can't make this your image! (Reason: Starts with HTTP)",
          ephemeral: true,
        });
      }
    }

    if (thumbnailUrl) {
      if (!thumbnailUrl.startsWith("http")) {
        return await interaction.reply({
          content:
            "You can't use make this your thumbnail! (Reason: Starts with HTTP)",
          ephemeral: true,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(`0x${color}`)
      .setImage(image)
      .setThumbnail(thumbnailUrl)
      .setImage(image)
      .setTimestamp()
      .addFields({
        name: `${fieldName}`,
        value: `${fieldValue}`,
      })
      .setFooter({ text: `${footerText}`, iconURL: `${footerImageUrl}` });

    await interaction.reply({
      content: "Your embed has sent below!",
      ephemeral: true,
    });
    await interaction.channel.send({ embeds: [embed] });
  },
};
