import MySQL from '../../../models/mysql.js';

export default {
  data: { name: "confirm_nsfw_2" },
  async execute(interaction) {
    await interaction.deferUpdate();

    const success = embeds.get("nsfwEnabled")(interaction);
    await MySQL.editColumnInGuilds(
      interaction.guild.id,
      "nsfw_enabled",
      "true"
    );
    await interaction.message.edit({
      embeds: [success],
      components: [],
      ephemeral: true,
    });
  },
};
