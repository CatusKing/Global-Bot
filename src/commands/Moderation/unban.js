const {SlashCommandBuilder, PermissionsBitField} = require('discord.js')
const log = require("../../otherFunctions/log");

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Revokes the ban on a member from the server.')
    .addUserOption(option => option.setName('target').setDescription('The member you want to revoke the ban from.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for revoking the ban on the member.').setRequired(true))
    .addBooleanOption(option => option.setName('hide').setDescription('Hide who sent the command.').setRequired(false))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),


    async execute(interaction, client) {
        const user = interaction.options.getUser('target');
        const hide = interaction.options.getBoolean('hide');
        
        
        
        try {
            let reason =  interaction.options.getString('reason') || 'No reason provided';
            try {
                await interaction.guild.bans.fetch(user.id)
            } catch(error) {
                return interaction.reply({ content: 'I could not find that member in the ban list.', ephemeral: true});
            }
            
            await interaction.guild.bans.remove(user.id, reason);
            await interaction.reply({content: `:eyes: oh ok`, ephemeral: true});
            
            let content = `${user} has been **Unbanned**`
            if (!hide) content += ` by ${interaction.user}`
            await interaction.followUp({content: content});
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}