const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify in the staff server.')
        .addStringOption(option => 
            option.setName('role')
                .setDescription('Please enter the role you applied for.')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const appliedRole = interaction.options.getString('role');

            const roleReply = await interaction.reply(`<@${interaction.user.id}>, you have requested verification for the role: **${appliedRole}**. Please provide proof of your application by sending an image.`);

            const proofCollector = interaction.channel.createMessageCollector({
                filter: msg => msg.attachments.size > 0 && msg.author.id === interaction.user.id,
                max: 1,
                time: 120000
            });

            proofCollector.on('collect', async messages => {
                const proofAttachment = messages.attachments.first();
                await messages.delete();

                const embed = {
                    color: 0x0099ff,
                    title: 'Verification Request',
                    fields: [
                        { name: '__Role Applied For:__', value: appliedRole },
                        { name: '__User Requesting Verification:__', value: interaction.user.username },
                        { name: '__Proof Of Verification:__', value: ' '},
                    ],
                    timestamp: new Date(),
                    image: { url: proofAttachment.url }
                };

                await interaction.followUp({ content: 'Verification complete. Here is the information you provided:', embeds: [embed] });
            });

            proofCollector.on('end', async () => {
                await roleReply.delete();
            });
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.reply('An error occurred while processing your request. Please try again later.');
        }
    }
};