const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const logos = require("../../../models/logos");
const colors = require("../../../models/colors");
const MySQL = require('../../../models/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess-the-logo')
        .setDescription('Play a round of Guess the logo!'),
    async execute(interaction) {
        const companyNames = Object.keys(logos);
        const randomCompanyName = companyNames[Math.floor(Math.random() * companyNames.length)];
        const randomLogoUrl = logos[randomCompanyName];

        const logoEmbed = new EmbedBuilder()
            .setTitle('Guess the Logo!')
            .setImage(randomLogoUrl)
            .setAuthor({ name: 'Gekko', iconURL: interaction.client.user.avatarURL()  })
            .setColor(colors.bot);

        await interaction.reply({ embeds: [logoEmbed] });
        
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

        let guessCorrect = false;
        while (!guessCorrect) {
            const filter = response => {
                return true;
            };

            try {
                const collected = await interaction.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });

                const userGuess = collected.first().content.toLowerCase();

                if (userGuess === randomCompanyName.toLowerCase()) {
                    const successEmbed = new EmbedBuilder()
                        .setTitle('<:yay:1226982859483517049> Congratulations!')
                        .setDescription(`**${collected.first().author.tag}** guessed the logo correctly! \nThe logo was: \`${randomCompanyName}\``)
                        .setAuthor({ name: 'Gekko', iconURL: interaction.client.user.avatarURL() })
                        .setColor("Green");
                    await collected.first().reply({ embeds: [successEmbed] });
                    guessCorrect = true;
                } else {
                    const failEmbed = new EmbedBuilder()
                        .setTitle('Ooops, that\'s not quite right!')
                        .setDescription(`**${collected.first().author.tag}** guessed \`${userGuess}\`! \nThis was the wrong answer! Try again.`)
                        .setAuthor({ name: 'Gekko', iconURL: interaction.client.user.avatarURL() })
                        .setColor("Red");
                    await collected.first().reply({ embeds: [failEmbed] });
                }
            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Ooops, times up!')
                    .setDescription(`You didn\'t guess the logo in time, the logo was **${randomCompanyName}** \nUse the \`/guess-the-logo\` command to try again!`)
                    .setAuthor({ name: 'Gekko', iconURL: interaction.client.user.avatarURL() })
                    .setColor("Red");
                await interaction.followUp({ embeds: [errorEmbed] });
                break;
            }
        }
    }
}
