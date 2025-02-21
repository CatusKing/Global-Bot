const {SlashCommandBuilder, PermissionsBitField, SlashCommandSubcommandBuilder} = require('discord.js');
const log = require('../../otherFunctions/log');
const { JsonDB, Config } = require('node-json-db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Changes a global config setting.')
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName('set_logs')
      .setDescription('Sets a log channel')
    )
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName('set_quotes_channel')
      .setDescription('Set the quotes channel')
    )
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName('set_video_channel')
      .setDescription('Set the video only channel')
      .addChannelOption(option => option.setName('channel').setDescription('The channel id of the video only channel.').setRequired(true))
    )
    .addSubcommand(new SlashCommandSubcommandBuilder()
        .setName('set_help')
        .setDescription('Set the content for the help command')
        .addStringOption(option => option.setName('content').setDescription('Use \\n to go down a line').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  
  
  async execute(interaction, client) {
    const db = new JsonDB(new Config("db", true, true, './'));
    let data = await db.getData('/data');
    let option = interaction.options.getSubcommand()
    
    if (option === 'set_logs') {
      try {
        if (data.config === undefined) data.config = {
          logChannel: ''
        };
        data.config.logChannel = interaction.channel.id.toString();
        
        await db.push('/data', data, true);
        await interaction.reply('New log channel has been set.');
        await log.execute(interaction, client);
      } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
      }
    } else if (option === 'set_quotes_channel') {
      try {
        if (data.config === undefined) data.config = {
          quotesChannel: ''
        };
        data.config.quotesChannel = interaction.channel.id.toString();
        
        await db.push('/data', data, true);
        await interaction.reply('New quotes channel has been set.');
        await log.execute(interaction, client);
      } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
      }
    } else if (option === 'set_video_channel') {
      try {
        if (data.config === undefined) data.config = {
          videoOnly: ''
        };
        data.config.videoOnly = interaction.options.getChannel('channel').id;
        
        await db.push('/data', data, true);
        await interaction.reply('New video only channel has been set.');
        await log.execute(interaction, client);
      } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
      }
    } else if (option === 'set_help') {
      try {
        if (data.config === undefined) data.config = {
          help: ''
        };
        data.config.help = interaction.options.getString('content').replaceAll('\\n', '\n');

        await db.push('/data', data, true);
        await interaction.reply('New help content has been set.');
        await log.execute(interaction, client);
      } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
      }
    }
  }
}