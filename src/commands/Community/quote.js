const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const { JsonDB, Config } = require('node-json-db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Quote a message another user sent!')
    .addStringOption(option => option.setName('author').setDescription('The author of the quote.').setRequired(true))
    .addStringOption(option => option.setName('quote').setDescription('The quotes the author sent.').setRequired(true)),
  
  async execute(interaction, client) {
    
    // Initialize the database
    const db = new JsonDB(new Config("db", true, true, './'));
    let data = await db.getData('/data');
    
    // Check if the command is enabled
    if (data.config === undefined || data.config.quotesChannel === undefined) return interaction.reply({content: 'Could not find a configured quotes channel.', ephemeral: true})
    
    // Setup the channel and author
    let channel = await interaction.client.channels.fetch(data.config.quotesChannel);
    let author = await interaction.options.getString('author');
    
    // Send the hidden pending message
    await interaction.reply({content: `Message pending`, ephemeral: true});
    
    // Set up the quote
    const message = `**---------------**\n## Quote\n${await interaction.options.getString('quote').replaceAll('\\n', '\n')}\n### Author\n${author}`;
    
    // Send the quote
    try {
      await channel.send({content: message});
      await log.execute(interaction, client);
    } catch (error) {
      console.error('Error handling interaction:', error);
      await interaction.followUp({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
    }
  }
}