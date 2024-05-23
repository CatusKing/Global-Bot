const {SlashCommandBuilder, PermissionsBitField} = require('discord.js')

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user')
    .addUserOption(option => option.setName('user').setDescription('Select the user you wish to ban!').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for banning this user').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),


    async execute(interaction, client) {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const executor = interaction.user;
        const channel = 'CHANNEL ID';

        try {

            await interaction.guild.members.ban(user, {reason: reason});
            


            await interaction.reply({content: `${user} has been banned.`});
            channel.send(`${user} has been banned by ${interaction.user.id} for the reason: ${reason} `)
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to ban the user. Please check the provided user.');
        }


    }
}