const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, Embed, ButtonStyle, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const color = require('../../models/colors.js');
const { ButtonBuilder } = require("discord-gamecord/utils/utils");
const colors = require("../../models/colors.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-config')
        .setDescription('Set up our ticketing feature'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Permissions Error: 50013')
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nYou lack permissions to perform that action```',
                        inline: true
                    }
                )
                .setColor(color.bot);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        guildId = interaction.guild.id 
        console.log(guildId)
        // add db logic to save guildId.

        // Component Configuration:
        const options = [
            {
                label: 'Edit Ticket Channel',
                value: 'ticket_channel'
            },
            {
                label: 'Edit Support Role',
                value: 'support_role'
            },
            {
                label: 'Edit Category Open',
                value: 'category_open'
            },
            {
                label: 'Edit Category Close',
                value: 'category_close'
            }
        ];

        const ticketConfig = new StringSelectMenuBuilder()
            .setCustomId('config_select')
            .setPlaceholder('Config Select...')
            .addOptions(options);
        const launchButton = new ButtonBuilder()
            .setCustomId('launchTickets')
            .setLabel('Launch Tickets')
            .setStyle(ButtonStyle.Success);
        const actionRow = new ActionRowBuilder()
            .addComponents(ticketConfig);
        const actionRow2 = new ActionRowBuilder()
            .addComponents(launchButton);

        // Embed Configuration... 
        const myConfigEmbed = new EmbedBuilder()
            .setTitle('Your Configuration')
            .setDescription(`Adjust your configuration via the select menu. \nTo launch your configuration, simply use the button below.`)
            .setColor(color.bot)
            .setAuthor({ name: `${interaction.client.user.username} Tickets`, iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [myConfigEmbed], components: [actionRow, actionRow2] });

        // Select options...
        const filter = i => i.customId === 'config_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: null,
            max: 1
        });

        collector.on('end', async collected => {
            const value = collected.first().values[0];
            try {
                switch (value) {
                    case 'ticket_channel':
                        const guild = interaction.guild;
                        if (!guild) return;
                        const guildCategories = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory);
                        const categories = guildCategories.map(category => category.name);
                        const categoryOptions = categories.map(category => ({
                            label: category,
                            value: category
                        }));
                        const categorySelect = new StringSelectMenuBuilder()
                            .setCustomId('categorySelect')
                            .setPlaceholder('Select a Category...')
                            .addOptions(categoryOptions);
                        const actionRow = new ActionRowBuilder()
                            .addComponents(categorySelect);
                        
                        const embed = new EmbedBuilder()
                            .setTitle('Select Your Ticketing Category')
                            .setDescription('Choose the category and channel where you\'d like to send the ticket message.')
                            .setColor(colors.bot)
                            .setAuthor({ name: `${interaction.client.user.username} Tickets`, iconURL: interaction.client.user.displayAvatarURL() });
                            // Find a way to fix interaction failed message.
                            await interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });
                        break;

                    case 'support_role':
                        const roleModal = new ModalBuilder()
                            .setCustomId('roleModal')
                            .setTitle('Create a Support Role');
                        const roleInput = new TextInputBuilder()
                            .setCustomId('roleInput')
                            .setLabel('Name your support role for us to create')
                            .setStyle(TextInputStyle.Short);
                        const roleActionRow = new ActionRowBuilder()
                            .addComponents(roleInput);
                        
                            roleModal.addComponents(roleActionRow);

                            await interaction.showModal(roleModal);
                        break;
                    case 'category_open':
                        break;
                    case 'category_close':
                        break;
                    default:
                        break;
                }
            } catch (err) {
                console.log(err)
            }
        });


        // channel select logic.
    }
};