import MySQL from '../../../models/mysql';

export default {
  data: { name: "deny_nsfw_2" },
  async execute(interaction) {
    await interaction.deferUpdate();

    await interaction.message.edit({
      content: "Alright we cancelled it.",
      embeds: [],
      components: [],
    });
    await MySQL.editColumnInGuilds(
      interaction.guild.id,
      "nsfw_enabled",
      "false"
    );
  },
};
