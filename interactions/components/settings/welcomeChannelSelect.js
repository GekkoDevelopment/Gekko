const MySQL = require("../../../models/mysql");

module.exports = {
  data: { name: "welcomeChannelSelect" },
  async execute(interaction) {
        const value = interaction.values[0];
        const channelId = interaction.guild.channels.cache.get(value).id; 
        await MySQL.updateValueInTableWithCondition('guilds', 'welcome_channel_id', channelId, 'guild_id', interaction.guild.id);

        const successEmbed = embeds.get('welcomeChannelSuccess')(interaction, {channelId});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
