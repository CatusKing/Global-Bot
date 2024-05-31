const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const log = require("../../otherFunctions/log");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear_timeout')
        .setDescription('Clears timeout of a selected member within the server.')
        .addUserOption(option => option.setName('target').setDescription('The member to clear the timeout.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for clearing the timeout on the user.').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),

    async execute(interaction, client) {
        const user = interaction.options.getUser('target');
        const isMember = await interaction.guild.members.fetch(user.id).then(() => true).catch(() => false);
        if (!isMember) return interaction.reply({ content: 'The user is not a member of the server', ephemeral: true});
        const member = await interaction.guild.members.fetch(user.id);


        if (!member.moderatable) return await interaction.reply({ content: 'I can not timeout this member', ephemeral: true});

        let reason =  interaction.options.getString('reason') || 'No reason provided';
        try {
            await member.timeout(null, reason);
            
            await interaction.reply({content: `:eyes: oh boy`, ephemeral: true});
            await interaction.followUp({content: `${user}'s **Timeout** has been **Cleared** by ${interaction.user}`})
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}
    

