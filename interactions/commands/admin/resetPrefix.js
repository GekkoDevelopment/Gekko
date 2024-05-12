const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const MySQL = require("../../../models/mysql.js");
const config = require("../../../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset-prefix")
    .setDescription('Reset the prefix back to the default which is "!"'),
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

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const permissionErrorEmbed = embeds.get('permissionsError')(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    const guildId = interaction.guild.id;
    const originalPrefix = "!";

    MySQL.editColumnInGuilds(guildId, "guild_prefix", originalPrefix);

    const embed = new EmbedBuilder()
      .setTitle(`${config.emojis.passed} Prefix successfully set`)
      .setDescription("The bot prefix has been set back to: `!`")
      .setColor("Green")
      .setFooter({
        text: "Gekkō",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setImage(config.assets.gekkoBanner);

    interaction.reply({ embeds: [embed] });
  },
};
