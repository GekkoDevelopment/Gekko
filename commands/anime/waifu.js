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
        
        const dbPromise = MySQL.getValueFromTableWithCondition('guilds', 'nsfw_enabled', 'guild_id', guildId);
        const nsfwEnabled = await dbPromise;

        try {
            await interaction.deferReply();
            
            if (!interaction.channel.nsfw && isNsfw) {
                return await interaction.editReply({ content: 'NSFW can only be used in NSFW channels.', ephemeral: true });
            }

            if ((nsfwEnabled === 'false' && isNsfw) || (nsfwEnabled === 'false' && interaction.channel.nsfw && isNsfw)) {
                return await interaction.editReply({ content: 'You must have NSFW enabled to use this feature (Contact your server administrator to change this.)', ephemeral: true });
            }

            const response = await fetch(isNsfw ? 'https://api.waifu.pics/nsfw/waifu' : 'https://api.waifu.pics/sfw/waifu');

            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }

            const data = await response.json();

            const embed = new EmbedBuilder()
            .setTitle('Waifu!')
            .setColor(colors.bot)
            .setImage(`${data.url}`);

            await interaction.reply({ embeds: [embed] });
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
