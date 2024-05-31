const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require("../../otherFunctions/log");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suspicious_user')
    .setDescription('Logs a user as a suspicious server member')
    .addUserOption(option => option.setName('target').setDescription('The target user you would like to log as suspicious(Can be just an id)').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for logging this user as suspicious').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
  
  async execute(interaction, client) {
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');
    
    // Checks if target is self or a bot
    if (user.bot || user.id === interaction.user.id)
      return await interaction.reply({
        content: 'Error: User can not be yourself or a bot\nContact a Developer if you believe this to be a mistake',
        ephemeral: true
      });
    await log.execute(interaction, client);
    
    await interaction.reply(`# Suspicious User Log\n**User**: <@${user.id}>\n**Username**: ${user.tag}\n**User ID**: ${user.id}\n**Reason**: ${reason}`);
  }
}