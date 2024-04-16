const { ButtonBuilder } = require('discord-gamecord/utils/utils');
const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonStyle, Embed } = require('discord.js');
const MySQL = require('../models/mysql');
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
        
        if (interaction.isStringSelectMenu()) {
            // select interaciton
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
            .setFooter({ text: `ticket Created At:` })
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
            delete tickets[interaction.user.id];

            interaction.channel.delete();
            MySQL.deleteRow('ticket_data', 'ticket_id', `${interaction.channel.id}`);
        } 
    },
};