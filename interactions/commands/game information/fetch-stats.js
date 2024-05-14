const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../../models/mysql');
const blizzard = require('blizzard.js');
const { gameApis } = require('../../../config');
const { HTTP } = require('../../../models/HTTP');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch-stats').setDescription("Give you your or another user's steam info. (name, hex, etc.)")
        .addStringOption(option => option.setName('game').setDescription('The user you want to look up').addChoices(
            { name: "gameCSGO", value: "CS-GO" },
            { name: "gameApexLegends", value: "Apex Legends" },
            { name: "gameOverwatch", value: "Overwatch" },
            { name: "gameWorldOfWarcraft", value: "World Of Warcraft" },
            { name: "gameDiabloIII", value: "Diablo 3" },
            { name: "gameHeathstone", value: "Heathstone" },
            { name: "gameStarCraftII", value: "StarCraft 2" }
        ).setRequired(true)),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition("guilds", "restricted_guild", "guild_id", interaction.guild.id);
        const game = interaction.options.getString('game');

        const wow = await blizzard.wow.createInstance({ key: gameApis.battleNetClientId, secret: gameApis.battleNetClientSecret });
        const diablo = await blizzard.d3.createInstance({ key: gameApis.battleNetClientId, secret: gameApis.battleNetClientSecret });
        const overwatch = await blizzard.ow.createInstance({ key: gameApis.battleNetClientId, secret: gameApis.battleNetClientSecret });
        const starcraft = await blizzard.sc2.createInstance({ key: gameApis.battleNetClientId, secret: gameApis.battleNetClientSecret });

        if (restricted === "true") {
            const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true,});
        }

        await interaction.deferReply();

        try {
            
        } catch (error) {
            const stackLines = error.stack.split("\n");
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, "");
            const errorDescription = error.message;

            const catchErrorEmbed = embeds.get("tryCatchError")(interaction, {
                errorMessage,
                errorDescription,
            });

            await interaction.editReply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
}