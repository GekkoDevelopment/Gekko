const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const colors = require('../../models/colors');
const Utility = require('../../models/utility');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Bulk delete messages')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount to delete').setMinValue(1).setMaxValue(100).setRequired(true)),
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Permissions Error: 50013')
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nYou lack permissions to perform that action```',
                        inline: true
                    }
                )
                .setColor('Red');
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
            }

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Permissions Error: 50013')
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nI lack permissions to perform that action \nPlease check my permissions, or reinvite me to use my default permissions.```',
                        inline: true
                    }
                )
                .setColor('Red');
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
            }

            const amount = interaction.options.getInteger('amount');

            if (amount > 100) {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Command Error:')
                .addFields(
                    {
                        name: 'Error Message',
                        value: '```\nYou cannot delete more than 100 messages```',
                        inline: true
                    }
                )
                .setColor('Red');
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
            }

            if (isNaN(amount)) {
                const permissionErrorEmbed = new EmbedBuilder()
                .setTitle('Command Error')
                .addFields(
                    {
                        name: 'Error Message:',
                        value: '```\nPlease Supply A Valid Amount To Delete Messages!```',
                        inline: true
                    }
                )
                .setColor('Red');
                return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
            }

            interaction.channel.bulkDelete(amount, { filterOld: true }).then(async (messages) => {
                const successEmbed = new EmbedBuilder()
                .setTitle('Purge Complete!')
                .setDescription(`**Succesfully deleted \`${messages.size}/${amount}\` messages**`)
                .setAuthor({ name: 'Gekko', iconURL: interaction.client.user.avatarURL() })
                .setColor("Green");
                await interaction.reply({ embeds: [successEmbed] });

                setTimeout(() => {
                    interaction.deleteReply();    
                }, 2500);

            }).catch(() => null);

        } catch (error) {
            const stackLines = error.stack.split('\n');
            const relevantLine = stackLines[1];
            const errorMessage = relevantLine.replace(/^\s+at\s+/g, '')
            const errorDescription = error.message;

            const catchErrorEmbed = new EmbedBuilder()
            .setTitle('Unexpected Error:')
            .setDescription(`\`\`\`\n${errorMessage} \n\n${errorDescription}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
            .setColor('Red')
            await interaction.reply({ embeds: [catchErrorEmbed], ephemeral: true });
        };
    }
};