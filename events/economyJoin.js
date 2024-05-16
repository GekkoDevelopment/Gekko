import { Events } from 'discord.js';
import MySQL from '../models/mysql'

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const guildId = member.guild.id;

    // economy stuff
    const econEnabled = await MySQL.getValueFromTableWithCondition(
      'guilds', 
      'economy_enabled', 
      'guild_id', 
      guildId
    );

    const econDefaultAmount = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "starting_amount",
      "guild_id",
      guildId
    );

    if (econEnabled === "true") {
      await MySQL.bulkInsertOrUpdate('economy', ['guild_id', 'user_id', 'cash_amount'], [[guildId, member.id, econDefaultAmount]]);
    }
  }
}