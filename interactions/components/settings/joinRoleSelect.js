const {  } = require("discord.js");
const MySQL = require("../../../models/mysql");
const { emojis, assets } = require("../../../config");


module.exports = {
  data: { name: "joinRoleSelect" },
  async execute(interaction) {
        const value = interaction.values;
        await MySQL.editColumnInGuilds(interaction.guild.id, "join_role", value.toString());

        const successEmbed = embeds.get('welcomeChannelSuccess')(interaction, {value});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
