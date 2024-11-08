const { JsonDB, Config } = require('node-json-db');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    try {
      if (!newState.channel || newState.member.permissions.has('Administrator')) return;
      const db = new JsonDB(new Config("db", true, true, './'));
      let data = await db.getData('/data');
      
      // Make sure the required config is available
      if (data.config && data.config.videoOnly) {
        const channel = await client.channels.fetch(data.config.videoOnly);
        
        if (!channel.isVoiceBased()) return;
        
        // Get the AFK channel for the guild
        const guildAFKChannel = channel.guild.afkChannel || null;
        
        if (newState.channel.id === channel.id) {
          setTimeout(async () => {
            if (!newState.member.voice.selfVideo) {
              await newState.member.voice.setChannel(guildAFKChannel, 'Need to have video!');
            }
          }, 10000); // 10-second grace period after joining
        }
      }
    } catch (error) {
      console.error('Error in voiceStateUpdate checks:', error);
    }
  },
};