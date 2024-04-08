const { SlashCommandBuilder } = require('discord.js');
const superagent = require('superagent');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Get a random GIF.')
        .addStringOption(option => option.setName('term').setDescription('The search term you want your meme to have.').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const { options } = interaction;
        const query = options.getString('term');
        const apiKey = config.apiKeys.tenorApi;
        const clientKey = "Gekko";
        const lmt = 8;

        let choice = Math.floor(Math.random() * lmt);

        const link = `https://tenor.googleapis.com/v2/search?q=${query}&key=${apiKey}&client_key=${clientKey}&limit=${lmt}`;

        try {
            const response = await superagent.get(link);
            if (response && response.body && response.body.results && response.body.results.length > 0) {
                await interaction.editReply({ content: response.body.results[choice].itemurl });
            } else {
                throw new Error("No results found");
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `Error: I couldn't find a matching gif to \`${query}\`!` });
        }
    }
};
