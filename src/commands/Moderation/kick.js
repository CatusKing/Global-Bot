const {SlashCommandBuilder, PermissionsBitField} = require('discord.js')

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user')
    .addUserOption(option => option.setName('user').setDescription('Select the user you wish to kick!').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for kicking this user').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),


    async execute(interaction, client) {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const executor = interaction.user;
        const channel = 'CHANNEL ID';

        try {

            await interaction.guild.members.kick(user, {reason: reason});
            


            await interaction.reply({content: `${user} has been kicked.`});
            channel.send(`${user} has been kicked by ${interaction.user.id} for the reason: ${reason} `)
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to kick the user. Please check the provided user.');
            
        }



    }
}