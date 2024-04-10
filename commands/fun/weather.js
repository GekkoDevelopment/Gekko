const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');
const colors = require('../../models/colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather').setDescription('Check the weather in a certain location.')
        .addStringOption(option => option.setName('location').setDescription('The location to get weather for.').setRequired(true))
        .addStringOption(option => option.setName('degree-type').setDescription('Select what degree type you would like.').addChoices({ name: `Farenheight`, value: 'F' }, { name: `Celcius`, value: 'C' }).setRequired(true)),
    async execute(interaction) {
        
        const { options } = interaction;
        const location = options.getString('location');
        const degree = options.getString('degree-type');

        await interaction.reply({ content: `Fetching weather data...` });

        await weather.find({ search: `${location}`, degreeType: `${degree}` }, async function(err, result) {

            setTimeout(() => {
                if (err) {
                    const catchErrorEmbed = new EmbedBuilder()
                    .setTitle('Unexpected Error:')
                    .setDescription(`\`\`\`\n${err}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                    .setColor('Red')
                    interaction.editReply({ embeds: [catchErrorEmbed] });
                } else {
                    if (result.length == 0) {
                        const catchErrorEmbed = new EmbedBuilder()
                        .setTitle('Unexpected Error:')
                        .setDescription(`\`\`\`\nI couldn't find the weather of ${location}\`\`\`\n\n`)
                        .setColor('Red')
                        return interaction.editReply({ embeds: [catchErrorEmbed] });
                    } else {
                        const temp = result[0].current.temperature;
                        const type = result[0].current.skytext;
                        const name = result[0].location.name;
                        const feel = result[0].current.feelslike;
                        const icon = result[0].current.imageUrl;
                        const wind = result[0].current.winddisplay;
                        const day = result[0].current.day;
                        const alert = result[0].location.alert || 'None';

                        const embed = new EmbedBuilder()
                        .setColor(colors.bot)
                        .setTitle(`Current weather of ${name}`)
                        .addFields({ name: 'Temperature', value: `${temp} ${degree === 'C' ? '°C' : '°F'}`})
                        .addFields({ name: 'Feels Like', value: `${feel} ${degree === 'C' ? '°C' : '°F'}`})
                        .addFields({ name: 'Weather', value: `${type}`})
                        .addFields({ name: 'Current Alerts', value: `${alert}`})
                        .addFields({ name: 'Week Day', value: `${day}`})
                        .addFields({ name: 'Wind Speed & Direction', value: `${wind}`})
                        .setThumbnail(icon)

                        interaction.editReply({ content: ``, embeds: [embed] });

                    }
                }
            }, 2000)

        })

    }
}