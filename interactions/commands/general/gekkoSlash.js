import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import MySQL from '../../../models/mysql.js';

export default {
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

    const gekkoEmbed = embeds.get('gekkoDetails')(interaction);
    await interaction.reply({ embeds: [gekkoEmbed], components: [row] });
  },
};
