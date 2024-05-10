const {  } = require("discord.js");
const MySQL = require("../../../models/mysql");
const { emojis, assets } = require("../../../config");


module.exports = {
  data: { name: "welcomeMsgModal" },
  async execute(interaction) {
        const welcomeMsg = interaction.fields.getTextInputValue('welcomeMsgInput');
        await MySQL.updateValueInTableWithCondition('guilds', 'welcome_message', welcomeMsg, 'guild_id', interaction.guild.id);

        const successEmbed = embeds.get('welcomeMsgSuccess')(interaction, {welcomeMsg});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
