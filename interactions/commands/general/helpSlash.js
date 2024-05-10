const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../../../config.js");
const colors = require("../../../models/colors.js");
const MySQL = require("../../../models/mysql");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View Gekkō's command library."),
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

    const options = [
      {
        label: "General Commands",
        emoji: "1️⃣",
        value: "general_commands",
      },
      {
        label: "Admin Commands",
        emoji: "2️⃣",
        value: "admin_commands",
      },
      {
        label: "Moderation Commands",
        emoji: "3️⃣",
        value: "moderation_commands",
      },
      {
        label: "Anime Commands",
        emoji: "4️⃣",
        value: "anime_commands",
      },
      {
        label: "Minigame Commands",
        emoji: "5️⃣",
        value: "minigame_commands",
      },
      {
        label: "Fun Commands",
        emoji: "6️⃣",
        value: "fun_commands",
      },
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("helpSelectMenu")
      .setPlaceholder("Select a category")
      .addOptions(options);

    const docuBtn = new ButtonBuilder()
      .setEmoji(config.emojis.gekko)
      .setURL(`https://gekko-2.gitbook.io/gekko`)
      .setStyle(ButtonStyle.Link)
      .setLabel("Documentation");

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);
    const actionRow2 = new ActionRowBuilder().addComponents(docuBtn);

    const helpEmbed = new EmbedBuilder()
      .setTitle("Gekkō Command Library")
      .setDescription("Please select a category from the dropdown menu below:")
      .setColor(colors.bot)
      .setImage(config.assets.gekkoBanner);

    await interaction.reply({
      embeds: [helpEmbed],
      components: [actionRow, actionRow2],
    });
  },
};
