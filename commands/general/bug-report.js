const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bug-report').setDescription('Submit a bug-report to the Gekko'),
    async execute(interaction) {
        try {
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
            int.awaitModalSubmit({ filter, time: 30_000 }).then((int) => {
                int.reply({ content: 'Bug Report submitted! Our development team will take a look.', ephemeral: true });

                let guild = i.client.guilds.cache.get(config.developer.devGuild);
                let channel = guild.channels.cache.get(config.developer.devBugReportsChannel);

                let bugReportEmbed = new EmbedBuilder()
                .setTitle('Bug Report')
                .setColor('Red')
                .setThumbnail(config.assets.gekkoLogo)
                .addFields
				({
					name: 'Reportee',
					value: `${int.user.displayName} (ID: ${int.user.id})`
				},
				{
					name: 'Bug Description',
					value: `${int.fields.getTextInputValue('bug_desc_input')}`,
					inline: true
				},
				{
					name: 'Video',
					value: `${int.fields.getTextInputValue('bug_vid_input')}` || 'None Provided.',
					inline:true
				});

                channel.send({ embeds: [bugReportEmbed] });
            })
        } catch (err) {
            // do nothing
        }
    } 
}