const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require('../../otherFunctions/log');
const {JsonDB, Config} = require("node-json-db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Get information about staff member.')
        .addUserOption(option => option.setName('member').setDescription('The person you want to look up.').setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        let userID = interaction.options.getUser('member').id;
        let member = await interaction.guild.members.fetch(userID);
        const db = new JsonDB(new Config("db", true, true, './'));
        let data = await db.getData('/data');
        if (data.staff === undefined) data.staff = [];
        try {
            let staff = data.staff.filter(staff => staff.id === userID)
            if (staff[0] === undefined) return interaction.reply('Staff member is not stored in the db!');
            let content = `# Staff Record\n- **Member**: <@${staff[0].id}>\n- **Position**: <@&${staff[0].position}>\n`;
            content += `- **Current Roles**\n    `;
            member.roles.cache.forEach(role => {
               if (role.name !== '@everyone') content += `${role} `;
            });
            content += `\n- **Hired Date**: <t:${Math.round(staff[0].hireDate / 1000)}:R>\n- **Strikes**: ${staff[0].strikes}`;
            interaction.reply(content);
            await log.execute(interaction, client);
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
        }
    }
}