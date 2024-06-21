const {SlashCommandBuilder, PermissionsBitField, SlashCommandSubcommandBuilder} = require('discord.js');
const log = require('../../otherFunctions/log');
const emoji = require('../../otherFunctions/emoji');
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
      .setName('set_emoji')
      .setDescription('Set the emoji for a command')
      .addStringOption(option => option.setName('command_name').setDescription('The name of the command or feature.').setRequired(true))
      .addStringOption(option => option.setName('emoji').setDescription('The ID of the emoji.').setRequired(true))
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
    } else if (option === 'set_emoji') {
      try {
        let commandName = interaction.options.getString('command_name');
        let emojiData = interaction.options.getString('emoji');
        const regex = /^<:[a-zA-Z0-9_]+:\d+>$/;
        if (!regex.test(emojiData)) return interaction.reply({content: 'Invalid emoji', ephemeral: true});
        emojiData = emojiData.split(':');
        emojiData[2] = emojiData[2].replace('>', '');
        await emoji.set(commandName, emojiData[1], emojiData[2]);
        await interaction.reply(`${commandName}'s emoji has been set to <:${emojiData[1]}:${emojiData[2]}>`);
        await log.execute(interaction, client);
      } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
      }
    }
  }
}