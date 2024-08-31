const {SlashCommandBuilder, PermissionsBitField} = require('discord.js')
const log = require("../../otherFunctions/log");

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a member from the server.')
    .addUserOption(option => option.setName('target').setDescription('The member you want to kick.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for kicking the selected member.').setRequired(true))
    .addBooleanOption(option => option.setName('hide').setDescription('Hide who sent the command.').setRequired(false))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),


    async execute(interaction, client) {
        const user = interaction.options.getUser('target');
        const hide = interaction.options.getBoolean('hide');
        const isMember = await interaction.guild.members.fetch(user.id).then(() => true).catch(() => false);
        if (!isMember) return interaction.reply({ content: 'The user is not a member of the server', ephemeral: true});
        const member = await interaction.guild.members.fetch(user.id);
        
        
        if (!member.moderatable) return await interaction.reply({ content: 'I can not kick this member', ephemeral: true});
        
        let reason =  interaction.options.getString('reason') || 'No reason provided';
        try {
            await member.kick(reason);
            
            await interaction.reply({content: `:eyes: oh boy`, ephemeral: true});
            let content = `${user} has been **Kicked**`
            if (!hide) content += ` by ${interaction.user}`
            await interaction.followUp({content: content});
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}