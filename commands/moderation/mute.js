const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('mysql');
const config = require('../../config.js');
const color = require('../../models/colors.js');

const mysql = db.createConnection({
    host: config.database.host,
    database: config.database.name,
    user: config.database.username,
    password: config.database.password,
    port: config.database.port
})

mysql.query(`
    CREATE TABLE IF NOT EXISTS muted_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        muted_role_id VARCHAR(255) NOT NULL,
        muted_user_id VARCHAR(255) NOT NULL
    )
`);

/* EVERYTHING I CHANGED:
- interaction.reply() inside the mysql callback was not needed.
- added a check to make sure the muted role existed in the db.
- added embed error handling to tidy up the errors.
- I'm not to certain around mysql queries, so I prolly made some mistakes around them, but you can double check. 

It will say Gekko is thinking forever until logic for handling when muted role exists has been added. 
Other than that, I think I resolved all the errors?? ^_-
*/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute').setDescription('Mute a user from your discord server.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to mute.').setRequired(true)),
    async execute(interaction) {
        const mutedUser = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        mysql.query(
            'SELECT muted_role_id FROM muted_users WHERE guild_id = ?',
            [guildId],
            (err, rows) => {
                if (err) {
                    console.error(`Error checked muted role for ${guildId}:`, err);
                    
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('Unexpected Error:')
                        .setDescription(`\`\`\`\n${err}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                        .setColor(color.bot);
    
                    return interaction.reply({ embeds: [errorEmbed] });
                }

                if (rows.length > 0 && rows[0].muted_role_id) {
                        // put what ever you logic is for this??? :D :D 
                } else {
                    let guild = interaction.guild;

                    if (!guild) {
                        console.error(`Guild (${guild}) couldn't be found.`);
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('Database Error:')
                            .setDescription(`Guild couldn't be found`)
                            .setColor(color.bot);
                        return interaction.reply({ embeds: [errorEmbed] });
                    }

                    guild.roles.create({
                        data: {
                            name: 'Muted',
                            permissions: [
                                {
                                    id: guildId,
                                    type: 'ROLE',
                                    permission: false,
                                    deny: ['SEND_MESSAGES']
                                },
                                {
                                    id: guildId,
                                    type: 'SPEAK',
                                    permission: false,
                                    deny: ['SPEAK']
                                }
                            ]
                        }
                    })
                    .then((role) => {
                        mysql.query(
                            'INSERT INTO muted_users (guild_id, muted_role_id) VALUES (?, ?)',
                            [guildId, role.id],
                            (err, result) => {
                                if (err) {
                                    console.error('Error saving muted role ID:', err);
                                    const errorEmbed = new EmbedBuilder()
                                        .setTitle('Database Error:')
                                        .setDescription(`Failed to save muted role ID`)
                                        .setColor(color.bot);
                                    return interaction.reply({ embeds: [errorEmbed] });
                                }
                        
                                const memberToMute = guild.members.cache.get(mutedUser.id);
                        
                                if (!memberToMute) {
                                    return interaction.reply('Member not found!');
                                }
                        
                                memberToMute.roles.add(role)
                                .then(() => {
                                    interaction.reply(`Successfully muted ${mutedUser}`);
                                })
                                .catch(err =>{ 
                                    console.error('Error assigning muted role to member:', err);
                                    const errorEmbed = new EmbedBuilder()
                                        .setTitle('Mute Error:')
                                        .setDescription(`Failed to mute user`)
                                        .setColor(color.bot);
                                    return interaction.reply({ embeds: [errorEmbed] });
                                });
                            }
                        );
                    }).catch((err) => {
                        console.error(`Error created muted role for guild (${guildId}):`, err);
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('Role Creation Error:')
                            .setDescription(`Failed to create muted role`)
                            .setColor(color.bot);
                        return interaction.reply({ embeds: [errorEmbed] });
                    });
                }
            }
        );
        interaction.deferReply({ ephemeral: true });
    }
};