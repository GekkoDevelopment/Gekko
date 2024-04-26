const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const MySQL = require('../../models/mysql');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('neko').setDescription('Random neko generator!')
        .addBooleanOption(option => option.setName('nsfw').setDescription('Send an NSFW image (need to have NSFW features turned on in order to do this.)')),
    async execute(interaction) {
        const isNsfw = interaction.options.getBoolean('nsfw');
        const guildId = interaction.guild.id;
        
        const dbPromise = MySQL.getValueFromTableWithCondition('guilds', 'nsfw_enabled', 'guild_id', guildId);
        const nsfwEnabled = await dbPromise;

        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            await interaction.deferReply();
            
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
            return await interaction.editReply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        try {
            await interaction.deferReply();

            if (!interaction.channel.nsfw && isNsfw) {
                return await interaction.editReply({ content: 'NSFW can only be used in NSFW channels.', ephemeral: true });
            }

            if ((nsfwEnabled === 'false' && isNsfw) || (nsfwEnabled === 'false' && interaction.channel.nsfw && isNsfw)) {
                return await interaction.editReply({ content: 'You must have NSFW enabled to use this feature (Contact your server administrator to change this.)', ephemeral: true });
            }

            const response = await fetch(isNsfw ? 'https://api.waifu.pics/nsfw/neko' : 'https://api.waifu.pics/sfw/neko');

            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }

            const data = await response.json();

            const embed = new EmbedBuilder()
            .setTitle('Waifu!')
            .setColor(colors.bot)
            .setImage(`${data.url}`);

            await interaction.editReply({ embeds: [embed] });
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
}