const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const { JsonDB, Config } = require('node-json-db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Quote a message another user sent!')
    .addStringOption(option => option.setName('quote').setDescription('The quotes the author sent.').setRequired(true))
    .addStringOption(option => option.setName('author').setDescription('The author of the quote.').setRequired(true)),
  
  async execute(interaction, client) {
    const db = new JsonDB(new Config("db", true, true, './'));
    let data = await db.getData('/data');
    if (data.config === undefined || data.config.quotesChannel === undefined) return interaction.reply({content: 'Could not find a configured quotes channel.', ephemeral: true})
    let channel = await interaction.client.channels.fetch(data.config.quotesChannel);
    let author = await interaction.options.getString('author');
    
    await interaction.reply({content: `Message pending`, ephemeral: true});
    const message = `## Quote\n${await interaction.options.getString('quote').replaceAll('\\n', '\n')}\n### Author\n${author}\n**---------------**`;
    try {
      await channel.send({content: message});
      await log.execute(interaction, client);
    } catch (error) {
      console.error('Error handling interaction:', error);
      await interaction.followUp({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
    }
  }
}