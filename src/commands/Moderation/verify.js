const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify in the staff server.')
        .addStringOption(option => 
            option.setName('position')
                .setDescription('Please enter the position you applied for.')
                .setRequired(true)
        ),
        async execute(interaction) {
            try {
                const appliedRole = interaction.options.getString('position');
        
                const roleReply = await interaction.reply(`<@${interaction.user.id}>, you have requested verification for the role: **${appliedRole}**. Please provide proof of your accepted application by sending an image.`);
        
                const proofCollector = interaction.channel.createMessageCollector({
                    filter: msg => {
                        if (msg.author.id === interaction.user.id && msg.attachments.size > 0 && msg.attachments.every(attachment => attachment.contentType.startsWith('image'))) {
                            return true;
                        } else {
                            msg.delete().catch(console.error); // Delete the message if it's not an image
                            return false;
                        }
                    },
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
                            { name: '__User Requesting Verification:__', value: `${interaction.user.username}(${interaction.user.id})` },
                            { name: '__Proof Of Verification:__', value: ' '},
                        ],
                        timestamp: new Date(),
                        image: { url: proofAttachment.url }
                    };
        
                    await interaction.followUp({ content: `<@${interaction.user.id}>, your verification pending approval. Here is the information you provided:`, embeds: [embed] });
                });
        
                proofCollector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await interaction.followUp(`<@${interaction.user.id}>, your verification process timed out. Please try again.`);
                    }
                    await roleReply.delete();
                });
            } catch (error) {
                console.error('Error handling interaction:', error);
                await interaction.followUp('An error occurred while processing your request. Please try again later.');
            }
        }
    }
    