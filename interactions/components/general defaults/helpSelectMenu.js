module.exports = {
  data: { name: "helpSelectMenu" },
  async execute(interaction) {
    const value = interaction.values[0];
    
    if (value === "general_commands") {
        await interaction.deferUpdate();
        const gCom = embeds.get('generalCommandsDocs')(interaction);
        await interaction.message.edit({ embeds: [gCom] });
    }
    if (value === "admin_commands") {
        await interaction.deferUpdate();
        const aCom = embeds.get('adminCommandsDocs')(interaction);
        await interaction.editReply({ embeds: [aCom] });
    }
    if (value === "moderation_commands") {
        await interaction.deferUpdate();
        const mCom = embeds.get('modCommandsDocs')(interaction);
        await interaction.editReply({ embeds: [mCom] });
    }
    if (value === "anime_commands") {
        await interaction.deferUpdate();
        const animCom = embeds.get('animeCommandsDocs')(interaction);
        await interaction.editReply({ embeds: [animCom] });
    }
    if (value === "minigame_commands") {
        await interaction.deferUpdate();
        const miniCom = embeds.get('gameCommandsDocs')(interaction);
        await interaction.editReply({ embeds: [miniCom] });
    }
    if (value === "fun_commands") {
        await interaction.deferUpdate();
        const fCom = embeds.get('funCommandsDocs')(interaction);
        await interaction.editReply({ embeds: [fCom] });
    }
  },
};
