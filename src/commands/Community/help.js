const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const {JsonDB, Config} = require("node-json-db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get information on the server.'),

    async execute(interaction, client) {
        const db = new JsonDB(new Config("db", true, true, './'));
        let data = await db.getData('/data');
        try {
            interaction.reply({content: data.config.help || 'Not setup yet...', ephemeral: true})
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}