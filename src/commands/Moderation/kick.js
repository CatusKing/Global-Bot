const {SlashCommandBuilder, PermissionsBitField} = require('discord.js')

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user')
    .addUserOption(option => option.setName('user').setDescription('Select the user you wish to kick!').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for kicking this user').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),


    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const isMember = await interaction.guild.members.fetch(user.id).then(() => true).catch(() => false);
        if (!isMember) return interaction.reply({ content: 'The user is not a member of the server', ephemeral: true});
        const member = await interaction.guild.members.fetch(user.id);
        
        
        if (!member.moderatable) return await interaction.reply({ content: 'I can not timeout this member', ephemeral: true});
        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'I can not timeout this admin', ephemeral: true});
        
        let reason =  interaction.options.getString('reason') || 'No reason provided';
        try {
            await member.kick(reason);
            
            let tempMsg = await interaction.reply({content: `:eyes: oh boy`});
            await interaction.followUp({content: `${user} has been **Kicked** by ${interaction.user}`})
            await tempMsg.delete();
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.reply({content: 'An error occurred while processing your request. Please try again later.', ephemeral: true});
        }
    }
}