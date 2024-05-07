const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const MySQL = require("../../../models/mysql.js");
const { emojis } = require("../../../config.js");
const colors = require("../../../models/colors.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("allow-nsfw")
    .setDescription(
      "The NSFW is off by default. If you want NSFW commands on turn it on using this command."
    )
    .setNSFW(true),
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

    const confirmButton1 = new ButtonBuilder()
      .setLabel("Yes")
      .setCustomId("confirm_nsfw_1")
      .setStyle(ButtonStyle.Success);
    const denyButton1 = new ButtonBuilder()
      .setLabel("No")
      .setCustomId("deny_nsfw_1")
      .setStyle(ButtonStyle.Danger);
    const actionRow1 = new ActionRowBuilder().addComponents(
      confirmButton1,
      denyButton1
    );
    const channel = interaction.channel;
    const isNsfw = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "nsfw_enabled",
      "guild_id",
      interaction.guild.id
    );

    if (
      !channel.nsfw &&
      !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      const permissionErrorEmbed = new EmbedBuilder()
        .setTitle(`${emojis.warning} Permissions Error: 50013`)
        .addFields({
          name: "Error Message:",
          value:
            "```\nYou lack permissions to perform that action, and you are not in a NSFW channel.```",
          inline: true,
        })
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō Development",
          iconURL: interaction.client.user.displayAvatarURL(),
        });

      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    if (
      !channel.nsfw &&
      interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      const permissionErrorEmbed = new EmbedBuilder()
        .setDescription("You are not in a NSFW channel to do this!")
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō Development",
          iconURL: interaction.client.user.displayAvatarURL(),
        });

      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    if (
      channel.nsfw &&
      !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      const permissionErrorEmbed = new EmbedBuilder()
        .setTitle(`${emojis.warning} Permissions Error: 50013`)
        .addFields({
          name: "Error Message:",
          value:
            "```\nYou lack permissions to perform that action, and you are not in a NSFW channel.```",
          inline: true,
        })
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō Development",
          iconURL: interaction.client.user.displayAvatarURL(),
        });

      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    if (isNsfw === "true") {
      const permissionErrorEmbed = new EmbedBuilder()
        .setTitle(`${emojis.warning} Command Error:`)
        .setDescription(" **NSFW** is already enabled in this guild.")
        .setFooter({
          text: "Gekkō",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp()
        .setColor(colors.deepPink);

      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

    const embedConfirmEmbed1 = embeds.get("nsfwConfirm1")(interaction);
    await interaction.reply({
      embeds: [embedConfirmEmbed1],
      components: [actionRow1],
    });
  },
};