const { JsonDB, Config } = require('node-json-db');

module.exports = {
  async checks(client) {
    const db = new JsonDB(new Config("db", true, true, './'));
    let data = await db.getData('/data');
    if (data.config !== undefined && data.config.videoOnly !== undefined) {
      let channel = await client.channels.fetch(data.config.videoOnly);
      console.log(channel.id)
      if (!channel.isVoiceBased()) return;
      let guildAFKChannel = channel.guild.afkChannel || null;
      channel.members.forEach((member) => {
        if (!member.voice.selfVideo) member.voice.setChannel(guildAFKChannel, 'Need to have video!')
      });
    }
  }
};