const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const {JsonDB, Config} = require("node-json-db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hire')
        .setDescription('Hire a staff member and add them to the db.')
        .addUserOption(option => option.setName('member').setDescription('The person you want to hire.').setRequired(true))
        .addRoleOption(option => option.setName('position').setDescription('The position you want to hire the member as.').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        // Setup vars
        let userID = interaction.options.getUser('member').id;
        let member = await interaction.guild.members.fetch(userID);

        // Init database
        const db = new JsonDB(new Config("db", true, true, './'));
        let data = await db.getData('/data');
        if (data.staff === undefined) data.staff = [];

        // Try to hire
        try {
            let role = interaction.options.getRole('position');

            // Quick bot check
            if (member.bot) return interaction.reply('You can\'t hire a bot!');

            //Check for hire
            for (let i = 0; i < data.staff.length; i++) {
                if (data.staff[i].id === member.id) return interaction.reply('This person is already hired');
            }

            // Add roles and update data
            member.roles.add(role).catch(() => {});
            data.staff.push(
                {
                    id: member.id,
                    position: role.id,
                    hireDate: new Date().getTime(),
                    strikes: 0
                }
            )
            let content = `Hired ${member} with the position of ${role}`;

            // Push data, reply, and log
            await db.push('/data', data, true);
            interaction.reply(content);
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}