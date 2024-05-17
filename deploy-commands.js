import { REST, Routes } from 'discord.js';
import config from './config.js';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { Collection } from 'discord.js';

const commands = [];

const __dirname = dirname(fileURLToPath(import.meta.url));

const _dirname = `${os.platform() === 'win32' ? '.\\' : `${__dirname}`}`;
const importFoldersPath = `${os.platform() === 'win32' ? 'file:\\' : ''}${__dirname}`

function flatten(obj, ...props) {
    if (!isObject(obj)) return obj;
  
    const objProps = Object.keys(obj)
      .filter(key => !key.startsWith('_'))
      .map(key => ({ [key]: true }));
  
    props = objProps.length ? Object.assign(...objProps, ...props) : Object.assign({}, ...props);
  
    const out = {};
  
    for (let [prop, newProp] of Object.entries(props)) {
      if (!newProp) continue;
      newProp = newProp === true ? prop : newProp;
  
      const element = obj[prop];
      const elemIsObj = isObject(element);
      const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;
      const hasToJSON = elemIsObj && typeof element.toJSON === 'function';
  
      // If it's a Collection, make the array of keys
      if (element instanceof Collection) out[newProp] = Array.from(element.keys());
      // If the valueOf is a Collection, use its array of keys
      else if (valueOf instanceof Collection) out[newProp] = Array.from(valueOf.keys());
      // If it's an array, call toJSON function on each element if present, otherwise flatten each element
      else if (Array.isArray(element)) out[newProp] = element.map(elm => elm.toJSON?.() ?? flatten(elm));
      // If it's an object with a primitive `valueOf`, use that value
      else if (typeof valueOf !== 'object') out[newProp] = valueOf;
      // If it's an object with a toJSON function, use the return value of it
      else if (hasToJSON) out[newProp] = element.toJSON();
      // If element is an object, use the flattened version of it
      else if (typeof element === 'object') out[newProp] = flatten(element);
      // If it's a primitive
      else if (!elemIsObj) out[newProp] = element;
    }
  
    return out;
  }

  const isObject = d => typeof d === 'object' && d !== null;

for(let type of ['commands']){
    const foldersPath = `${_dirname}/interactions/${type}`//;path.join(__dirname, `interactions/${type}`);
    const commandFolders = fs.readdirSync(foldersPath);
    
    for (const folder of commandFolders) {
        const commandsPath = `${foldersPath}/${folder}`;
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = `${importFoldersPath}\\interactions\\${type}\\${folder}\\${file}`;
            //const filePath = path.join(commandsPath, file);
            const command = (await import(filePath))?.default;
    
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING]: The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

const rest = new REST({ version: '9' }).setToken(config.bot.token);

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
