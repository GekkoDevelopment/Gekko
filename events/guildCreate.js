const { Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const MySQL = require("../models/mysql.js");
const config = require("../config.js");

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {
    const guildId = guild.id;
    const columns = ["guild_id"];

    const values = [
      `${guildId}`, // guild_id
    ];

    MySQL.valueExistsInGuildsColumn(guildId, "guild_id", guildId).then(
      (exists) => {
        if (exists) {
          MySQL.updateColumnInfo(guildId, "guild_id", guildId);
        } else {
          MySQL.insertIntoGuildTable(columns, values);
        }
      }
    );

    const owner = await guild.fetchOwner();
    const ownerTag = owner ? owner.user.tag : "Unknown Owner";

    const guildCreateEmbed = new EmbedBuilder()
      .setTitle("I just joined another guild!")
      .setColor("Green")
      .addFields(
        {
          name: "Guild Name",
          value: `\`${guild.name}\``,
          inline: true,
        },
        {
          name: "Guild ID:",
          value: `\`${guild.id}\``,
          inline: true,
        },
        {
          name: "Owner",
          value: `\`${ownerTag}\``,
          inline: true,
        },
        {
          name: "Member Count",
          value: `\`${guild.memberCount}\``,
          inline: true,
        },
        {
          name: "Boost Level",
          value: `\`${guild.premiumTier}\``,
          inline: true,
        },
        {
          name: "Region",
          value: `\`${guild.region}\``,
          inline: true,
        }
      )
      .setTimestamp();

    const client = guild.client;
    const loggingChannelId = config.developer.devTestLogChannel;
    const loggingChannel = client.channels.cache.get(loggingChannelId);
    await loggingChannel.send({ embeds: [guildCreateEmbed] });
  },
};
