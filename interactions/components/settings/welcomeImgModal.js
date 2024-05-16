import MySQL from '../../../models/mysql';

export default {
  data: { name: "welcomeImgModal" },
  async execute(interaction) {
        const welcomeImg = interaction.fields.getTextInputValue('welcomeImgInput');
        await MySQL.updateValueInTableWithCondition('guilds', 'image_url', welcomeImg, 'guild_id', interaction.guild.id);

        const successEmbed = embeds.get('welcomeImageSuccess')(interaction, {welcomeImg});
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
}
