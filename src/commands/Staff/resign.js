const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resign')
        .setDescription('Formats your resignation notice.')
        .addRoleOption(option => option.setName('position').setDescription('The current position you hold').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the resignation notice.').setRequired(true)),

    async execute(interaction, client) {
        // Role object input
        const position = interaction.options.getRole('position');

        // String input
        const reason = interaction.options.getString('reason');

        // Send formatted resignation notice
        await interaction.reply(`# Resignation Notice\n**Name**: ${interaction.user} - ${interaction.user.id}\n**Position**: ${position}\n**Reason**: ${reason}`);

        // Log any information
        await log.execute(interaction, client);
    }
}