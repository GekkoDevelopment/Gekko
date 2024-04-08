const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View Gekkō\'s command library.'),
    async execute(interaction) {
        const options = [
            {
                label: 'General Commands',
                emoji: '1️⃣',
                value: 'general_commands'
            },
            {
                label: 'Admin Commands',
                emoji: '2️⃣',
                value: 'admin_commands'
            },
            {
                label: 'Moderation Commands',
                emoji: '3️⃣',
                value: 'moderation_commands'
            },
            {
                label: 'Anime Commands',
                emoji: '4️⃣',
                value: 'anime_commands'
            },
            {
                label: 'Minigame Commands',
                emoji: '5️⃣',
                value: 'minigame_commands'
            },
            {
                label: 'Fun Commands',
                emoji: '6️⃣',
                value: 'fun_commands'
            }
        ];

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('command_select')
            .setPlaceholder('Select a category')
            .addOptions(options);

        const actionRow = new ActionRowBuilder().addComponents(selectMenu);

        const helpEmbed = new EmbedBuilder()
            .setTitle('Gekkō Command Library')
            .setDescription('Please select a category from the dropdown menu below:')
            .setColor('#7B598D')
            .setImage('https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&');

        await interaction.reply({ embeds: [helpEmbed], components: [actionRow] });

        const filter = i => i.customId === 'command_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: null,
            max: 1
        });

        collector.on('end', async collected => {
            const value = collected.first().values[0];
            switch (value) {
                case 'general_commands':
                    const gCom = new EmbedBuilder()
                    .setTitle('General Commands:')
                    .addFields(
                        { name: 'Commands', value: 'Help \nPing \nBug Report \nGekko', inline: true },
                        { name: 'Usage:', value: '`!help`, `/help` \n`!ping`, `/ping` \n`!bugreport`, `/bug-report` \n`!gekko`, `/gekko`', inline: true },
                    )
                    .setImage('https://cdn.discordapp.com/attachments/1226564051488870450/1226587759502954576/card.png?ex=66254fde&is=6612dade&hm=a750c8299cf43e15b773976647ae045fc1c9e1c5cab1ec2b9b927f1e869e738e&')
                    await interaction.editReply({ embed: [gCom], components: [actionRow] })
            }
        });

    }
};
