const { Events, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas')
const MySQL = require('../models/mysql.js');


module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            GlobalFonts.registerFromPath('../fonts/Bangers-Regular.ttf', 'Bangers')
            
            const guildId = member.guild.id;

            const welcomeMessage = await MySQL.getColumnValuesWithGuildId(guildId, 'welcome_message');
            const imageUrl = await MySQL.getColumnValuesWithGuildId(guildId, 'image_url');
            const welcomeChannelId = await MySQL.getColumnValuesWithGuildId(guildId, 'welcome_channel_id');
            const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

            if (!welcomeChannel) {
                console.log("Welcome channel not found.", welcomeChannelId);
                return;
            }
            
            let canvas;
            
            if (imageUrl && imageUrl !== 'null') {
                canvas = createCanvas(1024, 450);
                let ctx = canvas.getContext('2d');

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                let img = await loadImage(imageUrl);
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
                ctx.strokeText(member.user.username.slice(0, 25), 400, 280);
                ctx.fillStyle = "#7B598D";
                ctx.fillText(member.user.username.slice(0, 25), 400, 280);

                // Member count
                ctx.fillStyle = "#ffffff";
                ctx.font = "30px Bangers";
                ctx.fillText(
                    `${member.guild.memberCount}th member`,
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
                img = await loadImage(member.displayAvatarURL({ format: "png" }));
                ctx.drawImage(img, 45, 90, 270, 270);
                ctx.restore();

            }

            welcomeChannel.send({ content: `**Welcome to the server, <@${member.user.id}>!** \n ${welcomeMessage}`, files: [new AttachmentBuilder(await canvas.encode("png"), { name: "welcome.png", }), ], });
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    }
};
