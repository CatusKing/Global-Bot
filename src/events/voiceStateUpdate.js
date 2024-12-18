const { JsonDB, Config } = require('node-json-db');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    try {
      if (!newState.channel || newState.member.id === newState.guild.ownerId) return;
      
      const db = new JsonDB(new Config("db", true, true, './'));
      let data = await db.getData('/data');
      
      // Make sure the required config is available
      if (!data.config || !data.config.videoOnly || newState.channel.id !== data.config.videoOnly) return;
      
      // Fetch the channel and check if it's voice-based
      const channel = await client.channels.fetch(data.config.videoOnly);
      if (!channel.isVoiceBased()) return;
      
      // Get the AFK channel for the guild
      const guildAFKChannel = channel.guild.afkChannel || null;
      
      // If the user has video enabled, do nothing
      if (newState.channel.id !== channel.id) return;
      
      // If the user doesn't have video enabled, move them to the AFK channel
      setTimeout(async () => {
      
        if (newState.member.voice.selfVideo) return;
      
        await newState.member.voice.setChannel(guildAFKChannel, 'Need to have video!');
      
        }, 20 * 1000); // 20-second grace period after joining
    } catch (error) {
      console.error('Error in voiceStateUpdate checks:', error);
    }
  },
};