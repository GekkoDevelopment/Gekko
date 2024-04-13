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
        } catch(error) {
            const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${error}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
            await interaction.reply({ embeds: [catchErrorEmbed] });
        }

        if (channel.nsfw && isNsfw === true && nsfwEnabled.toString() === 'true') {
            try {
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
            } catch(error) {
                const catchErrorEmbed = new EmbedBuilder()
                    .setTitle('Unexpected Error:')
                    .setDescription(`\`\`\`\n${error}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                    .setColor('Red')
                await interaction.reply({ embeds: [catchErrorEmbed] });
            }
        } else if (isNsfw === true && channel.nsfw && nsfwEnabled.toString() === 'false') {
            const errorEmbed = new EmbedBuilder()
            .setDescription('You must have NSFW in order to use this command! Contact the guilds Administator to enable this.')
            .setColor('Red');

            await interaction.reply({ content: 'NSFW needs to be enabled for this to work!', embeds: [errorEmbed], ephemeral: true });
        }
    }
};
