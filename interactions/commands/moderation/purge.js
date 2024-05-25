import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Bulk delete messages")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount to delete")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);

    try {
      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
      ) {
        const permissionErrorEmbed =
          embeds.get("permissionsError")(interaction);
        return await interaction.reply({
          embeds: [permissionErrorEmbed],
          ephemeral: true,
        });
      }

      if (
        !interaction.guild.members.me.permissions.has(
          PermissionFlagsBits.ManageMessages
        )
      ) {
        const permissionErrorEmbed = embeds.get("botPermissionsError")(
          interaction
        );
        return await interaction.reply({
          embeds: [permissionErrorEmbed],
          ephemeral: true,
        });
      }

      const amount = interaction.options.getInteger("amount");

      if (amount > 100) {
        const permissionErrorEmbed = new EmbedBuilder()
          .setTitle("Command Error:")
          .addFields({
            name: "Error Message",
            value: "```\nYou cannot delete more than 100 messages```",
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

      if (isNaN(amount)) {
        const permissionErrorEmbed = new EmbedBuilder()
          .setTitle("Command Error")
          .addFields({
            name: "Error Message:",
            value: "```\nPlease Supply A Valid Amount To Delete Messages!```",
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

      interaction.channel
        .bulkDelete(amount, { filterOld: true })
        .then(async (messages) => {
          const successEmbed = new EmbedBuilder()
            .setTitle("Purge Complete!")
            .setDescription(
              `**Succesfully deleted \`${messages.size}/${amount}\` messages**`
            )
            .setAuthor({
              name: "Gekko",
              iconURL: interaction.client.user.avatarURL(),
            })
            .setColor("Green");
          await interaction.reply({ embeds: [successEmbed] });

          setTimeout(() => {
            interaction.deleteReply();
          }, 2500);
        })
        .catch(() => null);
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
