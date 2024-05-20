const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a selected user')
        .addUserOption(option => option.setName('user').setDescription('Select the user to timeout').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Duration of the timeout in seconds').setRequired(true).addChoices(
                    { name: '60 Seconds', value: '60'},
                    { name: '2 Minutes', value: '120'},
                    { name: '5 Minutes', value: '300' },
                    { name: '10 Minutes', value: '600' },
                    { name: '15 Minutes', value: '900' },
                    { name: '20 Minutes', value: '1200' },
                    { name: '30 Minutes', value: '1800' },
                    { name: '45 Minutes', value: '2700' },
                    { name: '1 Hour', value: '3600' },
                    { name: '2 Hours', value: '7200' },
                    { name: '3 Hours', value: '10800' },
                    { name: '5 Hours', value: '18000' },
                    { name: '10 Hours', value: '36000' },
                    { name: '1 Day', value: '86400' },
                    { name: '2 Days', value: '172800' },
                    { name: '3 Days', value: '259200' },
                    { name: '5 Days', value: '432000' },
                    { name: '1 Week', value: '604800' },
                ))
        .addStringOption(option => option.setName('reason').setDescription('Reason for timing out the user').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const isMember = await interaction.guild.members.fetch(user.id).then(() => true).catch(() => false);
        if (!isMember) return interaction.reply({ content: 'The user is not a member of the server', ephemeral: true});
        const member = await interaction.guild.members.fetch(user.id);
        const duration = interaction.options.getString('duration');
        
        
        if (!member.moderatable) return await interaction.reply({ content: 'I can not timeout this member', ephemeral: true});
        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'I can not timeout this admin', ephemeral: true});

        let reason =  interaction.options.getString('reason') || 'No reason provided';
        try {
            await member.timeout(duration * 1000, reason);
    
            let tempMsg = await interaction.reply({content: `:eyes: oh boy`});
            await interaction.followUp({content: `${user} has been **Timed Out** for **${duration / 60} minute(s)** by ${interaction.user}`})
            await tempMsg.delete();
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.reply('An error occurred while processing your request. Please try again later.');
        }
    }
}
    

