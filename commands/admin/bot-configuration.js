const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js');
const config = require('../../config');
const MySQL = require('../../models/mysql');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-config').setDescription('Configure the bot for your guild'),
    
    async execute(interaction) {
        const configEmbed = new EmbedBuilder()
            .setTitle('Gekkō Configuration')
            .addFields(
                {
                    name: `${config.emojis.exclamationMark} Getting Started:`,
                    value: 'Use the drop-down menu below to start configuring our bot.'
                },
                {
                    name: `${config.emojis.questionMark} Further Support`,
                    value: 'For more help on setting up the bot, feel free to read our Documentation, or join our support server for help.'
                }
            )
            .setColor(colors.bot)
            .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
        
        const options = [
            {
                label: 'Moderation',
                emoji: config.emojis.configuration,
                value: 'moderation'
            },
            {
                label: 'Ticketing',
                emoji: config.emojis.configuration,
                value: 'ticketing'
            },
            {
                label: 'Welcome Messages',
                emoji: config.emojis.configuration,
                value: 'welcome'
            },
            {
                label: 'Audit Logging',
                emoji: config.emojis.configuration,
                value: 'auditLogging'
            },
            {
                label: 'Fun & Misc',
                emoji: config.emojis.configuration,
                value: 'misc'
            }
        ];
        
        const documentationBtn = new ButtonBuilder()
            .setLabel('Documentation')
            .setURL('https://gekko-2.gitbook.io/gekko')
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.emojis.gekko);

        const discordBtn = new ButtonBuilder()
            .setLabel('Support Server')
            .setURL('https://discord.gg/2aw45ajSw2')
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.emojis.discord);

        const configSelect = new StringSelectMenuBuilder()
            .setCustomId('config_select')
            .setPlaceholder('Edit your configuration...')
            .addOptions(options)
        
        const actionRow = new ActionRowBuilder().addComponents(configSelect);
        const actionRow2 = new ActionRowBuilder().addComponents(discordBtn, documentationBtn);
        await interaction.reply({ embeds: [configEmbed], components: [actionRow, actionRow2] });

        const filter = i => i.customId === 'config_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: null,
            max: 1
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                console.log('No interaction collected.');
                return;
            }
        
            const value = collected.first().values[0];
            try {
                switch (value) {
                    case 'moderation':
                        const modOptions = [
                            {
                                label: 'Set Muted Role',
                                emoji: config.emojis.configuration,
                                value: 'mutedRole'
                            },
                            {
                                label: 'Lockdown channels',
                                emoji: config.emojis.configuration,
                                value: 'lockdown'
                            }
                        ];

                        const modSelect = new StringSelectMenuBuilder()
                            .setCustomId('modSelect')
                            .setPlaceholder('Moderation Options...')
                            .addOptions(modOptions)
                        
                        const modActionRow = new ActionRowBuilder().addComponents(modSelect)

                        const modBackBtn = new ButtonBuilder()
                            .setCustomId('modBackBtn')
                            .setLabel('Back')
                            .setEmoji(config.emojis.arrowLeft)
                            .setStyle(ButtonStyle.Secondary)
                        
                        const modActionRow2 = new ActionRowBuilder().addComponents(modBackBtn)

                        const mutedRoleId = await MySQL.getValueFromTableWithCondition('muted_users', 'muted_role_id', 'guild_id', interaction.guild.id);
                        console.log(mutedRoleId)
                        const modConfig = new EmbedBuilder()
                            .setTitle('Moderation Configuration')
                            .addFields(
                                {
                                    name: 'Muted Role',
                                    value: mutedRoleId ? `${mutedRoleId}` : '`None Set`'
                                },
                            )
                            .setColor(colors.bot)
                            .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });

                            await interaction.editReply({ embeds: [modConfig], components: [modActionRow, modActionRow2] });
                    break;
                    
                    case 'ticketing':
                        break;
    
                    case 'welcome':
                        break;
    
                    case 'auditLogging':
                        break;
    
                    case 'misc':
                        break;

                    default:
                        break;
                }
            } catch (error) {
                const stackLines = error.stack.split('\n');
                const relevantLine = stackLines[1];
                const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
                const errorDescription = error.message;

                const catchErrorEmbed = new EmbedBuilder()
                .setTitle('Unexpected Error:')
                .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                .setColor('Red')
                await interaction.channel.send({ embeds: [catchErrorEmbed] });
            }
        });

    }
}