const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ChannelType,
  Embed,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const delay = require("node:timers/promises").setTimeout;
const config = require("./config.js");
const color = require("./models/colors.js");
const colors = require("./models/colors.js");
const MySQL = require("./models/mysql.js");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  allowedMentions: { parse: ["users", "roles", "everyone"], repliedUser: true },
});

client.embeds = require("./embeds");

client.interactions = {
  commands: new Collection(),
  components: new Collection(),
};

const numericRegex = /&[0-9]+$/;

//////// Prefix Commands ///////|
// --- Developer Commands --- //|
////////////////////////////////|
client.on("messageCreate", async (message) => {
  const prefix = "-!";

  if (!message.content.startsWith(prefix) || message.author.bot) return; // return if the prefix doesn't match the set dev prefix.

  if (
    message.author !== config.developer.dev1Id && // Kier
    message.author !== config.developer.dev2Id // Red
  ) {
    const permissionErrorEmbed = require('./embeds/errors/permissionsError.js');
    const permissionsError = permissionErrorEmbed.embed(message); // for prefix commands, we can call the embed from the file directly, if we make more prefix cmds I will make an alternative way of doing this.
    return await message.reply({ embeds: [permissionsError], ephemeral: true });
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLocaleLowerCase();
  const guildId = message.guild.id;

  if (command === "bot-restart") {
    if (guildId !== config.developer.devGuild) return; // return if the guild doesn't match the dev guild (support server)

    message.channel.send(
      "Gekkō is now restarting; this will take a few seconds..."
    );
    const logChannel = client.guilds.cache
      .get(config.developer.devGuild)
      .channels.cache.get(config.developer.devTestChannel);

    const logEmbed = new EmbedBuilder()
      .setTitle("Gekkō Restart")
      .setColor(`${color.bot}`)
      .addFields(
        {
          name: "Restarter",
          value: `${message.author}`,
          inline: true,
        },
        {
          name: "Restarter ID",
          value: `${message.author.id}`,
          inline: true,
        }
      );

    logChannel.send({ embeds: [logEmbed] });
    delay(); // delay by 100ms
    process.exit(); // kill the bot and wait for pterodactyl to boot it.
  }

  if (command === "bot-stats") { // there was a if statement to check for our IDs here I don't know why...
    if (guildId !== config.developer.devGuild) return;

    const logChannel = client.guilds.cache
      .get(config.developer.devGuild) // this wasn't the config version for some reason it was set to the guild ID, so I changed it :P
      .channels.cache.get(config.developer.devLogChannel); // same for this but I changed it.
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);

    totalSeconds %= 86400;

    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days} days, ${hours} hours, ${minutes} minutes & ${seconds} seconds`;
    let latency = `${client.ws.ping}ms`;

    const logEmbed = new EmbedBuilder()
      .setTitle("Gekkō Stats Log")
      .setColor(color.bot)
      .setThumbnail(message.author.displayAvatarURL())
      .addFields(
        {
          name: "Requester",
          value: `${message.author}`,
          inline: true,
        },
        {
          name: "Requester ID",
          value: `${message.author.id}`,
          inline: true,
        }
      );

    const statEmbed = new EmbedBuilder()
      .setTitle("Gekkō Bot Stats")
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(color.bot)
      .addFields(
        {
          name: "Server Amount",
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: "Latency",
          value: `${latency}`,
          inline: true,
        },
        {
          name: "Client ID",
          value: `${client.user.id}`,
          inline: true,
        },
        {
          name: "Uptime",
          value: `\`\`\`${uptime}\`\`\``,
          inline: false,
        }
      );

    message.channel.send({ embeds: [statEmbed] });
    logChannel.send({ embeds: [logEmbed] });
  }

  if (command === "restrict-guild") {
    const restrictedValue = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "restricted_guild",
      "guild_id",
      message.guild.id
    );

    if (!numericRegex.test(args)) {
      client.embeds.get("guildRestricted");
    }

    if (message.guild.id === config.developer.devGuild) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("**Restriction Error: 50100**")
        .addFields({
          name: "Error Message:",
          value: "```You can not restrict the development guild.```",
        });

      message.channel.send({ embeds: [errorEmbed] });
    }
    // I want to say that there is a better to do this (at least a cleaner and smaller version of this code) but I don't have any ideas.
    if (restrictedValue === "true") {
      const errorEmbed = new EmbedBuilder()
        .setTitle("**Restriction Error: 50110**") // restriction error ID
        .addFields({
          name: "Error Message:", // title
          value: "```You can not restrict a guild that is not restricted.```", // error message
        });

      message.channel.send({ embeds: [errorEmbed] }); // send the embed
    }

    if (numericRegex.test(args)) {
      const successEmbed = new EmbedBuilder()
        .setDescription("Successfully unrestricted guild!")
        .setColor("Green")
        .setFooter({
          text: "Gekkō Development",
          iconURL: config.assets.gekkoLogo,
        });

      message.channel.send({ embeds: [successEmbed] });
      MySQL.updateValueInTableWithCondition(
        "guilds",
        "restricted_guild",
        "true",
        "guild_id",
        message.guild.id
      );
    }
  }

  if (command === "unrestrict-guild") {
    const restrictedValue = await MySQL.getValueFromTableWithCondition(
      "guilds",
      "restricted_guild",
      "guild_id",
      message.guild.id
    );

    if (!numericRegex.test(args)) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("**Restriction Error: 50115**")
        .addFields({
          name: "Error Message:",
          value: "```You must put in only numbers to unrestrict a guild.```",
        });

      message.channel.send({ embeds: [errorEmbed] });
    }

    if (restrictedValue === "false") {
      const errorEmbed = new EmbedBuilder()
        .setTitle("**Restriction Error: 50112**")
        .addFields({
          name: "Error Message:",
          value: "```You can not unrestrict a guild that is not restricted.```",
        });

      message.channel.send({ embeds: [errorEmbed] });
    } else {
      const successEmbed = new EmbedBuilder()
        .setDescription("Successfully unrestricted guild!")
        .setColor("Green")
        .setFooter({
          text: "Gekkō Development",
          iconURL: client.user.displayAvatarURL(),
        });

      MySQL.updateValueInTableWithCondition(
        "guilds",
        "restricted_guild",
        "false",
        "guild_id",
        message.guild.id
      );

      message.channel.send({ embeds: [successEmbed] });
    }
  }
});

//////// Prefix Commands ////////|
// ------ User Commands ------ //|
/////////////////////////////////|
client.on("messageCreate", async (message) => {
  const guildId = message.guild.id;
  const guildPrefix = await MySQL.getValueFromTableWithCondition(
    "guilds",
    "guild_prefix",
    "guild_id",
    guildId
  );
  let prefix = guildPrefix;

  const restricted = MySQL.getValueFromTableWithCondition(
    "guilds",
    "restricted_guild",
    "guild_id",
    guildId
  );

  if (restricted === "true") {
    const permissionErrorEmbed = client.embed.get('guildRestricted');
    return await interaction.reply({
      embeds: [permissionErrorEmbed],
      ephemeral: true,
    });
  }

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLocaleLowerCase();

  if (command === "help") {
    const options = [
      {
        label: "General Commands",
        emoji: "1️⃣",
        value: "general_commands",
      },
      {
        label: "Admin Commands",
        emoji: "2️⃣",
        value: "admin_commands",
      },
      {
        label: "Moderation Commands",
        emoji: "3️⃣",
        value: "moderation_commands",
      },
      {
        label: "Anime Commands",
        emoji: "4️⃣",
        value: "anime_commands",
      },
      {
        label: "Minigame Commands",
        emoji: "5️⃣",
        value: "minigame_commands",
      },
      {
        label: "Fun Commands",
        emoji: "6️⃣",
        value: "fun_commands",
      },
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("command_select_prefix")
      .setPlaceholder("Select a category")
      .addOptions(options);

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);

    const helpEmbed = new EmbedBuilder()
      .setTitle("Gekkō Command Library")
      .setDescription("Please select a category from the dropdown menu below:")
      .setColor(colors.bot)
      .setImage(config.assets.gekkoBanner);

    await message.channel.send({
      embeds: [helpEmbed],
      components: [actionRow],
    });

    const filter = (i) =>
      i.customId === "command_select_prefix" && i.user.id === message.author.id;
    const collector = message.channel.createMessageCollector({
      filter,
      time: null,
      max: 1,
    });

    collector.on("end", async (collected) => {
      const val = collected.first().values[0];

      try {
        switch (val) {
          case "general_commands":
            const gCom = new EmbedBuilder()
              .setTitle("General Commands:")
              .addFields(
                {
                  name: "Commands",
                  value: "Help \nPing \nBug Report \nGekko",
                  inline: true,
                },
                {
                  name: "Usage:",
                  value:
                    "`!help`, `/help` \n`!ping`, `/ping` \n`!bugreport`, `/bug-report` \n`!gekko`, `/gekko`",
                  inline: true,
                }
              )
              .setImage(config.assets.gekkoBanner);

            await message.edit({ embeds: [gCom], components: [actionRow] });
            break;

          case "admin_commands":
            const aCom = new EmbedBuilder()
              .setTitle("Admin Commands:")
              .addFields(
                {
                  name: "Commands",
                  value:
                    "Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko",
                  inline: true,
                },
                {
                  name: "Commands",
                  value:
                    "/set-logging-channel \n!set-prefix \n/set-welcome \nGekko",
                  inline: true,
                }
              )
              .setImage(config.assets.gekkoBanner);

            await message.edit({ embeds: [aCom], components: [actionRow] });
            break;

          case "moderation_commands":
            const mCom = new EmbedBuilder()
              .setTitle("Moderation Commands:")
              .addFields(
                {
                  name: "Commands",
                  value:
                    "Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko",
                  inline: true,
                },
                {
                  name: "Commands",
                  value:
                    "/set-logging-channel \n!set-prefix \n/set-welcome \nGekko",
                  inline: true,
                }
              )
              .setImage(config.assets.gekkoBanner);

            await message.edit({ embeds: [mCom], components: [actionRow] });
            break;

          case "anime_commands":
            const animCom = new EmbedBuilder()
              .setTitle("Anime Commands:")
              .addFields(
                {
                  name: "Commands",
                  value:
                    "Anime Character \nAnime Info \nAnime Quotes \nHug \nWaifu",
                  inline: true,
                },
                {
                  name: "Commands",
                  value:
                    "/anime-character \n!anime-info \n/anime-quotes \n/hug \n/waifu",
                  inline: true,
                }
              )
              .setImage(config.assets.gekkoBanner);

            await message.edit({ embeds: [animCom], components: [actionRow] });
            break;

          case "minigame_commands":
            const miniCom = new EmbedBuilder()
              .setTitle("Minigame Commands:")
              .addFields(
                {
                  name: "Commands",
                  value:
                    "Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko",
                  inline: true,
                },
                {
                  name: "Commands",
                  value:
                    "/set-logging-channel \n!set-prefix \n/set-welcome \nGekko",
                  inline: true,
                }
              )
              .setImage(config.assets.gekkoBanner);

            await message.edit({ embeds: [miniCom], components: [actionRow] });
            break;

          case "fun_commands":
            const fCom = new EmbedBuilder()
              .setTitle("Fun Commands:")
              .addFields(
                {
                  name: "Commands",
                  value:
                    "Set Logging Channel \nSet Command Prefix \nSet Welcome \nGekko",
                  inline: true,
                },
                {
                  name: "Commands",
                  value:
                    "/set-logging-channel \n!set-prefix \n/set-welcome \nGekko",
                  inline: true,
                }
              )
              .setImage(config.assets.gekkoBanner);

            await message.edit({ embeds: [fCom], components: [actionRow] });
            break;

          default:
            break;
        }
      } catch (err) {
        // Do nothing
      }
    });
  }

  if (command === "gekko" || command === "Gekkō" || command === "gekkō") {
    const supportServer = new ButtonBuilder()
      .setLabel("Support Server")
      .setURL("https://discord.gg/RjxA7wH2fE")
      .setStyle(ButtonStyle.Link);

    const documentation = new ButtonBuilder()
      .setLabel("Gekkō Docs")
      .setURL("https://gekko-2.gitbook.io/gekko")
      .setStyle(ButtonStyle.Link);

    const inviteUs = new ButtonBuilder()
      .setLabel("Invite Gekkō")
      .setURL("https://www.google.com")
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(
      supportServer,
      documentation,
      inviteUs
    );

    const gekkoEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username} Development`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(color.bot)
      .setTitle("Welcome to Gekkō!")
      .setDescription(
        "```\nIntroducing Gekkō, your new Discord companion! 🌟 Packed with utility commands for easy server management, fun minigames for entertainment, and a touch of anime magic, Gekkō brings joy and efficiency to your Discord server. ✨ Gekkō really does elevate your Discord experience! 🎉```"
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&"
      )
      .addFields(
        {
          name: "Getting Started:",
          value:
            "• You can get started by running the `/help` command, to view all of our available commands. Alternatively, you can visit our documentation below!",
          inline: false,
        },
        {
          name: "Version",
          value: "`v1.0.0.a1`",
          inline: true,
        },
        {
          name: "Change Log",
          value: "[Gekkō Dev Log](https://gekko-2.gitbook.io/gekk-dev-log/)",
          inline: true,
        }
      );

    await message.channel.send({ embeds: [gekkoEmbed], components: [row] });
  }

  if (command === "ping") {
    const sent = await message.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    const timeDiff = sent.createdTimestamp - message.createdTimestamp;

    const pingEmbed = new EmbedBuilder()
      .setTitle("🏓 Gekkō's Latency Data")
      .setDescription(
        `> ***Latency:*** \n> \`${timeDiff}ms\` \n\n> ***API Latency:*** \n> \`${Math.round(
          client.ws.ping
        )}ms\``
      )
      .setColor(colors.bot)
      .setFooter({ text: "Gekko", iconURL: client.user.avatarURL() });

    await message.channel.send({ content: " ", embeds: [pingEmbed] });
  }
});

//////////////////////////////////

for (type of ["commands", "components"]) {
  const foldersPath = path.join(__dirname, `interactions/${type}`);
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        client.interactions[type].set(command.data.name, command);
      } else {
        console.log(
          `[WARNING]: The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(config.bot.token);
