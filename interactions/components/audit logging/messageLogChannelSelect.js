import MySQL from "../../../models/mysql.js";

export default {
  data: { name: "messageLogChannelSelect" },
  async execute(interaction) {
        const value = interaction.values[0];
        const logEnabled = 'true'
        await MySQL.bulkInsertOrUpdate('logging', ['guild_id', 'message_log', 'message_channel'], [[interaction.guild.id, logEnabled, value]]);

        const successEmbed = embeds.get('setLoggingSuccess')(interaction, {value});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
