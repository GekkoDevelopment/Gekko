const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const color = require("../../../models/colors.js");
const MySQL = require("../../../models/mysql");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gekkō")
    .setDescription("Information about Gekkō"),
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

    const supportServer = new ButtonBuilder()
      .setLabel("Support Server")
      .setURL("https://discord.gg/RjxA7wH2fE")
      .setStyle(ButtonStyle.Link);

    const documentation = new ButtonBuilder()
      .setLabel("Gekkō Docs")
      .setURL("https://gekko-2.gitbook.io/gekko")
      .setStyle(ButtonStyle.Link);

    const inviteUs = new ButtonBuilder()
      .setLabel("Invite Gekkō")
      .setURL("https://www.google.com")
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(
      supportServer,
      documentation,
      inviteUs
    );

    const gekkoEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.client.user.username} Development`,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setColor(color.bot)
      .setTitle("Welcome to Gekkō!")
      .setDescription(
        "```\nIntroducing Gekkō, your new Discord companion! 🌟 Packed with utility commands for easy server management, fun minigames for entertainment, and a touch of anime magic, Gekkō brings joy and efficiency to your Discord server. ✨ Gekkō really does elevate your Discord experience! 🎉```"
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&"
      )
      .addFields(
        {
          name: "Getting Started:",
          value:
            "• You can get started by running the `/help` command, to view all of our available commands. Alternatively, you can visit our documentation below!",
          inline: false,
        },
        {
          name: "Version",
          value: "`v1.0.0.a1`",
          inline: true,
        },
        {
          name: "Change Log",
          value: "[Gekkō Dev Log](https://gekko-2.gitbook.io/gekk-dev-log/)",
          inline: true,
        }
      );

    await interaction.reply({ embeds: [gekkoEmbed], components: [row] });
  },
};
