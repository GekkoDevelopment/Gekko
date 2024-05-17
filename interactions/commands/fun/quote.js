import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import quotes from "../../../models/quotes.js";
import MySQL from "../../../models/mysql.js";

function getRandomQuote(quotes) {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export default {
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Generate a random quote.")
    .addStringOption((option) =>
      option
        .setName("quote-category")
        .setDescription("Select a category!")
        .setRequired(true)
        .addChoices(
          { name: "Motivational", value: "motivational" },
          { name: "Mindfulness", value: "mindfulness" },
          { name: "Philosophy", value: "philosophy" },
          { name: "Romance", value: "romance" },
          { name: "Nature", value: "nature" },
          { name: "Humor", value: "humor" }
        )
    ),
  async execute(interaction) {
    const motivational = quotes.motivationalQuotes.quotes;
    const mindfulness = quotes.mindfulnessQuotes.quotes;
    const philosophy = quotes.philosophyQuotes.quotes;
    const romance = quotes.romanceQuotes.quotes;
    const nature = quotes.natureQuotes.quotes;
    const humor = quotes.humorQuotes.quotes;
    
    const category = interaction.options.getString("quote-category");

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
    let quote, author;

    switch (category) {
      case "motivational":
        ({ quote, author } = getRandomQuote(motivational));
        title = "ꨄ︎ Motivational Quotes! ꨄ︎";
        break;
      case "mindfulness":
        ({ quote, author } = getRandomQuote(mindfulness));
        title = "𓆩☻𓆪 Mindfulness Quotes! 𓆩☻𓆪";
        break;
      case "psychology":
        ({ quote, author } = getRandomQuote(philosophy));
        title = "❃ Philosophy Quotes! ❃";
        break;
      case "romance":
        ({ quote, author } = getRandomQuote(romance));
        title = "❤ Romance Quotes! ❤";
        break;
      case "nature":
        ({ quote, author } = getRandomQuote(nature));
        title = "⍋ Nature Quotes! ⍋";
        break;
      case "humor":
        ({ quote, author } = getRandomQuote(humor));
        title = "★ Funny Quotes! ★";
        break;
      default:
        return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${title}`)
      .setDescription(`\`\`\`\n“${quote}”\`\`\``)
      .setFooter({ text: `${author}` })
      .setColor(colors.bot);
    await interaction.reply({ embeds: [embed] });
  },
};
