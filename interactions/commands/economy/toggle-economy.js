const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../../models/mysql');
const colors = require('../../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle-economy').setDescription('Toggle if you want the bot to have economy features.')
        .addBooleanOption(option => option.setName('toggle').setDescription('Toggle the economy features.').setRequired(true)), 
    async execute(interaction) {
        const toggleEconomy = interaction.options.getBoolean('toggle');

        let economyEnabled = MySQL.hasTrueFalseValue('economy', 'economy_enabled');
        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
            const permissionErrorEmbed = embeds.get('guildRestricted')(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
        
        if (!interaction.user.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const errorEmbed = new EmbedBuilder()
            .setDescription("You don't have permission to use this command!")
            .setColor('Red');

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (toggleEconomy === true) {
            MySQL.updateColumnValue('economy', interaction.guild.id, 'economy_enabled', 'true');

            const embed = new EmbedBuilder()
            .setDescription('Economy enabled!')
            .setColor('Green');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            MySQL.updateColumnValue('economy', interaction.guild.id, 'economy_enabled', 'false');
            
            const embed = new EmbedBuilder()
            .setDescription('Economy disabled!')
            .setColor('Green');
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (economyEnabled.toString() === 'true' && toggleEconomy === true) {
            const errorEmbed = new EmbedBuilder()
            .setDescription('You already have economy enabled!')
            .setColor('Red');

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}