// Require the necessary discord.js classes
const fs = require('node:fs');
const keepAlive = require('./server');
const path = require('node:path');
const birthday = require('./schemas/birthday')
const subscriber = require('./schemas/subscriber')
const functions = require('./functions')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
// Configure DotENV
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});
client.commands = new Collection();

// -- Commands HANDLER
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
// -- 

  async function checkBirthday() {
    var user1 = "";

    const birthdays = await birthday.find({})

    const subscribers = await subscriber.find({})
  
    const today = new Date();
    const todayMonth = today.getMonth()+1;
    const todayDate = today.getDate();

    // Check si anniversaire
    for (const person of birthdays) {
      if (person.month === todayMonth && person.day === todayDate) {
        // Envoyer un message aux destinataires pour leur dire qu'il s'agit de l'anniversaire de la personne
        for (const subscriber of subscribers) {
            try{
                user1 = await client.users.fetch(subscriber.discordid)
            }catch (error) {
                console.error(`❌ Utilisateur pas trouvé: ${error.message}`);
            }
            try{
                if(subscriber.name != person.name){
                    await user1.send("🎂🎉 Aujourd'hui c'est l'anniversaire de "+person.name+" ! 🎂🎉");
                }
            }catch (error) {
                console.error(`❌ Error sending message to user ${subscriber.name}: ${error.message}`);
            }
        }
      }
    }
  }

// CONNECTION DB
const { connect, ConnectionStates, connection, connections } = require("mongoose");
const dbToken = process.env['databaseToken'];

const connectDB = async() => {
  try{
    await connect(dbToken);
    console.log("MongoDB connected !");
  } catch(err){
    console.log("Failed to connect to MongoDB", err);
  }
}
connectDB();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    setInterval(checkBirthday, 86400000); // Check every 24 hours (86400000)
});

const { ReplitKill } = require('replit-kill');
ReplitKill({ Client: client, Time: 5000 });

// Log in to Discord with your client's token
client.login(process.env['token']);
keepAlive();

exports.client = client;