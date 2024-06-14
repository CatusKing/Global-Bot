const { SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const log = require("../../otherFunctions/log");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Send a request to verify a staff position.')
        .addStringOption(option => 
            option.setName('position')
                .setDescription('Please enter the position you applied for.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MentionEveryone),
        async execute(interaction, client) {
            try {
                await log.execute(interaction, client);
                
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
        
                    const embed = {
                        color: 0x0099ff,
                        title: 'Verification Request',
                        fields: [
                            { name: 'Role Applied For:', value: appliedRole },
                            { name: 'User Requesting Verification:', value: `${interaction.user}\n${interaction.user.tag}\n${interaction.user.id}` },
                            { name: 'Proof Of Verification:', value: ' '}
                        ],
                        timestamp: new Date(),
                        image: { url: proofAttachment.url }
                    };
        
                    await interaction.followUp({ content: `<@${interaction.user.id}>, your verification pending approval. Here is the information you provided:`, embeds: [embed] });
                    await messages.delete();
                });
        
                proofCollector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await interaction.followUp(`<@${interaction.user.id}>, your verification process timed out. Please try again.`);
                    }
                    await roleReply.delete();
                });
            } catch (error) {
                console.error('Error handling interaction:', error);
                await interaction.channel.send({content: 'An error occurred while processing your request.\nPlease contact a developer if this persists.'});
            }
        }
    }
    