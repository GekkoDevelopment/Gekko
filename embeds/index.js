import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { Collection } from 'discord.js';
const embeds = new Collection();

const __dirname = dirname(fileURLToPath(import.meta.url));

const foldersPath = `${os.platform() === 'win32' ? '.\\embeds' : `${__dirname}`}`;
const importFoldersPath = `${os.platform() === 'win32' ? 'file:\\' : ''}${__dirname}`
const embedFolders = fs.readdirSync(foldersPath);

for (const folder of embedFolders) {
    const embedsPath = `${foldersPath}/${folder}`;
    const embedFiles = folder==='index.js' ? [] : fs.readdirSync(embedsPath).filter(file => file.endsWith('.js'));

    for (const file of embedFiles) {
        const filePath = `${importFoldersPath}\\${folder}\\${file}`;
        console.log(filePath);
        const embed = (await import(filePath))?.default;

        if ('embed' in embed) {
            embeds.set(file.split('.js')[0],embed.embed);
        } else {
            console.log(`[WARNING]: The embed at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

export default embeds;