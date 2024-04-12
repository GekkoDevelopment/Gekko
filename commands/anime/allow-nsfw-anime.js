const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelFlags, ChannelType, MediaChannel, TextChannel, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const config = require('../../config.js');
const colors = require('../../models/colors');
const MySQL = require('../../models/mysql.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('allow-nsfw-anime').setDescription('This feature is off by default. If you want NSFW anime stuff on turn it on using this command.'),
    async execute(interaction) {
        const confirmButton1 = new ButtonBuilder().setLabel('Yes').setCustomId('confirm_nsfw_1').setStyle(ButtonStyle.Success);
        const denyButton1 = new ButtonBuilder().setLabel('No').setCustomId('deny_nsfw_1').setStyle(ButtonStyle.Danger);

        const guildId = interaction.guild.id;

        const confirmButton2 = new ButtonBuilder().setLabel('Yes').setCustomId('confirm_nsfw_2').setStyle(ButtonStyle.Success);
        const denyButton2 = new ButtonBuilder().setLabel('No').setCustomId('deny_nsfw_2').setStyle(ButtonStyle.Danger);
        
        const embedConfirmEmbed1 = new EmbedBuilder()
        .setTitle('Enable Not Safe For Work Feature')
        .setColor(colors.deepPink)
        .setDescription("This command turns on NSFW anime features (such as the waifu command will show NSFW images)." + 
        "This command/feature is turned off by default... **Are you sure you want to enable this feature?**");

        const embedConfirmEmbed2 = new EmbedBuilder()
        .setTitle('Enable Not Safe For Work Feature')
        .setColor(colors.deepPink)
        .setDescription("**Are you sure you're sure?**");

        const actionRow1 = new ActionRowBuilder().addComponents(confirmButton1, denyButton1);
        const actionRow2 = new ActionRowBuilder().addComponents(confirmButton2, denyButton2);

        const channel = interaction.channel;

        if (!channel.nsfw  && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action, and you are not in a NSFW channel.```',
                    inline: true
                }
            )
            .setColor('Red');

            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (channel.nsfw && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('Permissions Error: 50013')
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou lack permissions to perform that action, and you are not in a NSFW channel.```',
                    inline: true
                }
            )
            .setColor('Red');
            
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        if (channel.nsfw && interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
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
                                .setDescription('Okay! NSFW Commands are enabled but they can only be used in this channel.')
                                .setColor(colors.deepPink);
                    
                            MySQL.updateColumnInfo(guildId, 'nsfw_enabled', 'true');
                            await confirm2.update({ embeds: [success], components: [] });
                    
                        } else if (confirm2.customId === 'deny_nsfw_2') {
                            await confirm2.update({ content: 'Alright we cancelled it.', components: [] });
                            MySQL.updateColumnInfo(guildId, 'nsfw_enabled', 'false');
                        }
                    
                    } catch(err) {
                        console.log(err);
                    }

                } else if (confirm1.customId === 'deny_nsfw_1') {
                    MySQL.updateColumnInfo(guildId, 'nsfw_enabled', 'false');
                    confirm1.update({ content: 'Alright we cancelled it.', components: [] });
                }
                
            } catch (err) {
                console.log(err);
            }
        }
    }
}