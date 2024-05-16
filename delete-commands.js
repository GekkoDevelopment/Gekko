import { REST, Routes } from 'discord.js';
import config from './config.js';
const rest = new REST().setToken(config.bot.token);

// Global
rest
  .put(Routes.applicationCommands(config.bot.clientId), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);

// Guild
// rest.put(Routes.applicationGuildCommands(config.bot.clientId, config.guilds.testGuild), { body: [] }).then(() => console.log('Successfully deleted all application guild commands.')).catch(console.error);
