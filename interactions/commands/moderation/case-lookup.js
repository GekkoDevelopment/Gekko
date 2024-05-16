import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import { DiscordExtensions } from '../../../models/DiscordExtensions';
import MySQL from '../../../models/mysql';

export default {
    data: new SlashCommandBuilder()
        .setName('case-lookup').setDescription("Look up a user's punishment history.")
        .addUserOption(option => option.setName('user').setDescription('The user to look up').setRequired(true)),
    async execute(interaction) {
        DiscordExtensions.checkIfRestricted(interaction);

        const user = interaction.options.getUser('user');
        await interaction.deferReply();

        const caseNumber = MySQL.getValueFromTableWithCondition('punishment', 'caseNumber', 'guild_id', interaction.guild.id);
        
        if (!user.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const permissionErrorEmbed = embeds.get('permissionsError')(interaction);
            return await interaction.editReply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }
    }
}