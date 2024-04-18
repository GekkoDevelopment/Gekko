const { ButtonBuilder } = require('discord-gamecord/utils/utils');
const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonStyle, Embed } = require('discord.js');
const MySQL = require('../models/mysql');
const colors = require('../models/colors');
const { emojis } = require('../config');
const delay = require('node:timers/promises').setTimeout;

var tickets = [];

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(err);
    
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } 
        
        if (interaction.isStringSelectMenu() && interaction.customId === 'mod') {
            const logReplyMod = new EmbedBuilder()
            .setDescription(`Ok! Logging for Moderation has been enabled and the logging channel is set to ${setChannel}`)
            .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL() });
                        
            await MySQL.editColumnInGuilds(interaction.guild.id, 'logging_channel', interaction.channel.id);
            await MySQL.editColumnInGuilds(interaction.guild.id, 'log_type', interaction.customId);

            interaction.editReply({ embeds: [logReplyMod] });
        }

        if (interaction.isButton() && interaction.customId == 'ticketBtn') {
            const modal = new ModalBuilder()
            .setCustomId('ticketModal')
            .setTitle('Support Ticket');

            const topicInput = new TextInputBuilder()
            .setCustomId('topic')
            .setLabel('Topic')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('What is the topic of your issue?')
            .setRequired(true);

            const issueInput = new TextInputBuilder()
            .setCustomId('issue')
            .setLabel('issue')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Please provide us with some background information')
            .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(topicInput);
            const seconActionRow = new ActionRowBuilder().addComponents(issueInput);

            modal.addComponents(firstActionRow, seconActionRow)
            await interaction.showModal(modal)
        } else if (interaction.isModalSubmit()) {

            const topic = interaction.fields.getTextInputValue('topic');
            const issue = interaction.fields.getTextInputValue('issue');

            const embed = new EmbedBuilder()
            .setTitle('Ticket Opened')
            .setDescription('Ticket Created, please wait for a staff member to respond.')
            .setTimestamp()
            .setFooter({ text: `Ticket Created At:` })
            .addFields
            ({
                name: 'User',
                value: `\`\`\`${interaction.user.username}\`\`\``,
                inline: false
            },
            {
                name: 'Topic',
                value: `\`\`\`${topic}\`\`\``,
                inline: false
            },
            {
                name: 'Issue',
                value: `\`\`\`${issue}\`\`\``,
                inline: false
            });
            
            const closeBtn = new ButtonBuilder()
            .setEmoji('🔒')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('closeTicket');

            let channel = await interaction.guild.channels.create({
                name: `ticket-for-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: '1226502621431599114', // We can use MySql to store and retrieve data so that users can configure there own ticketing system.
                permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: '1226502588124496006', // Lead Devs 
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                id: '1226502589412016201', // Admins. Again, we can use a database to allow user configuation.
                allow: [PermissionsBitField.Flags.ViewChannel],
                }],
            });
                
            const guild = interaction.guild.id;
            const user = interaction.user.id;
            const row = new ActionRowBuilder().addComponents(closeBtn);

            const data = {
                'guild_id': guild,
                'ticket_id': channel.id,
                'user_id': user
            };
            
            await MySQL.insertRow('ticket_data', data);

            delay(1000);
            await channel.send({ content: '@<&1226502589412016201> @<&1226502588124496006>', embeds: [embed], components: [row] });

            const successEmbed = new EmbedBuilder()
            .setTitle('Ticket Created')
            .setDescription(`> I have created a ticket for you at ${channel}`)
            .setColor('Green')
            .setTimestamp()
            
            await interaction.reply({ embeds: [successEmbed], ephemeral: true })
        };

        if (interaction.isButton() && interaction.customId == 'closeTicket') {
            
            const modPanel = new EmbedBuilder()
                .setTitle('Ticket Panel')
                .setDescription('Use the buttons below to manage this ticket.')
                .setTimestamp()
                .setColor(colors.bot);
            
            const ticketClosed = new EmbedBuilder()
                .setTitle(`${emojis.warning} Ticket Closed`)
                .setDescription(`Ticket was closed by <@${interaction.user.id}>`)
                .setColor('Orange')
                .setTimestamp()
                .setFooter({ text: 'Ticket Closed At:' })

            const channel = interaction.channel;
            const userId = await MySQL.getValueFromTableWithCondition('ticket_data', 'user_id', 'ticket_id', `${channel.id}`);
            const user = interaction.guild.members.cache.get(userId.toString())

            const reopenBtn = new ButtonBuilder()
                .setCustomId('reopen')
                .setLabel('Reopen Ticket')
                .setStyle(ButtonStyle.Primary);

            const deleteBtn = new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('Delete Ticket')
                .setStyle(ButtonStyle.Danger);
            
            const row = new ActionRowBuilder().addComponents(reopenBtn, deleteBtn);
            
            await channel.permissionOverwrites.edit(user, {ViewChannel: false});
            await channel.send({ embeds: [ticketClosed] })
            await channel.send({ embeds: [modPanel], components: [row] })
            await interaction.deferUpdate()
            
        };

        if (interaction.isButton() && interaction.customId == 'reopen') {

            const userId = await MySQL.getValueFromTableWithCondition('ticket_data', 'user_id', 'ticket_id', `${interaction.channel.id}`);
            const user = interaction.guild.members.cache.get(userId.toString())
            const openEmbed = new EmbedBuilder()
                .setTitle('Ticket Reopened')
                .setDescription(`> <@${interaction.user.id}> has reopened this ticket.`)
                .setColor(colors.bot)
                .setTimestamp();
            
            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(user, {ViewChannel: true});
            await interaction.message.delete();
            await channel.send({ content: `<@${userId.toString()}>`, embeds: [openEmbed] });
        };

        if (interaction.isButton() && interaction.customId == 'delete') {
            
            const deletionEmbed = new EmbedBuilder()
                .setDescription(`${emojis.warning} *Deleting Ticket...*`)
                .setColor('Red');

            await interaction.channel.send({ embeds: [deletionEmbed] })
            await interaction.deferUpdate()
            MySQL.deleteRow('ticket_data', 'ticket_id', `${interaction.channel.id}`);

            setTimeout(() => {
                delete tickets[interaction.user.id];
                interaction.channel.delete();
            }, 5000);
        };
    },
};