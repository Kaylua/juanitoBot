const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

// Configure DotENV
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const clientId = process.env.clientId
const guildId = process.env.guildId
const token = process.env.token

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// REMPLACER L'ID PAR CELUI DE LA COMMANDE A DELETE (pour delete une guild command)
rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1070535564538945629')) // id ici
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// POUR GLOBAL COMMANDS (pas mon cas)
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);