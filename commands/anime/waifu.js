const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const colors = require('../../models/colors');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu').setDescription('Random waifu generator!')
        .addBooleanOption(option => option.setName('nsfw').setDescription('Send an NSFW image (need to have NSFW features turned on in order to do this.)')),
    async execute(interaction) {
        const isNsfw = interaction.options.getBoolean('nsfw');
        const guildId = interaction.guild.id;
        const channel = interaction.channel;
        const nsfwEnabled = MySQL.getColumnValuesWithGuildId(guildId, 'nsfw_enabled');

        try {
            if (nsfwEnabled.toString() === 'false' || isNsfw === false) {
                const response = await fetch("https://api.waifu.pics/sfw/waifu");
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const data = await response.json();
                const embed = new EmbedBuilder()
                    .setTitle('Waifu!')
                    .setColor(colors.bot)
                    .setImage(`${data.url}`)

                await interaction.reply({ embeds: [embed] });
            }

            if (nsfwEnabled.toString() === 'true' && channel.nsfw && isNsfw === true) {
                const response = await fetch("https://api.waifu.pics/nsfw/waifu");
               
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }

                const data = await response.json();
                const embed = new EmbedBuilder()
                    .setTitle('Waifu!')
                    .setColor(colors.bot)
                    .setImage(`${data.url}`)

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply('You need to have NSFW commands enabled for this to work.');
            }
        } catch(error) {
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle('Unexpected Error:')
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red');

            await interaction.editReply({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    }
};
