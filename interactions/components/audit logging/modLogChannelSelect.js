import MySQL from "../../../models/mysql";

export default {
  data: { name: "modLogChannelSelect" },
  async execute(interaction) {
        const value = interaction.values[0];
        const logEnabled = 'true'
        await MySQL.bulkInsertOrUpdate('logging', ['guild_id', 'moderation_log', 'moderation_channel'], [[interaction.guild.id, logEnabled, value]]);

        const successEmbed = embeds.get('setLoggingSuccess')(interaction, {value});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
