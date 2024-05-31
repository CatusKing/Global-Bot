const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('print')
    .setDescription('Prints a message into the channel.')
    .addStringOption(option => option.setName('content').setDescription('The message to be printed.').setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  
  
  async execute(interaction, client) {
    const message = await interaction.options.getString('content').replaceAll('\\n', '\n');
    try {
      await interaction.channel.send({content: message});
      await interaction.reply({content: `Message sent!`, ephemeral: true});
      await log.execute(interaction, client);
    } catch (error) {
      console.error('Error handling interaction:', error);
      await interaction.reply({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
    }
  }
}