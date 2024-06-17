import { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, SlashCommandMentionableOption } from "discord.js";
import Http from "../../../models/HTTP.js";
import DiscordExtensions from "../../../models/DiscordExtensions.js";
//import translate from '../../components/utils/translate.js';
import dotenv from 'dotenv';

dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName('test').setDescription('Test a feature (used by dev for HTTP requests or MySQL testing)')
        .addStringOption(option => option.setName('message').setDescription('message')),
    async execute(interaction) {
        await interaction.deferReply();
      
        try {
            const animeName = interaction.options.getString("message");

            const headers = {
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json'
            }
        
            const option = await Http.performGetRequest(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`, headers);
            const option2 = await Http.performGetRequest(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`, headers);
            
            const data = await option.json();
            const data2 = await option2.json();
        
            //const translated = await Translation.translate(msg);
            // console.log(translated);

            if (data.data && data.data.length > 0 || data2.data && data.data.length > 0) {
              const animeInfo = data.data[0];
              const animeInfo2 = data2.data[1];
        
              let synopsis = animeInfo.attributes.synopsis || "No synopsis available.";
              synopsis = synopsis.length > 300 ? synopsis.substring(0, 300) + '...' : synopsis;
        
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
                  statusEmoji = '';
                }
        
              let nsfwCheck = animeInfo.attributes.nsfw;
              let isNsfw = nsfwCheck === false ? '✔️ Safe For Work' : '⚠️ Not Safe For Work';
              
              //let isDubbed = stmInfo.attributes.dubs === 'undefined' ? 'Yes' : 'No';
        
              const embed = new EmbedBuilder()
                .setTitle(`${animeInfo.attributes.canonicalTitle}`)
                .setFooter({ text: animeInfo.attributes.titles.en || 'Could not translate name.', iconURL: interaction.client.user.avatarURL(),})
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
                  },/*
                  {
                    name: 'Dubbed',
                    value:  `\`${isDubbed}\``,
                    inline: true
                  }*/)
                .setURL(`https://kitsu.io/anime/${animeInfo.id}`)
                .setColor(colors.bot);
        
              if (animeInfo.attributes.coverImage && animeInfo.attributes.coverImage.original) {
                embed.setImage(animeInfo.attributes.coverImage.original);
              }
        
              await interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            DiscordExtensions.sendErrorEmbed(error, interaction);
        }
    }
}