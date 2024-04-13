const {SlashCommandBuilder} = require('discord.js')

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user')
    .addUserOption(option => option.setName('user').setDescription('Select the user you wish to ban!').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for banning this user').setRequired(true)),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const executor = interaction.user;

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return await interaction.reply('You do not have permission to ban members!');

        }

        try {

            await interaction.guild.members.ban(user, {reason: reason});
            


            await interaction.reply({content: `Moderator: <@${interaction.user.id}> \nhas banned: ${user} \nfor: ${reason}`});
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to ban the user. Please check the provided user.');
        }


    }
}