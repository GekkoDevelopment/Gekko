const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const MySQL = require('../../../models/mysql');
const colors = require('../../../models/colors');

function generateBugID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-';
    const numbers = '0123456789';

    let bugID = '';

    for (let i = 0; i < 5; i++) {
        bugID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    for (let i = 0; i < 3; i++) {
        bugID += characters.charAt(Math.floor(Math.random() * characters.length)).toLowerCase();
    }
    for (let i = 0; i < 3; i++) {
        bugID += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return bugID;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bug-report').setDescription('Submit a bug-report to the Gekko'),
    async execute(interaction) {
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
        
        try {
            const bugID = generateBugID();
            const bugModal = new ModalBuilder().setCustomId('bug_report_modal').setTitle('Bug Description');
            const bugModalDescInput = new TextInputBuilder()
            .setCustomId('bug_desc_input')
			.setLabel('Bug Description')
			.setStyle(TextInputStyle.Paragraph)
			.setMinLength(3)
			.setMaxLength(3000)
			.setRequired(true);

            const bugModalVidInput = new TextInputBuilder()
            .setCustomId('bug_vid_input')
            .setLabel('Video (if available)')
            .setStyle(TextInputStyle.Short)
            .setMinLength(7)
            .setMaxLength(100)
            .setRequired(false);

            const bugModalDesc = new ActionRowBuilder().addComponents(bugModalDescInput);
            const bugModalVid = new ActionRowBuilder().addComponents(bugModalVidInput);

            bugModal.addComponents(bugModalDesc);
            bugModal.addComponents(bugModalVid);

            await interaction.showModal(bugModal);
            
            const filter = (int) => int.customId === 'bug_report_modal';
            interaction.awaitModalSubmit({ filter, time: 30_000 }).then((int) => {
                const replyEmbed = new EmbedBuilder()
                    .setTitle(`${config.emojis.passed} Bug Report Submitted`)
                    .setDescription('> Your bug report was submitted to our development team for review. \n> ***You submitted the following information:***')
                    .addFields
                    ({
                        name: 'Bug ID',
                        value: `\`${bugID}\``,
                        inline: false
                    },
                    {
                        name: 'Reportee',
                        value: `${int.user.displayName} (ID: ${int.user.id})`,
                        inline: false
                    },
                    {
                        name: 'Bug Description',
                        value: `${int.fields.getTextInputValue('bug_desc_input')}`,
                        inline: false
                    },
                    {
                        name: 'Video',
                        value: `${int.fields.getTextInputValue('bug_vid_input')}` || 'None Provided.',
                        inline: false
                    })
                    .setColor(colors.bot)
                    .setFooter({ text: 'Gekkō', iconURL: int.client.user.displayAvatarURL() })
                    .setTimestamp();

                int.reply({ embeds: [replyEmbed], ephemeral: true });

                let guild = int.client.guilds.cache.get(config.developer.devGuild);
                let channel = guild.channels.cache.get(config.developer.devBugReportsChannel);

                let bugReportEmbed = new EmbedBuilder()
                .setTitle('Bug Report')
                .setColor('Red')
                .setThumbnail(config.assets.gekkoLogo)
                .setTimestamp()
                .setFooter({ text: 'Gekkō', iconURL: int.client.user.displayAvatarURL() })
                .addFields
                ({
                    name: 'Bug ID',
                    value: `\`${bugID}\``,
                    inline: false
                },
                {
					name: 'Reportee',
					value: `${int.user.displayName} (ID: ${int.user.id})`,
                    inline: false
				},
				{
					name: 'Bug Description',
					value: `${int.fields.getTextInputValue('bug_desc_input')}`,
					inline: false
				},
				{
					name: 'Video',
					value: `${int.fields.getTextInputValue('bug_vid_input')}` || 'None Provided.',
					inline: false
				});

                channel.send({ embeds: [bugReportEmbed] });
            })
        } catch (error) {
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle(`${config.emojis.warning} Unexpected Error:`)
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            await interaction.channel.send({ embeds: [catchErrorEmbed], ephemeral: true });
        }
    } 
}