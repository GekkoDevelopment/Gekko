const { PermissionFlagsBits, AttachmentBuilder, ChannelSelectMenuBuilder, StringSelectMenuBuilder, ActionRowBuilder, RoleSelectMenuBuilder } = require("discord.js");
const MySQL = require("../../../models/mysql");
const { emojis, assets } = require("../../../config");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");

GlobalFonts.registerFromPath("fonts/Bangers-Regular.ttf", "Bangers");

module.exports = {
  data: { name: "settingsSelectMenu" },
  async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionErrorEmbed = embeds.get("permissionsError")(interaction);
            return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
        }

        let canvas;

        const value = interaction.values[0];
        if (value === 'welcome') {
            await interaction.deferUpdate();

            let guildWelcomeChannel;
            let guildWelcomeMessage;
            let guildWelcomeImage;

            const welcomeChannel = await MySQL.getValueFromTableWithCondition('guilds', 'welcome_channel_id', 'guild_id', interaction.guild.id);
            const welcomeMessage = await MySQL.getValueFromTableWithCondition('guilds', 'welcome_message', 'guild_id', interaction.guild.id);
            const welcomeImage = await MySQL.getValueFromTableWithCondition('guilds', 'image_url', 'guild_id', interaction.guild.id);

            if (!welcomeChannel) {
                guildWelcomeChannel = `${emojis.red} None Set`;
            } else {
                guildWelcomeChannel = `${interaction.guild.channels.cache.get(welcomeChannel)}`;
            }

            if (welcomeMessage === null) {
                guildWelcomeMessage = `${emojis.amber} [Default]: \nWelcome ${interaction.user} to **${interaction.guild.name}**`;
            } else {
                guildWelcomeMessage = welcomeMessage;
            }

            if (!welcomeImage) {
                canvas = createCanvas(1024, 450);
                let ctx = canvas.getContext("2d");
        
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                let img = await loadImage(assets.gekkoBanner2);
                ctx.drawImage(
                img,
                canvas.width / 2 - img.width / 2,
                canvas.height / 2 - img.height / 2
                );
        
                //layer
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 0.5;
                ctx.fillRect(0, 0, 25, canvas.height);
                ctx.fillRect(canvas.width - 25, 0, 25, canvas.height);
                ctx.fillRect(25, 0, canvas.width - 50, 25);
                ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25);
                ctx.globalAlpha = 1;
        
                // Title
                const welc = `Welcome`;
                ctx.font = "90px Bangers";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 12;
                ctx.strokeText(welc, 400, 200);
                ctx.fillStyle = "#ffffff";
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
                
                guildWelcomeImage = `${emojis.amber} [Default]: \n[Default Gekkō Banner](${assets.gekkoBanner2})`;

            } else {
                canvas = createCanvas(1024, 450);
                let ctx = canvas.getContext("2d");
        
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                let img = await loadImage(welcomeImage);
                ctx.drawImage(
                img,
                canvas.width / 2 - img.width / 2,
                canvas.height / 2 - img.height / 2
                );
        
                //layer
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 0.5;
                ctx.fillRect(0, 0, 25, canvas.height);
                ctx.fillRect(canvas.width - 25, 0, 25, canvas.height);
                ctx.fillRect(25, 0, canvas.width - 50, 25);
                ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25);
                ctx.globalAlpha = 1;
        
                // Title
                const welc = `Welcome`;
                ctx.font = "90px Bangers";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 12;
                ctx.strokeText(welc, 400, 200);
                ctx.fillStyle = "#ffffff";
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

                guildWelcomeImage = welcomeImage;
            }
        
            const welcomeConfigOptions = [
            {
                label: 'Welcome Message',
                emoji: emojis.gekko,
                description: 'Set a custom Welcome Message',
                value: 'welcomeMsg'
            },
            {
                label: 'Welcome Image',
                emoji: emojis.gekko,
                description: 'Set a custom Welcome Image',
                value: 'welcomeImg'
            },
            {
                label: 'Welcome Channel',
                emoji: emojis.gekko,
                description: 'Set a Welcome Channel',
                value: 'welcomeChannel'
            },
            {
                label: 'Disable Feature',
                emoji: emojis.warning,
                description: 'Disable this feature entirely',
                value: 'disable'
            }];
            const settingsOptions = [
                {
                    label: 'Welcome/Greetings',
                    emoji: emojis.gekko,
                    description: 'Welcome new users to your guild',
                    value: 'welcome'
                },
                {
                    label: 'Join Roles',
                    emoji: emojis.gekko,
                    description: 'Assign roles to new members',
                    value: 'memberJoin'  
                },
                {
                    label: 'Tickets',
                    emoji: emojis.gekko,
                    description: 'Setup tickets for you guild',
                    value: 'tickets'  
                },
                {
                    label: 'Audit Logging',
                    emoji: emojis.gekko,
                    description: 'Setup audit logging for you guild',
                    value: 'logging'  
                },
                {
                    label: 'Lockdown',
                    emoji: emojis.gekko,
                    description: 'Setup lockdown channels',
                    value: 'lockdown'  
                },
                {
                    label: 'NSFW Features',
                    emoji: emojis.gekko,
                    description: 'Setup NSFW features',
                    value: 'nsfw'  
                }];
            
            const settingsSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('settingsSelectMenu')
            .setPlaceholder('✧˚ · . Choose a setting to configure')
            .setOptions(settingsOptions);
            
            const actionRow1 = new ActionRowBuilder().addComponents(settingsSelectMenu);


            const welcomeConfigSelect = new StringSelectMenuBuilder()
            .setCustomId('welcomeConfigSelect')
            .setOptions(welcomeConfigOptions)
            .setPlaceholder('✧˚ · . Edit Welcome Configuration');

            const actionRow2 = new ActionRowBuilder().addComponents(welcomeConfigSelect);

            const welcomeEmbed = embeds.get('welcomeSettings')(interaction, {guildWelcomeChannel, guildWelcomeMessage, guildWelcomeImage});
            await interaction.message.edit({ embeds: [welcomeEmbed], files: [new AttachmentBuilder(await canvas.encode("png"), {name: "welcome.png",})], components: [actionRow1, actionRow2] });
        }

        if (value === 'memberJoin') {
            await interaction.deferUpdate();
            let guildJoinRoles;
            
            const joinRoles = await MySQL.getValueFromTableWithCondition('guilds', 'join_role', 'guild_id', interaction.guild.id);

            if (!joinRoles) {
                guildJoinRoles = `${emojis.red} None Set`
            } else {
                const roleIdsArray = joinRoles.split(",");
                const formattedRoles = roleIdsArray.map((roleId) => `<@&${roleId}>`).join("\n");
                guildJoinRoles = `${formattedRoles}`
            }

            const settingsOptions = [
                {
                    label: 'Welcome/Greetings',
                    emoji: emojis.gekko,
                    description: 'Welcome new users to your guild',
                    value: 'welcome'
                },
                {
                    label: 'Join Roles',
                    emoji: emojis.gekko,
                    description: 'Assign roles to new members',
                    value: 'memberJoin'  
                },
                {
                    label: 'Tickets',
                    emoji: emojis.gekko,
                    description: 'Setup tickets for you guild',
                    value: 'tickets'  
                },
                {
                    label: 'Audit Logging',
                    emoji: emojis.gekko,
                    description: 'Setup audit logging for you guild',
                    value: 'logging'  
                },
                {
                    label: 'Lockdown',
                    emoji: emojis.gekko,
                    description: 'Setup lockdown channels',
                    value: 'lockdown'  
                },
                {
                    label: 'NSFW Features',
                    emoji: emojis.gekko,
                    description: 'Setup NSFW features',
                    value: 'nsfw'  
                },
                {
                    label: 'Disable Feature',
                    emoji: emojis.warning,
                    description: 'Disable this feature entirely',
                    value: 'disable'
                }];
            
            const settingsSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('settingsSelectMenu')
            .setPlaceholder('✧˚ · . Choose a setting to configure')
            .setOptions(settingsOptions);
            
            const actionRow1 = new ActionRowBuilder().addComponents(settingsSelectMenu);

            const joinConfigOptions = [
                {
                    label: 'Join Roles',
                    emoji: emojis.gekko,
                    description: 'Set/Edit your join roles',
                    value: 'joinRoles'
                },
                {
                    label: 'Disable Feature',
                    emoji: emojis.warning,
                    description: 'Disable this feature entirely',
                    value: 'disable'
                }];
            
            const joinConfigSelect = new StringSelectMenuBuilder()
            .setCustomId('joinConfigSelect')
            .setOptions(joinConfigOptions)
            .setPlaceholder('✧˚ · . Edit your join role settings');

            const actionRow2 = new ActionRowBuilder().addComponents(joinConfigSelect);

            const joinRolesEmbed = embeds.get('memberJoinSettings')(interaction, {guildJoinRoles});
            await interaction.message.edit({ embeds: [joinRolesEmbed], components: [actionRow1, actionRow2] });
        }

        if (value === 'tickets') {
            await interaction.deferUpdate();
            let guildTicketChannel;
            let guildTicketCategory;
            let guildSupportRoles;

            const ticketChannel = await MySQL.getValueFromTableWithCondition('tickets', 'ticket_channel_id', 'guild_id', interaction.guild.id);
            const ticketCategory = await MySQL.getValueFromTableWithCondition('tickets', 'ticket_category', 'guild_id', interaction.guild.id);
            const supportRole = await MySQL.getValueFromTableWithCondition('tickets', 'support_role_id', 'guild_id', interaction.guild.id);

            if (!ticketChannel) {
                guildTicketChannel = `${emojis.red} Not Set`;
            } else {
                guildTicketChannel = interaction.guild.channels.cache.get(ticketChannel);
            }

            if (!ticketCategory) {
                guildTicketCategory = `${emojis.red} Not Set`;
            } else {
                guildTicketCategory = interaction.guild.channels.cache.get(ticketCategory);
            }

            if (!supportRole) {
                guildSupportRoles = `${emojis.red} Not Set`;
            } else {
                const roleIdsArray = supportRole.split(",");
                const formattedRoles = roleIdsArray.map((roleId) => `<@&${roleId}>`).join("\n");
                guildSupportRoles = `${formattedRoles}`
            }

            const settingsOptions = [
                {
                    label: 'Welcome/Greetings',
                    emoji: emojis.gekko,
                    description: 'Welcome new users to your guild',
                    value: 'welcome'
                },
                {
                    label: 'Join Roles',
                    emoji: emojis.gekko,
                    description: 'Assign roles to new members',
                    value: 'memberJoin'  
                },
                {
                    label: 'Tickets',
                    emoji: emojis.gekko,
                    description: 'Setup tickets for you guild',
                    value: 'tickets'  
                },
                {
                    label: 'Audit Logging',
                    emoji: emojis.gekko,
                    description: 'Setup audit logging for you guild',
                    value: 'logging'  
                },
                {
                    label: 'Lockdown',
                    emoji: emojis.gekko,
                    description: 'Setup lockdown channels',
                    value: 'lockdown'  
                },
                {
                    label: 'NSFW Features',
                    emoji: emojis.gekko,
                    description: 'Setup NSFW features',
                    value: 'nsfw'  
                }];
            
            const settingsSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('settingsSelectMenu')
            .setPlaceholder('✧˚ · . Choose a setting to configure')
            .setOptions(settingsOptions);
            
            const actionRow1 = new ActionRowBuilder().addComponents(settingsSelectMenu);

            const ticketConfigOptions = [
                {
                    label: 'Ticket Channel',
                    emoji: emojis.gekko,
                    description: 'Set/Edit your ticket channel',
                    value: 'ticketChannel'
                },
                {
                    label: 'Ticket Category',
                    emoji: emojis.gekko,
                    description: 'Set/Edit your ticket category',
                    value: 'ticketCat'
                },
                {
                    label: 'Support Roles',
                    emoji: emojis.gekko,
                    description: 'Set/Edit your support roles',
                    value: 'supportRoles'
                },
                {
                    label: 'Disable Feature',
                    emoji: emojis.warning,
                    description: 'Disable this feature entirely',
                    value: 'disable'
                }];
            
            const ticketConfigSelect = new StringSelectMenuBuilder()
            .setCustomId('ticketConfigSelect')
            .setOptions(ticketConfigOptions)
            .setPlaceholder('✧˚ · . Edit your ticket settings');

            const actionRow2 = new ActionRowBuilder().addComponents(ticketConfigSelect);

            const ticketEmbed = embeds.get('ticketSettings')(interaction, {guildTicketChannel, guildTicketCategory, guildSupportRoles});
            await interaction.message.edit({ embeds: [ticketEmbed], components: [actionRow1, actionRow2] });
        }

        if (value === 'logging') {
            await interaction.deferUpdate();

            await MySQL.bulkInsertOrUpdate('logging', ['guild_id'], [[interaction.guild.id]]);

            let guildModLog, guildModChannel;
            let guildTicketLog, guildTicketChannel;
            let guildCommandLog, guildCommandChannel;
            let guildMsgLog, guildMsgChannel;
            let guildAuditLog, guildAuditChannel;

            const moderationLog = await MySQL.getValueFromTableWithCondition('logging', 'moderation_log', 'guild_id', interaction.guild.id);
            const moderationChannel = await MySQL.getValueFromTableWithCondition('logging', 'moderation_channel', 'guild_id', interaction.guild.id);
            const ticketLog = await MySQL.getValueFromTableWithCondition('logging', 'ticket_log', 'guild_id', interaction.guild.id);
            const ticketChannel = await MySQL.getValueFromTableWithCondition('logging', 'ticket_channel', 'guild_id', interaction.guild.id);
            const commandsLog = await MySQL.getValueFromTableWithCondition('logging', 'commands_log', 'guild_id', interaction.guild.id);
            const commandsChannel = await MySQL.getValueFromTableWithCondition('logging', 'commands_channel', 'guild_id', interaction.guild.id);
            const messageLog = await MySQL.getValueFromTableWithCondition('logging', 'message_log', 'guild_id', interaction.guild.id);
            const messageChannel = await MySQL.getValueFromTableWithCondition('logging', 'message_channel', 'guild_id', interaction.guild.id);
            const auditLog = await MySQL.getValueFromTableWithCondition('logging', 'audit_log', 'guild_id', interaction.guild.id);
            const auditChannel = await MySQL.getValueFromTableWithCondition('logging', 'audit_channel', 'guild_id', interaction.guild.id);

            if (moderationLog === 'false' && !moderationChannel) {
                guildModLog = `***Logging:*** ${emojis.red} Disabled`;
                guildModChannel = `***Channel:*** ${emojis.red} None Set`;
            } else {
                guildModLog = `***Logging:*** ${emojis.green} Enabled`;
                guildModChannel = `***Channel:*** <#${moderationChannel}>`;   
            }

            if (ticketLog === 'false' && !ticketChannel) {
                guildTicketLog = `***Logging:*** ${emojis.red} Disabled`;
                guildTicketChannel = `***Channel:*** ${emojis.red} None Set`;
            } else {
                guildTicketLog = `***Logging:*** ${emojis.green} Enabled`;
                guildTicketChannel = `***Channel:*** <#${ticketChannel}>`;
            }

            if (commandsLog === 'false' && !commandsChannel) {
                guildCommandLog =  `***Logging:*** ${emojis.red} Disabled`;
                guildCommandChannel = `***Channel:*** ${emojis.red} None Set`;  
            } else {
                guildCommandLog =  `***Logging:*** ${emojis.green} Enabled`;
                guildCommandChannel = `***Channel:*** <#${commandsChannel}>`;
            }

            if (messageLog === 'false' && !messageChannel) {
                guildMsgLog = `***Logging:*** ${emojis.red} Disabled`;
                guildMsgChannel = `***Channel:*** ${emojis.red} None Set`; 
            } else {
                guildMsgLog = `***Logging:*** ${emojis.green} Enabled`;
                guildMsgChannel = `***Channel:*** <#${messageChannel}>`; 
            }

            if (auditLog === 'false' && !auditChannel) {
                guildAuditLog = `***Logging:*** ${emojis.red} Disabled`;
                guildAuditChannel = `***Channel:*** ${emojis.red} None Set`;
            } else {
                guildAuditLog = `***Logging:*** ${emojis.green} Enabled`;
                guildAuditChannel = `***Channel:*** <#${auditChannel}>`;
            }

            const settingsOptions = [
                {
                    label: 'Welcome/Greetings',
                    emoji: emojis.gekko,
                    description: 'Welcome new users to your guild',
                    value: 'welcome'
                },
                {
                    label: 'Join Roles',
                    emoji: emojis.gekko,
                    description: 'Assign roles to new members',
                    value: 'memberJoin'  
                },
                {
                    label: 'Tickets',
                    emoji: emojis.gekko,
                    description: 'Setup tickets for you guild',
                    value: 'tickets'  
                },
                {
                    label: 'Audit Logging',
                    emoji: emojis.gekko,
                    description: 'Setup audit logging for you guild',
                    value: 'logging'  
                },
                {
                    label: 'Lockdown',
                    emoji: emojis.gekko,
                    description: 'Setup lockdown channels',
                    value: 'lockdown'  
                },
                {
                    label: 'NSFW Features',
                    emoji: emojis.gekko,
                    description: 'Setup NSFW features',
                    value: 'nsfw'  
                }];
            
            const settingsSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('settingsSelectMenu')
            .setPlaceholder('✧˚ · . Choose a setting to configure')
            .setOptions(settingsOptions);
            
            const actionRow1 = new ActionRowBuilder().addComponents(settingsSelectMenu);

            const options = [
                {
                  label: "Moderation",
                  emoji: emojis.gekko,
                  value: "mod",
                },
                {
                  label: "Ticketing",
                  emoji: emojis.gekko,
                  value: "ticket",
                },
                {
                  label: "Commands",
                  emoji: emojis.gekko,
                  value: "command",
                },
                {
                  label: "Messages",
                  emoji: emojis.gekko,
                  value: "message",
                },
                {
                  label: "Audit Logs",
                  emoji: emojis.gekko,
                  value: "audit",
                },  
                {
                    label: 'Disable Feature',
                    emoji: emojis.warning,
                    description: 'Disable this feature entirely',
                    value: 'disable'
                }];
          
              const logSelect = new StringSelectMenuBuilder()
                .setCustomId("config_logging")
                .setPlaceholder("✧˚ · . Edit your logging settings")
                .addOptions(options);
          
              const actionRow2 = new ActionRowBuilder().addComponents(logSelect);

            const loggingSettingsEmbed = embeds.get('loggingSettings')(interaction, {guildModLog, guildModChannel, guildTicketLog, guildTicketChannel, guildCommandLog, guildCommandChannel, guildMsgLog, guildMsgChannel, guildAuditLog, guildAuditChannel});
            await interaction.message.edit({ embeds: [loggingSettingsEmbed], components: [actionRow1, actionRow2] })

        }

        if (value === 'lockdown') {
            await interaction.deferUpdate();
            let guildLockdownChannels;

            const channelIds = await MySQL.getValueFromTableWithCondition('lockdown_config', 'channel_id', 'guild_id', interaction.guild.id);
            if (!channelIds) {
                guildLockdownChannels = `${emojis.red} Not Configured`;
            } else {
                const channelIdsArray = channelIds.split(",");
                const formattedChannels = channelIdsArray.map((channelId) => `<#${channelId}>`).join("\n");
                guildLockdownChannels = `${formattedChannels}`;
            }

            const settingsOptions = [
                {
                    label: 'Welcome/Greetings',
                    emoji: emojis.gekko,
                    description: 'Welcome new users to your guild',
                    value: 'welcome'
                },
                {
                    label: 'Join Roles',
                    emoji: emojis.gekko,
                    description: 'Assign roles to new members',
                    value: 'memberJoin'  
                },
                {
                    label: 'Tickets',
                    emoji: emojis.gekko,
                    description: 'Setup tickets for you guild',
                    value: 'tickets'  
                },
                {
                    label: 'Audit Logging',
                    emoji: emojis.gekko,
                    description: 'Setup audit logging for you guild',
                    value: 'logging'  
                },
                {
                    label: 'Lockdown',
                    emoji: emojis.gekko,
                    description: 'Setup lockdown channels',
                    value: 'lockdown'  
                },
                {
                    label: 'NSFW Features',
                    emoji: emojis.gekko,
                    description: 'Setup NSFW features',
                    value: 'nsfw'  
                }];
            
            const settingsSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('settingsSelectMenu')
            .setPlaceholder('✧˚ · . Choose a setting to configure')
            .setOptions(settingsOptions);
            
            const actionRow1 = new ActionRowBuilder().addComponents(settingsSelectMenu);

            const lockdownOptions = [
                {
                    label: 'Lockdown Channels',
                    emoji: emojis.gekko,
                    description: 'Set/Edit your lockdown channels',
                    value: 'lockdownChannel'
                },
                {
                    label: 'Disable Feature',
                    emoji: emojis.warning,
                    description: 'Disable this feature entirely',
                    value: 'disable'
                }];

            const lockdownConfigSelect = new StringSelectMenuBuilder()
            .setCustomId('lockdownConfigSelect')
            .setOptions(lockdownOptions)
            .setPlaceholder('✧˚ · . Edit your lockdown settings');

            const actionRow2 = new ActionRowBuilder().addComponents(lockdownConfigSelect);

            const LockdownSettingsEmbed = embeds.get('lockdownSettings')(interaction, {guildLockdownChannels});
            await interaction.message.edit({ embeds: [LockdownSettingsEmbed], components: [actionRow1, actionRow2] });
        }

        if (value === 'nsfw') {
            await interaction.deferUpdate();
        }

    }
}
