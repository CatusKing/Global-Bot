const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const {JsonDB, Config} = require("node-json-db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fire')
        .setDescription('Fire a staff member and remove them from the db.')
        .addUserOption(option => option.setName('member').setDescription('The person you want to fire.').setRequired(true))
        .addRoleOption(option => option.setName('position').setDescription('The position the member currently holds.').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {

        // Setup vars
        let userID = interaction.options.getUser('member').id;
        let member = await interaction.guild.members.fetch(userID);

        // Init database
        const db = new JsonDB(new Config("db", true, true, './'));
        let data = await db.getData('/data');
        if (data.staff === undefined) data.staff = [];

        // Try to fire
        try {
            let role = interaction.options.getRole('position');

            // Quick bot check
            if (member.bot) return interaction.reply('You can\'t hire a bot!');

            for (let i = 0; i < data.staff.length; i++) {
                if (data.staff[i].id === member.id) {
                    // Remove and filter data
                    data.staff = data.staff.filter(staff => staff.id !== userID);

                    // Remove the role and create response
                    member.roles.remove(role).catch(() => {});
                    let content = `Fired ${member} with the position of ${role}`;

                    // Push to database, reply, and log
                    await db.push('/data', data, true);
                    interaction.reply(content);
                    await log.execute(interaction, client);
                    break;
                }
            }


        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}