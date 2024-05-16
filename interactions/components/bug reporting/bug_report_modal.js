import { ButtonStyle, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import config from '../../../config.js';
  
function generateBugID() {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-";
    const numbers = "0123456789";

    let bugID = "";

    for (let i = 0; i < 5; i++) {
        bugID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    for (let i = 0; i < 3; i++) {
        bugID += characters
        .charAt(Math.floor(Math.random() * characters.length))
        .toLowerCase();
    }
    for (let i = 0; i < 3; i++) {
        bugID += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return bugID;
}

export default {
    data: { name: "bug_report_modal" },
    async execute(interaction) {

        const bugID = generateBugID();
        const guildId = interaction.guild.id;
        const userDisplayName = interaction.user.displayName;
        const userId = interaction.user.id;  
        const bugDescription = interaction.fields.getTextInputValue("bug_desc_input");
        const bugVideo = interaction.fields.getTextInputValue("bug_vid_input");

        const replyEmbed = embeds.get('bugUserReply')(interaction, {bugID, guildId, userDisplayName, userId, bugDescription, bugVideo});
        interaction.reply({ embeds: [replyEmbed], ephemeral: true });

        let guild = interaction.client.guilds.cache.get(config.developer.devGuild);
        let channel = guild.channels.cache.get(
        config.developer.devBugReportsChannel
        );

        const githubBtn = new ButtonBuilder()
        .setCustomId('githubIssueBtn')
        .setLabel('Send to Github')
        .setStyle(ButtonStyle.Success);

        const rejectBtn = new ButtonBuilder()
        .setCustomId('bugRejectBtn')
        .setLabel('Reject')
        .setStyle(ButtonStyle.Danger);

        const githubActionRow = new ActionRowBuilder().addComponents(githubBtn, rejectBtn);

        let bugReportEmbed = embeds.get('bugDevEmbed')(interaction, {bugID, guildId, userDisplayName, userId, bugDescription, bugVideo});
        channel.send({ embeds: [bugReportEmbed], components: [githubActionRow] });
    },
  };