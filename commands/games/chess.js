const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess')
        .setDescription('Start a game of chess!')
        .addUserOption(option => option.setName('user').setDescription('The user you want to play with.').setRequired(true)),
    async execute(interaction) {
        const playerA = interaction.user;
        const playerB = interaction.options.getUser('user');

        const Lichess = await fetch('https://lichess.org/api/challenge');

        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50105')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYour guild has been banned by the Gekkō Development Team. If you feel like this is an error please contact the development team by joining our [Support Discord.](https://discord.gg/2aw45ajSw2)```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
    }
};

// lip_DMx26QizmDMq5YcCPPVD = API KEY ??? || API Key is in config.js