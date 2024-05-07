const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { emojis } = require("../../../config");
const MySQL = require("../../../models/mysql");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Chose a channel to unlock")
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

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)
    ) {
      const errorEmbed = embeds.get("permissionsError")(interaction);
      return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageChannels
      )
    ) {
      const errorEmbed = embeds.get("botPermissionsError")(interaction);
      return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const channel = interaction.options.getChannel("channel");
    const user = interaction.user;

    try {
      const unlockedEmbed = new EmbedBuilder()
        .setTitle(`${emojis.passed} Channel Unlocked`)
        .setDescription("This channel has been unlocked")
        .addFields({
          name: "Moderator:",
          value: `<@${user.id}>`,
          inline: true,
        })
        .setFooter({
          text: "Gekkō",
          iconURL: interaction.client.user.avatarURL(),
        })
        .setTimestamp()
        .setColor("Green");

      const successEmbed = new EmbedBuilder()
        .setTitle(`${emojis.passed} Channel Unlocked`)
        .setDescription(`${channel} successfully unlocked.`)
        .setColor("Green")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: interaction.client.user.avatarURL(),
        });

      await channel.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: true,
      });
      await interaction.reply({ embeds: [successEmbed], ephemeral: true });
      await channel.send({ embeds: [unlockedEmbed] });
    } catch (error) {
      console.log(error);
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