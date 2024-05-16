import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js.js';
import color from '../../../models/colors.js.js';
import config from '../../../config.js.js';

export default {
  data: new SlashCommandBuilder()
    .setName("current-prefix")
    .setDescription("Tells you what the current bot prefix is."),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const currentPrefix = await MySQL.getColumnValuesWithGuildId(
      guildId,
      "guild_prefix"
    );

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

    const embed = new EmbedBuilder()
      .setDescription(
        `The current prefix for the bot is: \`${currentPrefix.toString()}\``
      )
      .setColor(color.bot)
      .setImage(config.assets.gekkoBanner);

    interaction.reply({ embeds: [embed] });
  },
};
