const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

embeds = new Collection();

const foldersPath = path.join(__dirname, ".");
const embedFolders = fs.readdirSync(foldersPath);

for (const folder of embedFolders) {
  const embedsPath = path.join(foldersPath, folder);
  const embedFiles =
    folder === "index.js"
      ? []
      : fs.readdirSync(embedsPath).filter((file) => file.endsWith(".js"));

  for (const file of embedFiles) {
    const filePath = path.join(embedsPath, file);
    const embed = require(filePath);

    if ("embed" in embed) {
      embeds.set(file.split(".js")[0], embed.embed);
    } else {
      console.log(
        `[WARNING]: The embed at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

module.exports = embeds;
