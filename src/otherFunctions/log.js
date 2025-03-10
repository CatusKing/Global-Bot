const { JsonDB, Config } = require('node-json-db');

module.exports = {
  async execute(interaction, client) {
    try {

      //Initialize the database
      const db = new JsonDB(new Config("db", true, true, './'));
      let data = await db.getData('/data');

      // Check if the log channel is set
      if (data.config === undefined || data.config.logChannel === undefined) return false;

      // Setup and check for vars
      let quoteChannel = false;
      let target = interaction.options.getUser('target');
      if (data.logs === undefined || !Number.isInteger(data.logs)) data.logs = 0;
      if (data.config.quotesChannel !== undefined) quoteChannel = data.config.quotesChannel;
      if (target !== null) target = target.id;

      // Log the command
      ++data.logs
      await db.push("/data", data);
       
      // Add any information to the log
      let content = `## Log #${data.logs}\n**Command**: ${interaction.commandName}\n**User**: ${interaction.user.tag} | ${interaction.user.id}\n**Channel**: ${interaction.channel} | ${interaction.channel.id}`
      if (interaction.options.getUser('target') !== null) content += `\n**Target**: ${interaction.options.getUser('target').tag} | ${target}`;
      if (interaction.options.getString('reason') !== null) content += `\n**Reason**: ${interaction.options.getString('reason')}`;
      if (interaction.options.data[0] !== undefined && interaction.options.data[0].type === 1) content += `\n**Sub Command**: ${interaction.options.data[0].name}`;
      if (interaction.options.getString('duration') !== null) content += `\n**Duration**: ${interaction.options.getString('duration') / 60} minute(s)`;
      if (interaction.options.getBoolean('hide') !== null) content += `\n**Hidden**: \`true\``;
      if (interaction.options.getString('quote') !== null && quoteChannel) content += `\n**Quotes Channel**: <#${quoteChannel}> | ${quoteChannel}`;
      content += '\n**---------------**';
      
      // Send the log to the log channel
      let channel = await client.channels.fetch(data.config.logChannel);
      await channel.send({content: content});
      
      // Return a positive response
      return true;
    } catch (error) {
      console.error(error);
      return false
    }
  },
};