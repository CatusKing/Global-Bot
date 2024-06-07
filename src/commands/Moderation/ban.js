const {SlashCommandBuilder, PermissionsBitField} = require('discord.js')
const log = require("../../otherFunctions/log");

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member from the server.')
    .addUserOption(option => option.setName('target').setDescription('The member you want to ban.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for banning the selected member.').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),


    async execute(interaction, client) {
        const user = interaction.options.getUser('target');
        
        const isMember = await interaction.guild.members.fetch(user.id).then(() => true).catch(() => false);
        try {
            let reason =  interaction.options.getString('reason') || 'No reason provided';
            if (!isMember) {
                await interaction.guild.bans.create(user.id, {reason: reason});
            } else {
                const member = await interaction.guild.members.fetch(user.id);
                
                if (!member.moderatable) return await interaction.reply({ content: 'I can not ban this member', ephemeral: true});
                
                await member.ban({reason: reason});
            }
            await interaction.reply({content: `:eyes: oh boy`, ephemeral: true});
            await interaction.followUp({content: `${user} has been **Banned** by ${interaction.user}`});
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}