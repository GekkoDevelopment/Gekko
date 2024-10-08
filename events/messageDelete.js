import { Events, EmbedBuilder } from 'discord.js';
import MySQL from '../models/mysql.js'
import config from '../config.js';

export default {
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
      return;
    }
  },
};
