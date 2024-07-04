import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('zork').setDescription('Play a game of Zork'),
    async execute(interation) {

    }
}