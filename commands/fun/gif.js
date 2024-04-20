const { SlashCommandBuilder } = require('discord.js');
const superagent = require('superagent');
const colors = require('../../models/colors');
const config = require('../../config');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Get a random GIF.')
        .addStringOption(option => option.setName('term').setDescription('The search term you want your meme to have.').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const { options } = interaction;

        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50105')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYour guild has been banned by Gekkō Development. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
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
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle('Unexpected Error:')
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
};
