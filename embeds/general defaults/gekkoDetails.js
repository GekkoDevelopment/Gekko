import { EmbedBuilder } from 'discord.js';
import colors from '../../models/colors';

export default {
  embed: (interaction, data, message) =>
    new EmbedBuilder()
    .setAuthor({
        name: `${interaction.client.user.username} Development`,
        iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setColor(color.bot)
    .setTitle("Welcome to Gekkō!")
    .setDescription(
        "```\nIntroducing Gekkō, your new Discord companion! 🌟 Packed with utility commands for easy server management, fun minigames for entertainment, and a touch of anime magic, Gekkō brings joy and efficiency to your Discord server. ✨ Gekkō really does elevate your Discord experience! 🎉```"
    )
    .setImage(
        "https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&"
    )
    .addFields(
        {
        name: "Getting Started:",
        value:
            "• You can get started by running the `/help` command, to view all of our available commands. Alternatively, you can visit our documentation below!",
        inline: false,
        },
        {
        name: "Version",
        value: "`v1.0.0.a1`",
        inline: true,
        },
        {
        name: "Change Log",
        value: "[Gekkō Dev Log](https://gekko-2.gitbook.io/gekk-dev-log/)",
        inline: true,
        }
    ),
};