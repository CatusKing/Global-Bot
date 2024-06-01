const { JsonDB, Config } = require('node-json-db');

module.exports = {
  async execute(interaction, client) {
    try {
      const db = new JsonDB(new Config("db", true, true, './'));
      let data = await db.getData('/data');
      if (data.logs === undefined) data.logs = [];
      let target = interaction.options.getUser('target');
      if (target !== null) target = target.id;
      
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
      
      if (data.config === undefined || data.config.logChannel === undefined) return false;
      let content = `## Log #${data.logs.length}\n**Command**: ${interaction.commandName}\n**User**: ${interaction.user} | ${interaction.user.id}\n**Channel**: ${interaction.channel}`
      if (interaction.options.getUser('target') !== null) content += `\n**Target**: ${interaction.options.getUser('target')} | ${target}`;
      if (interaction.options.getString('reason') !== null) content += `\n**Reason**: ${interaction.options.getString('reason')}`;
      if (interaction.options.getString('options') !== null) content += `\n**Option**: ${interaction.options.getString('options')}`;
      if (interaction.options.getString('duration') !== null) content += `\n**Duration**: ${interaction.options.getString('duration') / 60} minute(s)`;
      
      let channel = await client.channels.fetch(data.config.logChannel);
      await channel.send({content: content});
      return true;
    } catch (error) {
      console.error(error);
      return false
    }
  },
};