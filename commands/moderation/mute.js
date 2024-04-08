const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('mysql');
const config = require('../../config.js');

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
)
`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute').setDescription('Mute a user from your discord server.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to mute.').setRequired(true)),
    async execute(interaction) {
       const mutedUser = interaction.options.getUser('user');
       const guildId = interaction.guild.id;

       mysql.query(
            'SELECT muted_role_id FROM muted_users WHERE guild_id ?',
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

                } else {
                    let guild = interaction.client.guilds.cache.get(guildId);

                    const errorEmbed = new EmbedBuilder()
                    .setTitle('Unexpected Error:')
                    .setDescription(`\`\`\`\n${err}\`\`\`\n\nReport this to a developer at our [Discord Server](https://discord.gg/7E5eKtm3YN)`)
                    .setColor(color.bot);

                    if (!guild) {
                        console.error(`Guild (${guild}) couldn't be found.`);
                        return interaction.reply({ embeds: [errorEmbed] });
                    }

                    interaction.reply("A muted role couldn't be found so I'm going to create one for you!");

                    guild.roles.create({
                        data: {
                            name: 'Muted',
                            permissions: []
                        }
                    })
                    .then((role) => {
                        mysql.query(
                            'INSERT INTO muted_users (guild_id, muted_role_id) VALUES (?, ?)',
                            [guildId, role.id],
                            (err, result) => {
                                if (err) {
                                    console.error('Error saving muted role ID:', err);
                                    return interaction.reply('Failed to save muted role ID.');
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
                                    return interaction.reply('Failed to mute user.');
                                });
                                
                                interaction.reply('Failed to save muted role ID:', err);
                            }
                        );
                    }).catch((err) => {
                        console.log(`Error created muted role for guild (${guildId}):`, err);
                        return interaction.reply('Failed to create muted role.');
                    });
                }
            } 
        )
    }
};