const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const colors = require('../../../models/colors');
const MySQL = require('../../../models/mysql');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice').setDescription('Roll the dice.'),
    async execute(interaction) {

        const dice = Math.floor(Math.random() * 6) + 1;

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

        let diceEmoji;
        switch (dice) {
            case 1:
                diceEmoji = config.emojis.d1;
                break;
            case 2:
                diceEmoji = config.emojis.d2;
                break;
            case 3:
                diceEmoji = config.emojis.d3;
                break;
            case 4:
                diceEmoji = config.emojis.d4;
                break;
            case 5:
                diceEmoji = config.emojis.d5;
                break;
            case 6:
                diceEmoji = config.emojis.d6;
                break;
            default:
                diceEmoji = ':question:';
        }

        const diceEmbed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.tag}` })
        .setColor(colors.bot)
        .setTimestamp()
        .setDescription(`**You rolled a ${dice}** ${diceEmoji}`)
        .setFooter({ text: `${interaction.client.user.username}`, iconUR: `${interaction.client.displayAvatarURL}` });
        
        await interaction.reply({ embeds: [diceEmbed] });
    }
}