import MySQL from '../../../models/mysql';

module.exports = {
  data: { name: "deny_nsfw_1" },
  async execute(interaction) {
    await interaction.deferUpdate();

    await MySQL.editColumnInGuilds(
      interaction.guild.id,
      "nsfw_enabled",
      "false"
    );
    await interaction.message.edit({
      content: "Alright we cancelled it.",
      embeds: [],
      components: [],
    });
  },
};
