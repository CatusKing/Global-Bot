const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const {JsonDB, Config} = require("node-json-db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('demote')
        .setDescription('Demote a staff member and update the db.')
        .addUserOption(option => option.setName('member').setDescription('The person you want to demote.').setRequired(true))
        .addRoleOption(option => option.setName('position').setDescription('The position you want to demote the member to.').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        // Setup vars
        let userID = interaction.options.getUser('member').id;
        let member = await interaction.guild.members.fetch(userID);
        let role = interaction.options.getRole('position');

        // Init database
        const db = new JsonDB(new Config("db", true, true, './'));
        let data = await db.getData('/data');
        if (data.staff === undefined) data.staff = [];

        // Try to demote
        try {
            let staff = data.staff.filter(staff => staff.id === userID);
            if (staff[0] === undefined) return interaction.reply('Staff member is not stored in the db!');

            // Quick bot check
            if (member.bot) return interaction.reply('You can\'t hire a bot!');

            for (let i = 0; i < data.staff.length; i++) {
                if (data.staff[i].id === member.id) {

                    // Remove and filter data
                    let oldStaff = data.staff[i];
                    data.staff = data.staff.filter(staff => staff.id !== userID);

                    // Add and remove roles then update data
                    member.roles.add(role).catch(() => {});
                    member.roles.remove(oldStaff.position).catch(() => {});
                    data.staff.push(
                        {
                            id: member.id,
                            position: role.id,
                            hireDate: oldStaff.hireDate,
                            strikes: oldStaff.strikes
                        }
                    )

                    let content = `Demoted ${member} to ${role}`

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