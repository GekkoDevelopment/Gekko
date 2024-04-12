const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MySQL = require('../../models/mysql')
const Utility = require('../../models/utility');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome').setDescription('Set welcome message, image, and channel for the guild.')
        .addChannelOption(option => option.setName('channel').setDescription('Welcome channel').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Welcome message').setRequired(true))
        .addStringOption(option => option.setName('image-url').setDescription('Image URL (optional)').setRequired(false)),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const welcomeMessage = interaction.options.getString('message');
        const imageUrl = interaction.options.getString('image');
        const welcomeChannelId = interaction.options.getChannel('channel').id;

        const columns = ['guild_id', 'welcome_channel_id', 'welcome_message', 'image_url'];

        const values = [
            `${guildId}`, // guild_id
            `${welcomeChannelId}`, // welcome_channel_id
            `${welcomeMessage}`, // welcome_message
            `${imageUrl}` // image_url
        ];

        MySQL.valueExistsInGuildsColumn(guildId, 'welcome_channel_id', welcomeChannelId).then(exists => {
            if (exists) {
                MySQL.updateColumnInfo(guildId, 'welcome_channel_id', welcomeChannelId);
                MySQL.updateColumnInfo(guildId, 'welcome_message', welcomeMessage);
                MySQL.updateColumnInfo(guildId, 'image_url', imageUrl);
            } else {
                MySQL.insertIntoGuildTable(columns, values);
            }
        });

        Utility.Delay(1000);

        const successEmbed = new EmbedBuilder()
        .setDescription('Welcome message, image, and channel has been set successfully!')
        .setColor('Green')
        interaction.reply({ embeds: [successEmbed] });
    }
};