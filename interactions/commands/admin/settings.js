import { SlashCommandBuilder, PermissionFlagsBits, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import MySQL from '../../../models/mysql.js';
import config from '../../../config.js';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('settings').setDescription('Configure the bot for your guild'),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition("guilds", "restricted_guild", "guild_id", interaction.guild.id);
      
        if (restricted === "true") {
            const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        let welcomeConfigTitle, welcomeConfigValue;
        let loggingConfigTitle, loggingConfigValue;
        let joinConfigTitle, joinConfigValue;
        let nsfwConfigTitle, nsfwConfigValue;
        let ticketConfigTitle, ticketConfigValue;
        let lockdownConfigTitle, lockdownConfigValue;

        const welcomeSettings = await MySQL.getColumnValuesWithGuildId(interaction.guild.id, 'welcome_channel_id');
        const loggingSettings = await MySQL.getValueFromTableWithCondition('logging', 'guild_id', 'guild_id', interaction.guild.id);
        const joinSettings = await MySQL.getColumnValuesWithGuildId(interaction.guild.id, 'join_role');
        const nsfwSettings = await MySQL.getColumnValuesWithGuildId(interaction.guild.id, 'nsfw_enabled');
        const ticketSettings = await MySQL.getValueFromTableWithCondition('tickets', 'ticket_channel_id', 'guild_id', interaction.guild.id);
        const lockdownSettings = await MySQL.getValueFromTableWithCondition('lockdown_config', 'channel_id', 'guild_id', interaction.guild.id);

        if (!welcomeSettings) {
            welcomeConfigTitle = `${config.emojis.discordOff} Welcome Members`;
            welcomeConfigValue = '**Disabled** - To enable, use the select menu below';
        } else {
            welcomeConfigTitle = `${config.emojis.discordOn} Welcome Members`;
            welcomeConfigValue = '**Enabled** - To disable, use the select menu below';
        }

        if (!loggingSettings) {
            loggingConfigTitle = `${config.emojis.discordOff} Audit Logging`;
            loggingConfigValue = '**Disabled** - To enable, use the select menu below';
        } else {
            loggingConfigTitle = `${config.emojis.discordOn} Audit Logging`;
            loggingConfigValue = '**Enabled** - To disable, use the select menu below';
        }

        if (!joinSettings) {
            joinConfigTitle = `${config.emojis.discordOff} Join Roles`;
            joinConfigValue = '**Disabled** - To enable, use the select menu below';
        } else {
            joinConfigTitle = `${config.emojis.discordOn} Join Roles`;
            joinConfigValue = '**Enabled** - To disable, use the select menu below';
        }

        if (nsfwSettings === 'false') {
            nsfwConfigTitle = `${config.emojis.discordOff} NSFW Features`;
            nsfwConfigValue = '**Disabled** - To enable, use the select menu below';
        } else {
            nsfwConfigTitle = `${config.emojis.discordOn} NSFW Features`;
            nsfwConfigValue = '**Enabled** - To disable, use the select menu below';
        }

        if (!ticketSettings) {
            ticketConfigTitle = `${config.emojis.discordOff} Ticketing Feature`;
            ticketConfigValue = '**Disabled** - To enable, use the select menu below';
        } else {
            ticketConfigTitle = `${config.emojis.discordOn} Ticketing Feature`;
            ticketConfigValue = '**Enabled** - To disable, use the select menu below';
        }

        if (!lockdownSettings) {
            lockdownConfigTitle = `${config.emojis.discordOff} Lockdown Feature`;
            lockdownConfigValue = '**Disabled** - To enable, use the select menu below';
        } else {
            lockdownConfigTitle = `${config.emojis.discordOn} Lockdown Feature`;
            lockdownConfigValue = '**Enabled** - To disable, use the select menu below';
        }

        const settingsOptions = [
            {
                label: 'Welcome/Greetings',
                emoji: config.emojis.gekko,
                description: 'Welcome new users to your guild',
                value: 'welcome'
            },
            {
                label: 'Join Roles',
                emoji: config.emojis.gekko,
                description: 'Assign roles to new members',
                value: 'memberJoin'  
            },
            {
                label: 'Tickets',
                emoji: config.emojis.gekko,
                description: 'Setup tickets for you guild',
                value: 'tickets'  
            },
            {
                label: 'Audit Logging',
                emoji: config.emojis.gekko,
                description: 'Setup audit logging for you guild',
                value: 'logging'  
            },
            {
                label: 'Lockdown',
                emoji: config.emojis.gekko,
                description: 'Setup lockdown channels',
                value: 'lockdown'  
            },
            {
                label: 'NSFW Features',
                emoji: config.emojis.gekko,
                description: 'Setup NSFW features',
                value: 'nsfw'  
            }];
        
        const settingsSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('settingsSelectMenu')
        .setPlaceholder('✧˚ · . Choose a setting to configure')
        .setOptions(settingsOptions);
        
        const actionRow1 = new ActionRowBuilder().addComponents(settingsSelectMenu);

        const settingsEmbed = embeds.get('userGuildSettings')(interaction, {welcomeConfigTitle, welcomeConfigValue, joinConfigTitle, joinConfigValue, nsfwConfigTitle, nsfwConfigValue, ticketConfigTitle, ticketConfigValue, lockdownConfigTitle, lockdownConfigValue, loggingConfigTitle, loggingConfigValue});
        const msg = await interaction.reply({ embeds: [settingsEmbed], components: [actionRow1] });
        setTimeout(() => {
            msg.edit({ content: `**${config.emojis.warning} You took too long to interact**`, components: [] });
        }, 120000)

    }
}