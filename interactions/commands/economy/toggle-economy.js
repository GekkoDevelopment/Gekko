import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import DiscordExtensions from '../../../models/DiscordExtensions.js';
import embeds from '../../../embeds/index.js';

export default {
    data: new SlashCommandBuilder()
        .setName('toggle-economy').setDescription('Toggle if you want the bot to have economy features.')
        .addBooleanOption(option => option.setName('toggle').setDescription('Toggle the economy features.').setRequired(true)), 
    async execute(interaction) {
        const toggleEconomy = interaction.options.getBoolean('toggle');

        let economyEnabled = MySQL.hasTrueFalseValue('guilds', 'economy_enabled');
        DiscordExtensions.checkIfRestricted(interaction);
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const errorEmbed = new EmbedBuilder()
            .setDescription("You don't have permission to use this command!")
            .setColor('Red');

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (toggleEconomy === true) {
            await MySQL.editColumnInGuilds(interaction.guild.id, 'economy_enabled', 'true')

            const embed = new EmbedBuilder()
            .setDescription('Economy enabled!')
            .setColor('Green');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            await MySQL.editColumnInGuilds(interaction.guild.id, 'economy_enabled', 'false')
            // clear all economy data??
            
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