const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const MySQL = require('../../models/mysql');
const { emojis } = require('../../config');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const delay = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome').setDescription('Set welcome message, image, and channel for the guild.')
        .addChannelOption(option => option.setName('channel').setDescription('Welcome channel').setRequired(true))
        .addStringOption(option => option.setName('image-url').setDescription('Image URL (optional)').setRequired(false)),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = new EmbedBuilder()
            .setTitle(`${emojis.warning} Permissions Error: 50013`)
            .addFields(
                {
                    name: 'Error Message:',
                    value: '```\nYou need the MANAGE_GUILD permission to use this command.```',
                    inline: true
                }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: 'Gekkō Development', iconURL: interaction.client.user.displayAvatarURL() });
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const imageUrl = interaction.options.getString('image-url');
        const welcomeChannelId = interaction.options.getChannel('channel').id;

        const columns = ['guild_id', 'welcome_channel_id', 'image_url'];

        const values = [
            `${guildId}`, // guild_id
            `${welcomeChannelId}`, // welcome_channel_id
            `${imageUrl}`, // image_url
        ];

        MySQL.valueExistsInGuildsColumn(guildId, 'welcome_channel_id', welcomeChannelId).then(exists => {
            if (exists) {
                MySQL.editColumnInGuilds(guildId, 'welcome_channel_id', welcomeChannelId);
                MySQL.editColumnInGuilds(guildId, 'welcome_message', welcomeMessage);
                MySQL.editColumnInGuilds(guildId, 'image_url', imageUrl);
                MySQL.editColumnInGuilds(guildId, 'embed_clr', hexCode);
            } else {
                MySQL.insertIntoGuildTable(columns, values);
            }
        });

        delay(1000);

        try {
            GlobalFonts.registerFromPath('../fonts/Bangers-Regular.ttf', 'Bangers')
            
            const guildId = interaction.guild.id;

            const savedimageUrl = await MySQL.getColumnValuesWithGuildId(guildId, 'image_url');
            
            let canvas;
            
            if (savedimageUrl && savedimageUrl !== 'null') {
                canvas = createCanvas(1024, 450);
                let ctx = canvas.getContext('2d');

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                let img = await loadImage(savedimageUrl);
                ctx.drawImage(
                    img, 
                    canvas.width / 2 - img.width / 2,
                    canvas.height / 2 - img.height / 2
                );
                
                //layer
                ctx.fillStyle = '#000000';
                ctx.globalAlpha = 0.5;
                ctx.fillRect(0, 0, 25, canvas.height);
                ctx.fillRect(canvas.width - 25, 0, 25, canvas.height);
                ctx.fillRect(25, 0, canvas.width - 50, 25);
                ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25);
                ctx.globalAlpha = 1;

                // Title
                const welc = `Welcome`;
                ctx.font = "90px Bangers";
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 12;
                ctx.strokeText(welc, 400, 200);
                ctx.fillStyle = '#ffffff';
                ctx.fillText(welc, 400, 200);

                // Username
                ctx.font = "65px Bangers";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 10;
                ctx.strokeText(interaction.user.username.slice(0, 25), 400, 280);
                ctx.fillStyle = "#7B598D";
                ctx.fillText(interaction.user.username.slice(0, 25), 400, 280);

                // Member count
                ctx.fillStyle = "#ffffff";
                ctx.font = "30px Bangers";
                ctx.fillText(
                    `${interaction.guild.memberCount}th member`,
                    40,
                    canvas.height - 35
                );

                // User Avatar
                ctx.beginPath();
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#7B598D";
                ctx.arc(180, 225, 135, 0, Math.PI * 2, true);
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                img = await loadImage(interaction.user.displayAvatarURL({ format: "png" }));
                ctx.drawImage(img, 45, 90, 270, 270);
                ctx.restore();

                await interaction.reply({ content: `${emojis.passed} Welcome image set, this is how it will appear:\n\n**Welcome to the server, <@${interaction.user.id}>!**`, files: [new AttachmentBuilder(await canvas.encode("png"), { name: "welcome.png", }), ], });
                console.log('wecome image sent')
            }


        } catch (error) {
            console.log('Error sending welcome message:', error);
        }
    }
};