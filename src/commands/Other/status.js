const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const {JsonDB, Config} = require("node-json-db");
const memory = process.memoryUsage();

const SRC_CODE = 'github.com/CatusKing/Global-Bot';
const VERSION = `v1.0.1`

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get information about the bot.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {

        // Try to make and send the status
        try {
            // Make the content
            let content = '### --------------------\n';
            content += `- **Current Time**: ${new Date()}\n`;
            content += `- **Username**: ${interaction.client.user.username}\n`;
            content += `- **User Tag**: ${interaction.client.user.tag}\n`
            content += `- **Link to source**: ${SRC_CODE}\n`;
            content += `- **Version**: ${VERSION}\n`
            content += `- **Memory**: ${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB\n`;
            content += `- **Guilds**: ${client.guilds.cache.map(guild => guild.name)}\n`
            content += '### --------------------\n';

            // Send the content
            interaction.reply({content: content, ephemeral: true});

            // Log as always
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}