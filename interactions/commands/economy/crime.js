import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import MySQL from "../../../models/mysql.js";
import colors from "../../../models/colors.js";
import config from "../../../config.js";

function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

const cooldowns = new Map();

export default {
    data: new SlashCommandBuilder()
    .setName('crime').setDescription('Commit a crime to earn earn Gekkō Hearts'),
    async execute(interaction) {
        const restricted = MySQL.getValueFromTableWithCondition(
            "guilds",
            "restricted_guild",
            "guild_id",
            interaction.guild.id
          );
      
        if (restricted === "true") {
        const permissionErrorEmbed = embeds.get("guildRestricted")(interaction);
        return await interaction.reply({
            embeds: [permissionErrorEmbed],
            ephemeral: true,
        });
        }

        if (cooldowns.has(interaction.user.id)) {
            const expirationTime = cooldowns.get(interaction.user.id);
            const currentTime = Date.now();
            const remainingTime = expirationTime - currentTime;

            if (remainingTime > 0) {
                const cooldownEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.warning} Economy Error`)
                .setDescription(`You are on cooldown. Please wait ${formatTime(remainingTime)}.`)
                .setColor('Red');

                await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
                return;
            }
        }

        const cooldownTime = 4 * 60 * 60 * 1000;
        const expirationTime = Date.now() + cooldownTime;
        cooldowns.set(interaction.user.id, expirationTime);

        const isSuccess = Math.random() < 0.5; //50% chance of fail & pass
        if (isSuccess) {
            const earnedHearts = Math.floor(Math.random() * (170 - 20 + 1)) + 20;
            const prevHeartsBal = await MySQL.getValueFromTableWithCondition('economy', 'cash_amount', 'user_id', interaction.user.id);
            
            if (prevHeartsBal === null) {
                const newHeartsBal = earnedHearts;
                await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'guild_id', 'cash_amount'], [[interaction.user.id, interaction.guild.id, newHeartsBal]]);

                const crimeEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username} just commited a crime! (►__◄)`)
                .setDescription(`${interaction.user} earned ${config.emojis.gekkoCoin} \`${earnedHearts}\``)
                .setColor(colors.bot)
        
                await interaction.reply({ embeds: [crimeEmbed] });
            } else {
                const newHeartsBal = parseInt(prevHeartsBal) + earnedHearts;
    
                await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'cash_amount'], [[interaction.user.id, newHeartsBal]]);
    
                const crimeEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username} just commited a crime! (►__◄)`)
                .setDescription(`${interaction.user} earned ${config.emojis.gekkoCoin} \`${earnedHearts}\``)
                .setColor(colors.bot)
        
                await interaction.reply({ embeds: [crimeEmbed] });
            }
        } else {
            const earnedHearts = Math.floor(Math.random() * (170 - 20 + 1)) + 20;
            const prevHeartsBal = await MySQL.getValueFromTableWithCondition('economy', 'cash_amount', 'user_id', interaction.user.id);

            if (prevHeartsBal === null) {
                const newHeartsBal = 0 - earnedHearts;
                await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'guild_id', 'cash_amount'], [[interaction.user.id, interaction.guild.id, newHeartsBal]]);
    
                const crimeEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.gekkoPolice} The police are about! \n${interaction.user.username} just commited a crime and was caught...`)
                .setDescription(`${interaction.user} was fined, and paid ${config.emojis.gekkoCoin} \`${earnedHearts}\``)
                .setColor(colors.bot)
        
                await interaction.reply({ embeds: [crimeEmbed] });
            } else {
                const newHeartsBal = parseInt(prevHeartsBal) - earnedHearts;
                await MySQL.bulkInsertOrUpdate('economy', ['user_id', 'cash_amount'], [[interaction.user.id, newHeartsBal]]);
    
                const crimeEmbed = new EmbedBuilder()
                .setTitle(`${config.emojis.gekkoPolice} The police are about! \n${interaction.user.username} just commited a crime and was caught...`)
                .setDescription(`${interaction.user} was fined, and paid ${config.emojis.gekkoCoin} \`${earnedHearts}\``)
                .setColor(colors.bot)
        
                await interaction.reply({ embeds: [crimeEmbed] });
            }   
        }
    }
}