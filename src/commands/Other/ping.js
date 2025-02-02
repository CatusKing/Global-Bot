const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('To test the bots functionality.'),  
  
  async execute(interaction, client) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! 🏓 Latency is **${ping}ms**.`);
    await log.execute(interaction, client);
  }
}