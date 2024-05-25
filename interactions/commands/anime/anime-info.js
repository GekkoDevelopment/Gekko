import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import colors from '../../../models/colors.js';
import config from '../../../config.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import Http from '../../../models/HTTP.js';
import embeds from '../../../embeds/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName("anime-info")
    .setDescription("Look up information about a specific anime.")
    .addStringOption((option) =>
      option
        .setName("anime")
        .setDescription("The anime to get information from.")
        .setRequired(true)
    ),
  async execute(interaction) {
    DiscordExtensions.checkIfRestricted(interaction);
    await interaction.deferReply();

    try {
      const animeName = interaction.options.getString("anime");

      const headers = {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json'
      }

      const postHeaders = {
        'grant_type': 'password',
        'username': '<email|slug>',
        'password': '<password>'
      }

      const requestBody = {
        key: 'value'
      }

      const option = await Http.performHttpGetRequest(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`, headers);
      const data = await option.json();
      const stmData = await stmOption.json();

      console.log(stmData);

      if (data.data && data.data.length > 0) {
        const animeInfo = data.data[0];

        console.log(animeInfo.attributes.dubs)
        
        let synopsis = animeInfo.attributes.synopsis || "No synopsis available.";
        synopsis = synopsis.length > 300 ? synopsis.substring(0, 300) + "..." : synopsis;

        let ratingEmoji;

        if (animeInfo.attributes.averageRating >= 70) {
          ratingEmoji = config.emojis.ratingGreen;
        } else if (animeInfo.attributes.averageRating >= 40) {
          ratingEmoji = config.emojis.ratingAmber;
        } else {
          ratingEmoji = config.emojis.ratingRed;
        }

        let statusEmoji;
        switch (animeInfo.attributes.status) {
          case "current":
            statusEmoji = config.emojis.ratingGreen;
            break;
          case "finished":
            statusEmoji = config.emojis.ratingRed;
            break;
          case "tba":
            statusEmoji = config.emojis.ratingNa;
            break;
          case "unreleased":
            statusEmoji = config.emojis.ratingNa;
            break;
          case "upcoming":
            statusEmoji = config.emojis.ratingAmber;
            break;
          default:
            statusEmoji = "";
        }

        const nsfwCheck = animeInfo.attributes.nsfw;
        let isNsfw = nsfwCheck === true ? "✔️ Safe For Work" : "⚠️ Not Safe For Work";
        let isDubbed = animeInfo.attributes.dubs === 'JP' ? 'Yes' : 'No';

        console.log('Dubbed: ' + isDubbed);
        console.log('Safe For Work: ' + nsfwCheck);

        const embed = new EmbedBuilder()
          .setTitle(`${animeInfo.attributes.canonicalTitle}`)
          .setFooter({ text: animeInfo.attributes.titles.en || "Could not translate name.", iconURL: interaction.client.user.avatarURL(),})
          .setDescription(`> ${synopsis}[[View More]](https://kitsu.io/anime/${animeInfo.id})`)
          .addFields
          ({
              name: "Rating",
              value: `${ratingEmoji} ${animeInfo.attributes.averageRating}%` || "Not available",
              inline: true,
            },
            {
              name: "Status",
              value: `${statusEmoji} ${animeInfo.attributes.status}` || "Not available",
              inline: true,
            },
            {
              name: "Episode Length",
              value: `📺 ${String(animeInfo.attributes.episodeLength)} minutes` || "Not available",
              inline: true,
            },
            {
              name: "Is NSFW",
              value: `\`${isNsfw}\``,
              inline: true,
            },
            {
              name: "Age Rating",
              value: `\`${animeInfo.attributes.ageRating}\`` || "Not available",
              inline: true,
            },
            {
              name: "Start Date:",
              value: `\`${animeInfo.attributes.startDate}\``,
              inline: true,
            },
            {
              name: "End Date",
              value: `\`${animeInfo.attributes.endDate}\``,
              inline: true,
            },
            {
              name: 'Show Type',
              value: `\`${animeInfo.attributes.showType}\``
            }
              /*,
            {
              name: 'Seasons',
              value:  `\`${animeInfo.attributes.seasons}\``,
              inline: true
            },
            {
              name: 'Dubbed',
              value:  `\`${isDubbed}\``,
              inline: true
            }
            */
          )
          .setURL(`https://kitsu.io/anime/${animeInfo.id}`)
          .setColor(colors.bot);

        if (animeInfo.attributes.coverImage && animeInfo.attributes.coverImage.original) {
          embed.setImage(animeInfo.attributes.coverImage.original);
        }

        await interaction.editReply({ embeds: [embed] });
      } else {
        const errorEmbed = new EmbedBuilder()
          .setTitle(`${config.emojis.warning} Search Error:`)
          .setColor("Red")
          .setDescription("No anime found with that name.")
          .setTimestamp()
          .setFooter({ text: "Gekkō Development", iconURL: interaction.client.user.displayAvatarURL(),});

        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    } catch (error) {
      const stackLines = error.stack.split("\n");
      const relevantLine = stackLines[1];
      const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
      const errorDescription = error.message;

      const catchErrorEmbed = embeds.get("tryCatchError")(interaction, { errorMessage, errorDescription,});
      await interaction.editReply({ embeds: [catchErrorEmbed], ephemeral: true });
    }
  },
};
