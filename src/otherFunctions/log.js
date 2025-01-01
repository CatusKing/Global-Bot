const { JsonDB, Config } = require('node-json-db');

module.exports = {
  async execute(interaction, client) {
    try {
      
      //Initialize the database
      const db = new JsonDB(new Config("db", true, true, './'));
      let data = await db.getData('/data');
      
      // Check if the command is enabled
      let quoteChannel = false;
      if (data.config !== undefined && data.config.quotesChannel !== undefined) quoteChannel = data.config.quotesChannel
      if (data.logs === undefined) data.logs = [];
      let target = interaction.options.getUser('target');
      if (target !== null) target = target.id;
      
      // Log the command
      let logData = {
        id: data.logs.length + 1,
        channel: interaction.channel.id,
        command: interaction.commandName,
        userID: interaction.user.id,
        targetUserID: target,
        reason: interaction.options.getString('reason'),
        content: interaction.options.getString('content'),
        option: interaction.options.getString('options'),
        duration: interaction.options.getString('duration'),
        time: new Date().getTime()
      };
      data.logs.push(logData);
      await db.push("/data", data);
      
      // Check if the log channel is set
      if (data.config === undefined || data.config.logChannel === undefined) return false;
      
      // Add any information to the log
      let content = `## Log #${data.logs.length}\n**Command**: ${interaction.commandName}\n**User**: ${interaction.user} | ${interaction.user.id}\n**Channel**: ${interaction.channel} | ${interaction.channel.id}`
      if (interaction.options.getUser('target') !== null) content += `\n**Target**: ${interaction.options.getUser('target')} | ${target}`;
      if (interaction.options.getString('reason') !== null) content += `\n**Reason**: ${interaction.options.getString('reason')}`;
      if (interaction.options.data[0].type === 1) content += `\n**Sub Command**: ${interaction.options.data[0].name}`;
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