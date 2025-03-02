const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const { JsonDB, Config } = require('node-json-db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vent')
        .setDescription('Send a completely anonymous vent.')
        .addStringOption(option => option.setName('vent').setDescription('The to vent be submitted.').setRequired(true)),

    async execute(interaction, client) {

        // Initialize the database
        const db = new JsonDB(new Config("db", true, true, './'));
        let data = await db.getData('/data');

        // Check if the command is enabled
        if (data.config === undefined || data.config.ventChannel === undefined) return interaction.reply({content: 'Could not find a configured vent channel.', ephemeral: true})

        // Set up the channel
        let channel = await interaction.client.channels.fetch(data.config.ventChannel);

        // Send the hidden pending message
        await interaction.reply({content: `Message pending`, ephemeral: true});

        // Set up the quote
        const message = `**---------------**\n### Vent\n${(interaction.options.getString('vent').replaceAll('\\n', '\n'))}`;

        // Send the quote
        try {
            await channel.send({content: message});
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.followUp({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}