const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    const loggingType = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "logging_type",
      "guild_id",
      newMessage.guild.id
    );

    if (!loggingType) {
      return;
    } else if (
      loggingType === "all" ||
      loggingType === "auditLogging" ||
      loggingType === "message"
    ) {
      const logChannelId = await MySQL.getValueFromTableWithCondition(
        "guilds",
        "logging_channel",
        "guild_id",
        newMessage.guild.id
      );
      const logChannel = newMessage.guild.channels.cache.get(logChannelId);

      if (!logChannel) {
        console.log(`${logChannelId} not found.`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Message Updated`)
        .setDescription(
          `> **Channel:** ${newMessage.channel} (||${newMessage.channel.id}||) \n> **Message ID:** ${newMessage.id} \n> **Message Author:** <@${newMessage.author.id}`
        )
        .addFields(
          {
            name: "Before Edit:",
            value: `\`\`\`${oldMessage.content}\`\`\``,
          },
          {
            name: "After Edit:",
            value: `\`\`\`${newMessage.content}\`\`\``,
          }
        )
        .setColor("Orange")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: newMessage.client.user.displayAvatarURL(),
        });
      logChannel.send({ embeds: [embed] });
    }
  },
};
