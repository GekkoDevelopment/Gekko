const { REST, Routes } = require('discord.js');
const config = require('./config.js');
const fs = require('fs');
const path = require('path');

const commands = [];

const foldersPath = path.join(__dirname, 'interactions/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING]: The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(config.bot.token);

(async () => {
    try {
        console.log(`⚠️ Started refreshing ${commands.length} application (/) commands...`);
        const data = await rest.put(
            Routes.applicationCommands(config.bot.clientId), 
            { body: commands }
        );
        console.log(`⚠️ Reloading Commands...`)
        setTimeout(() => {
            console.log(`✅ Successfully reloaded ${data.length} application (/) commands`);
        }, 2000);
    } catch (err) {
        console.error(err);
    }
})();