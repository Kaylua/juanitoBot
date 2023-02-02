const { SlashCommandBuilder } = require('discord.js');
const birthday = require('../schemas/birthday')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addbirthday')
		.setDescription('Ajoute un nouvel anniversaire.')
		.addNumberOption(option =>
			option.setName('jour')
				.setDescription('Entrer le jour')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('mois')
				.setDescription('Entrer le mois')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('prenom')
				.setDescription('Entrer le prénom')
				.setRequired(true)),
	async execute(interaction) {
		try {
			var day = interaction.options.getNumber('jour')
			var month = interaction.options.getNumber('mois')
			var name = interaction.options.getString('prenom')

			if (!day || !month || !name || isNaN(day) || isNaN(month) || typeof name !== 'string') {
				interaction.reply("❌ Une erreur est survenue, vérifiez les informations rentrées.");
				setTimeout(() => interaction.deleteReply(), 5000)
				return;
			}
	
			//-- Envois la requête à la BDD
			const newbirthday = new birthday();
			newbirthday.name = name;
			newbirthday.month = month;
			newbirthday.day = day;
			await newbirthday.save(); // on envois à la bdd
			//--

			await interaction.reply("✅ L'anniversaire de "+name+" a été ajouté !");
			setTimeout(() => interaction.deleteReply(), 5000);
		  } catch (err) {
			console.log(err)
			await interaction.reply(`Erreur lors de l'envoi de l'anniversaire`);
		  }
	},
};