const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const token = TOKEN;
const CLIENT_ID = '1249664047478210601';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Define commands
const commands = [
    new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Purge messages based on filters")
        .addStringOption(option =>
            option.setName("target")
                .setDescription("Target type: user, role, bot, or everyone")
                .setRequired(true)
                .addChoices(
                    { name: "User", value: "user" },
                    { name: "Role", value: "role" },
                    { name: "Bot", value: "bot" },
                    { name: "Everyone", value: "everyone" }
                )
        )
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Number of messages to delete (1-100)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for purging messages")
                .setRequired(false)
        ),
    new SlashCommandBuilder()
        .setName("prune")
        .setDescription("Alias for the purge command")
        .addStringOption(option =>
            option.setName("target")
                .setDescription("Target type: user, role, bot, or everyone")
                .setRequired(true)
                .addChoices(
                    { name: "User", value: "user" },
                    { name: "Role", value: "role" },
                    { name: "Bot", value: "bot" },
                    { name: "Everyone", value: "everyone" }
                )
        )
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Number of messages to delete (1-100)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for pruning messages")
                .setRequired(false)
        ),
];

const rest = new REST({ version: '10' }).setToken(token);

// Deploy commands
(async () => {
    try {
        console.log('Started refreshing global (/) commands.');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands.map(command => command.toJSON()) },
        );

        console.log('Successfully reloaded global (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Handle interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options } = interaction;
    const target = options.getString('target');
    const amount = options.getInteger('amount');
    const reason = options.getString('reason') || "No reason provided";

    if (commandName === 'purge' || commandName === 'prune') {
        // Check permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.followUp({
                content: "You don't have permission to use this command!",
                ephemeral: true,
            });
        }

        if (!interaction.guild.members.me.permissions.has('MANAGE_MESSAGES')) {
            return interaction.followUp({
                content: "I don't have permission to purge messages!",
                ephemeral: true,
            });
        }

        // Validate amount
        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: 'Please provide a number between 1 and 100.',
                ephemeral: true,
            });
        }

        try {
            // Fetch messages
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            let filteredMessages;

            switch (target) {
                case 'user':
                    filteredMessages = messages.filter(msg => msg.author.id === options.getUser('user')?.id);
                    break;
                case 'role':
                    const role = interaction.guild.roles.cache.get(options.getRole('role')?.id);
                    filteredMessages = messages.filter(msg => msg.member?.roles.cache.has(role.id));
                    break;
                case 'bot':
                    filteredMessages = messages.filter(msg => msg.author.bot);
                    break;
                case 'everyone':
                    filteredMessages = messages;
                    break;
            }

            // Limit to the specified amount
            const messagesToDelete = filteredMessages.slice(0, amount);

            // Bulk deleting
            const deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true);

            // Log output
            return interaction.reply({
                content: `Deleted ${deletedMessages.size} messages.\n**Reason:** ${reason}\n**Target:** ${target}\n**Requested by:** ${interaction.user.tag} (${interaction.user.id})`,
                ephemeral: true,
            });

        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'There was an error trying to delete messages in this channel.',
                ephemeral: true,
            });
        }
    }
});

// Login yipeee
client.login(TOKEN);
