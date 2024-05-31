const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const { JsonDB, Config } = require('node-json-db');
const db = new JsonDB(new Config("db", true, true, './'));


module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Changes a global config setting.')
    .addStringOption(option => option.setName('options').setDescription('The different configs you can change.').setRequired(true).addChoices(
      { name: 'Set Log Channel', value: 'setLogChannel'}
    ))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  
  
  async execute(interaction, client) {
    let data = await db.getData('/data');
    let option = interaction.options.getString('options');
    
    if (option === 'setLogChannel') {
      try {
        if (data.config === undefined) data.config = {
          logChannel: ''
        };
        data.config.logChannel = interaction.channel.id;
        await db.push('/data', data, true);
        await interaction.reply('New log channel has been set.');
        await log.execute(interaction, client);
      } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
      }
    }
  }
}