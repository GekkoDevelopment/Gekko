const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../../../config.js");
const colors = require("../../../models/colors.js");
const MySQL = require("../../../models/mysql");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View Gekkō's command library."),
  async execute(interaction) {
    const restricted = MySQL.getValueFromTableWithCondition(
      "guilds",
      "restricted_guild",
      "guild_id",
      interaction.guild.id
    );

    if (restricted === "true") {
      const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
      return await interaction.reply({
        embeds: [permissionErrorEmbed],
        ephemeral: true,
      });
    }

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
      .setCustomId("command_select")
      .setPlaceholder("Select a category")
      .addOptions(options);

    const docuBtn = new ButtonBuilder()
      .setEmoji(config.emojis.gekko)
      .setURL(`https://gekko-2.gitbook.io/gekko`)
      .setStyle(ButtonStyle.Link)
      .setLabel("Documentation");

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);
    const actionRow2 = new ActionRowBuilder().addComponents(docuBtn);

    const helpEmbed = new EmbedBuilder()
      .setTitle("Gekkō Command Library")
      .setDescription("Please select a category from the dropdown menu below:")
      .setColor(colors.bot)
      .setImage(config.assets.gekkoBanner);

    await interaction.reply({
      embeds: [helpEmbed],
      components: [actionRow, actionRow2],
    });

    const filter = (i) =>
      i.customId === "command_select" && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: null,
      max: null,
    });

    collector.on("collect", async (interaction) => {
      const value = interaction.values[0];
      try {
        if (value === "general_commands") {
          await interaction.deferUpdate();
          const gCom = new EmbedBuilder()
            .setTitle("General Commands:")
            .addFields(
              {
                name: "Commands",
                value: "Help \nPing \nBug Report \nGekko",
                inline: true,
              },
              {
                name: "Usage",
                value:
                  "`!help`, `/help` \n`!ping`, `/ping` \n`!bugreport`, `/bug-report` \n`!gekko`, `/gekko`",
                inline: true,
              }
            )
            .setImage(config.assets.gekkoBanner)
            .setColor(colors.bot)
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await interaction.editReply({
            embeds: [gCom],
            components: [actionRow, actionRow2],
          });
        }
        if (value === "admin_commands") {
          await interaction.deferUpdate();
          const aCom = new EmbedBuilder()
            .setTitle("Admin Commands:")
            .addFields(
              {
                name: "Commands",
                value:
                  "Set Logging Channel \nSet Command Prefix \nSet Welcome \nEnable NSFW \nDisable NSFW \nSet Join Roles \nLockdown Config",
                inline: true,
              },
              {
                name: "Usage",
                value:
                  "`/set-logging` \n`!set-prefix`, `/set-prefix` \n`/set-welcome` \n`/allow-nsfw` \n`/disallow-nsfw` \n`/set-join-roles` \n`/lockdown-config`",
                inline: true,
              }
            )
            .setImage(config.assets.gekkoBanner)
            .setColor(colors.bot)
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await interaction.editReply({
            embeds: [aCom],
            components: [actionRow, actionRow2],
          });
        }
        if (value === "moderation_commands") {
          await interaction.deferUpdate();
          const mCom = new EmbedBuilder()
            .setTitle("Moderation Commands:")
            .addFields(
              {
                name: "Commands",
                value:
                  "Ban a user \nCreate Embed \nKick a user \nLock a channel \nServer Lockdown \nServer Unlock \nMute a user \nPurge \nUnlock a channel",
                inline: true,
              },
              {
                name: "Usage",
                value:
                  "`/ban` \n`/create-embed` \n`/kick` \n`/lock` \n`/lockdown-start` \n`/lockdown-end` \n`/mute` \n`/purge` \n`/unlock`",
                inline: true,
              }
            )
            .setImage(config.assets.gekkoBanner)
            .setColor(colors.bot)
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await interaction.editReply({
            embeds: [mCom],
            components: [actionRow, actionRow2],
          });
        }
        if (value === "anime_commands") {
          await interaction.deferUpdate();
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
                name: "Usage",
                value:
                  "`/anime-character` \n`!anime-info`, `/anime-info` \n`/anime-quotes` \n`/hug` \n`/waifu`",
                inline: true,
              }
            )
            .setImage(config.assets.gekkoBanner)
            .setColor(colors.bot)
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await interaction.editReply({
            embeds: [animCom],
            components: [actionRow, actionRow2],
          });
        }
        if (value === "minigame_commands") {
          await interaction.deferUpdate();
          const miniCom = new EmbedBuilder()
            .setTitle("Minigame Commands:")
            .addFields(
              {
                name: "Commands",
                value:
                  "Connect Four \nGuess the Logo \nMinesweeper \nSnake \nTicTacToe \nWhat's that Pokemon \nWordle",
                inline: true,
              },
              {
                name: "Usage",
                value:
                  "`/connect-4` \n`/guess-the-logo` \n`/minesweeper` \n`/snake` \n`/tic-tac-toe` \n`/whats-that-pokemon` \n`wordle`",
                inline: true,
              }
            )
            .setImage(config.assets.gekkoBanner)
            .setColor(colors.bot)
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await interaction.editReply({
            embeds: [miniCom],
            components: [actionRow, actionRow2],
          });
        }
        if (value === "fun_commands") {
          await interaction.deferUpdate();
          const fCom = new EmbedBuilder()
            .setTitle("Fun Commands:")
            .addFields(
              {
                name: "Commands",
                value: "8 Ball \nDice \nGif \nMeme \nQuote \nWeather",
                inline: true,
              },
              {
                name: "Usage",
                value: "`/8-ball` \n`/dice` \n`/meme` \n`/quote` \n`/weather`",
                inline: true,
              }
            )
            .setImage(config.assets.gekkoBanner)
            .setColor(colors.bot)
            .setTimestamp()
            .setFooter({
              text: "Gekkō",
              iconURL: interaction.client.user.displayAvatarURL(),
            });

          await interaction.editReply({
            embeds: [fCom],
            components: [actionRow, actionRow2],
          });
        }
      } catch (error) {
        const stackLines = error.stack.split("\n");
        const relevantLine = stackLines[1];
        const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
        const errorDescription = error.message;

        const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
          errorMessage,
          errorDescription,
        });
        await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
      }
    });
  },
};
