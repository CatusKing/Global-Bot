const {SlashCommandBuilder, PermissionsBitField} = require('discord.js')
const log = require("../../otherFunctions/log");

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Revokes the ban on a member from the server.')
    .addUserOption(option => option.setName('target').setDescription('The member you want to revoke the ban from.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for revoking the ban on the member.').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),


    async execute(interaction, client) {
        const user = interaction.options.getUser('target');
        
        
        
        try {
            let reason =  interaction.options.getString('reason') || 'No reason provided';
            if (await interaction.guild.bans.cache.get(user.id) !== undefined) {
                await interaction.guild.bans.remove(user.id, reason);
                await interaction.reply({content: `:eyes: oh ok`, ephemeral: true});
                await interaction.followUp({content: `${user} has been **Unbanned** by ${interaction.user}`});
            } else {
                interaction.reply({ content: 'I could not find that member in the ban list.', ephemeral: true})
            }
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}