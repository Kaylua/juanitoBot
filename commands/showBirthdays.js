const { SlashCommandBuilder } = require('discord.js');
const birthday = require('../schemas/birthday')
const client = require('../index')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('showbirthdays')
		.setDescription('Montre tous les anniversaires enregistrés'),
	async execute(interaction) {
		try {
			var birthdays = await birthday.find({})
			var messages = [];

			for (const birthday of birthdays) {
				messages.push("Nom: " + birthday.name + " | Date: " + birthday.day + "/" + birthday.month);
			}
			user1 = interaction.user
			await user1.send(messages.join("\n"));

			await interaction.reply("Liste envoyée en MP !");
			setTimeout(() => interaction.deleteReply(), 5000)
		  } catch (err) {
			console.log(err)
			await interaction.reply(`Erreur lors de l'envoi du message`);
			setTimeout(() => interaction.deleteReply(), 5000)
		  }
	},
};