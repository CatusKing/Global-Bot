const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inactive')
        .setDescription('Formats your inactivity notice.')
        .addStringOption(option => option.setName('length').setDescription('Length for the inactivity period.').setRequired(true))
        .addStringOption(option => option.setName('return').setDescription('Date of return for the inactivity period.').setRequired(true))
        .addRoleOption(option => option.setName('position').setDescription('The current position you hold.').setRequired(true))
        .addStringOption(option => option.setName('notes').setDescription('Notes for the inactivity notice.').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MentionEveryone),

    async execute(interaction, client) {
        // Role object input
        const position = interaction.options.getRole('position');

        // String input
        const notes = interaction.options.getString('notes');

        // Length of inactivity
        const length = interaction.options.getString('length');

        // Date of returning from inactivity
        const return_date = interaction.options.getString('return');

        // Send formatted inactivity notice
        await interaction.reply(`# Inactivity Notice\n**Position**: ${position}\n**Length**: ${length}\n**Estimated Return Date**: ${return_date}\n**Notes**: ${notes}`);

        // Log any information
        await log.execute(interaction, client);
    }
}