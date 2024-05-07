const { REST, Routes } = require("discord.js");
const config = require("./config.js");
const fs = require("fs");
const path = require("path");

const commands = [];

// Grab all the command folders from the commands directory.
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command fils from the directory.
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING]: The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST({ version: "9" }).setToken(config.bot.token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(config.bot.clientId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands`
    );
  } catch (err) {
    console.error(err);
  }
})();
