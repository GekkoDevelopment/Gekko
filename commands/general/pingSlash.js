const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('View Gekkō\'s current latency.'),
    async execute(interaction) {
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

        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
        const pingEmbed = new EmbedBuilder()
        .setTitle('🏓 Gekkō\'s Latency Data')
        .setDescription(`> ***Latency:*** \n> \`${timeDiff}ms\` \n\n> ***API Latency:*** \n> \`${Math.round(interaction.client.ws.ping)}ms\``)
        .setColor(colors.bot)
        .setFooter({ text: 'Gekko', iconURL: interaction.client.user.avatarURL()  });
        interaction.editReply({ content: " ", embeds: [pingEmbed] });
    }
};