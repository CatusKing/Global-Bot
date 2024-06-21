const { JsonDB, Config } = require('node-json-db');

module.exports = {
  async set(commandName, emojiName, emojiID) {
    try {
      const db = new JsonDB(new Config("db", true, true, './'));
      let data = await db.getData('/data');
      if (data.emojis === undefined) data.emojis = [];
      
      for (let i = 0; i < data.emojis.length; i++) {
        if (data.emojis[i].commandName === commandName) {
          data.emojis[i] = {
            commandName: commandName,
            emojiName: emojiName,
            emojiID: emojiID,
            time: new Date().getTime()
          }
        } else if (i === data.emojis.length - 1) {
          let emojiData = {
            commandName: commandName,
            emojiName: emojiName,
            emojiID: emojiID,
            time: new Date().getTime()
          };
          data.emojis.push(emojiData);
        }
      }
      
      await db.push("/data", data);
      
      return true;
    } catch (error) {
      console.error(error);
      
      return false;
    }
  },
  async get(commandName) {
    try {
      const db = await new JsonDB(new Config("db", true, true, './'));
      let data = await db.getData('/data');
      
      if (data.emojis === undefined) return ``;
      
      let emojiData = data.emojis.find((value) => value.commandName === commandName);
      return `<:${emojiData.commandName}:${emojiData.emojiID}>`;
    } catch (error) {
      console.error(error);
      
      return ``;
    }
  }
};