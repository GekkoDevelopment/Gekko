const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const colors = require('../../models/colors.js');
const MySQL = require('../../models/mysql.js');
const { emojis } = require('../../config.js');
const MySQL = require('../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('allow-nsfw').setDescription('The NSFW is off by default. If you want NSFW commands on turn it on using this command.').setNSFW(true),
    async execute(interaction) {
        const confirmButton1 = new ButtonBuilder().setLabel('Yes').setCustomId('confirm_nsfw_1').setStyle(ButtonStyle.Success);
        const denyButton1 = new ButtonBuilder().setLabel('No').setCustomId('deny_nsfw_1').setStyle(ButtonStyle.Danger);

        const guildId = interaction.guild.id;

        const confirmButton2 = new ButtonBuilder().setLabel('Yes').setCustomId('confirm_nsfw_2').setStyle(ButtonStyle.Success);
        const denyButton2 = new ButtonBuilder().setLabel('No').setCustomId('deny_nsfw_2').setStyle(ButtonStyle.Danger);

        const restricted = MySQL.getValueFromTableWithCondition('guilds', 'restricted_guild', 'guild_id', interaction.guild.id);

        if (restricted === 'true') {
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
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const embedConfirmEmbed1 = new EmbedBuilder()
        .setTitle(`${emojis.warning} Enable Not Safe For Work Feature`)
        .setColor(colors.deepPink)
        .setDescription("This command turns on NSFW anime features (such as the waifu command will show NSFW images)." + 
        "This command/feature is turned off by default... **Are you sure you want to enable this feature?**");

        const embedConfirmEmbed2 = new EmbedBuilder()
        .setTitle(`${emojis.warning} Enable Not Safe For Work Feature`)
        .setColor(colors.deepPink)
        .setDescription("**Are you sure you're sure?**");

        const actionRow1 = new ActionRowBuilder().addComponents(confirmButton1, denyButton1);
        const actionRow2 = new ActionRowBuilder().addComponents(confirmButton2, denyButton2);

        const channel = interaction.channel;

        if (!channel.nsfw && !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle(`${emojis.warning} Permissions Error: 50013`)
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action, and you are not in a NSFW channel.```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });

            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (!channel.nsfw && interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setDescription('You are not in a NSFW channel to do this!')
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });

            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (channel.nsfw && !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle(`${emojis.warning} Permissions Error: 50013`)
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action, and you are not in a NSFW channel.```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (channel.nsfw && interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const response = await interaction.reply({ embeds: [embedConfirmEmbed1], components: [actionRow1] });
            const collectFilter = i => i.user.id === interaction.user.id;
            
            try {
                const confirm1 = await response.awaitMessageComponent({ filter: collectFilter });

                if (confirm1.customId === 'confirm_nsfw_1') {
                    const response2 = await confirm1.update({ embeds: [embedConfirmEmbed2], components: [actionRow2] });
                    const collectFilter2 = i => i.user.id === interaction.user.id;

                    const confirm2 = await response2.awaitMessageComponent({ filter: collectFilter2 });

                    try {
                        if (confirm2.customId === 'confirm_nsfw_2') {
                            const success = new EmbedBuilder()
                                .setTitle(`${emojis.passed} NSFW Enabled`)
                                .setDescription('Okay! **NSFW** Commands are enabled but they can only be used in this channel.')
                                .setFooter({ text: 'Gekkō', iconURL: interaction.client.user.displayAvatarURL() })
                                .setTimestamp()
                                .setColor(colors.deepPink);
                    
                            MySQL.editColumnInGuilds(guildId, 'nsfw_enabled', 'true');
                            await confirm2.update({ embeds: [success], components: [], ephemeral: true });
                    
                        } else if (confirm2.customId === 'deny_nsfw_2') {
                            await confirm2.update({ content: 'Alright we cancelled it.', components: [] });
                            MySQL.editColumnInGuilds(guildId, 'nsfw_enabled', 'false');
                        }
                    
                    } catch(error) {
                        const stackLines = error.stack.split('\n');
                        const relevantLine = stackLines[1];
                        const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
                        const errorDescription = error.message;
        
                        const catchErrorEmbed = new EmbedBuilder()
                        .setTitle(`${emojis.warning} Unexpected Error:`)
                        .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                        .setColor('Red')
                        .setTimestamp()
                        .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                        await interaction.editReply({ embeds: [catchErrorEmbed], ephemeral: true });
                    }

                } else if (confirm1.customId === 'deny_nsfw_1') {
                    MySQL.updateColumnInfo(guildId, 'nsfw_enabled', 'false');
                    confirm1.update({ content: 'Alright we cancelled it.', components: [] });
                }
                
            } catch (error) {
                const stackLines = error.stack.split('\n');
                const relevantLine = stackLines[1];
                const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
                const errorDescription = error.message;

                const catchErrorEmbed = new EmbedBuilder()
                .setTitle(`${emojis.warning} Unexpected Error:`)
                .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
                await interaction.editReply({ embeds: [catchErrorEmbed], ephemeral: true });
            }
        }
    }
}