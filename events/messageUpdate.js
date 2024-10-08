import { Events, EmbedBuilder } from 'discord.js';
import MySQL from '../models/mysql.js'
import config from '../config.js';

export default {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    if (newMessage.author.bot) {
      return;
    };

    let logChannelId = await MySQL.getValueFromTableWithCondition(
      "logging",
      "message_channel",
      "guild_id",
      newMessage.guild.id
    );

    if (!logChannelId) {
      logChannelId = await MySQL.getValueFromTableWithCondition(
        "logging",
        "audit_channel",
        "guild_id",
        newMessage.guild.id
      );
    }
    
    const logChannel = newMessage.guild.channels.cache.get(logChannelId);

    if (!logChannel) {
      return;
    }

    if (newMessage.author.id === '1241043340510625804' || oldMessage.author.id === '1241043340510625804') return;

    const embed = new EmbedBuilder()
      .setTitle(`${config.emojis.warning} Message Updated`)
      .setDescription(
        `> **Channel:** ${newMessage.channel} (||${newMessage.channel.id}||) \n> **Message ID:** ${newMessage.id} \n> **Message Author:** <@${newMessage.author.id}>`
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
  },
};
