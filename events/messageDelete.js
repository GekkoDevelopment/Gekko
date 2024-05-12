const { Events, EmbedBuilder } = require("discord.js");
const config = require("../config");
const MySQL = require("../models/mysql");

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    let logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "message_channel",
      "guild_id",
      message.guild.id
    );
    
    if (!logChannelId) {
      logChannelId = await MySQL.getValueFromTableWithCondition(
        "logging",
        "audit_channel",
        "guild_id",
        message.guild.id
      );
    }
    
    const logChannel = message.guild.channels.cache.get(logChannelId);

    if (!logChannel) {
      return;
    } 

    if (message.content) {
      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Message Deleted`)
        .setDescription(
          `> **Channel:** ${message.channel} (||${message.channel.id}||) \n> **Message ID:** ${message.id} \n> **Message Author:** <@${message.author.id}>`
        )
        .addFields(
          {
            name: "Message Content:",
            value: `\`\`\`${message.content}\`\`\``,
          },
        )
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: message.client.user.displayAvatarURL(),
        });

      await logChannel.send({ embeds: [embed] });
    }
    if (!message.content) {
      const embed = new EmbedBuilder()
        .setTitle(`${config.emojis.warning} Message Deleted`)
        .setDescription(
          `> **Channel:** ${message.channel} (||${message.channel.id}||) \n> **Message ID:** ${message.id} \n> **Message Author:** <@${message.author.id}>`
        )
        .addFields(
          {
            name: "Embed Content:",
            value: `\`\`\`Message was an Embed, we can't embed an embed within an embed.\`\`\``,
          },
        )
        .setColor("Red")
        .setTimestamp()
        .setFooter({
          text: "Gekkō",
          iconURL: message.client.user.displayAvatarURL(),
        });

      await logChannel.send({ embeds: [embed] });
    }
  },
};
