const {  } = require("discord.js");

module.exports = {
  data: { name: "bugRejectBtn" },
  async execute(interaction) {
    const embed = interaction.message.embeds[0]; 
    const fieldValueMap = {};
    
    embed.fields.forEach(field => {
        fieldValueMap[field.name] = field.value;
    });

    const bugId = fieldValueMap['Bug ID'];
    const rejectedEmbed = embeds.get('issueRejectedEmbed')(interaction, {bugId});
    await interaction.message.edit({ embeds: [rejectedEmbed], components: [] });

  },
};