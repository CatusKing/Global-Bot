const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const {JsonDB, Config} = require("node-json-db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('strike')
        .setDescription('Strike a staff member and increase count in the db.')
        .addUserOption(option => option.setName('member').setDescription('The person you want to strike.').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        // Setup base variables
        let userID = interaction.options.getUser('member').id;

        // Init database
        const db = new JsonDB(new Config("db", true, true, './'));
        let data = await db.getData('/data');
        if (data.staff === undefined) data.staff = [];

        // Try the code and catch any errors gracefully
        try {
            // Bot check
            if (interaction.options.getUser('member').bot) return interaction.reply('You can\'t strike a bot!');

            // Quickly searching for the record and replace to new strike count using a loop
            for (let i = 0; i < data.staff.length; i++) {
                if (data.staff[i].id === userID) {
                    let staff = data.staff[i]

                    if (staff.id === undefined) continue;

                    staff.strikes = staff.strikes + 1 || 1;
                    data.staff[i] = staff;

                    await db.push('/data', data, true);
                    let content = `# Struck <@${staff.id}>\nTotal Strikes: ${staff.strikes}`

                    await interaction.reply(content);
                    await log.execute(interaction, client);
                    return;
                }
            }
            return interaction.reply('Staff Member is not stored in the db!');
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}