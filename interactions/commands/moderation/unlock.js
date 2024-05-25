import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import config from '../../../config.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
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
    DiscordExtensions.checkIfRestricted(interaction);

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
        .setTitle(`${config.emojis.passed} Channel Unlocked`)
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
        .setTitle(`${config.emojis.passed} Channel Unlocked`)
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
