const { SlashCommandBuilder } = require('discord.js');
const subscriber = require('../schemas/subscriber')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addsubscriber')
		.setDescription('Ajoute une personne à notifier des anniversaires')
		.addStringOption(option =>
			option.setName('prenom')
				.setDescription('Entrer le prénom')
				.setRequired(true)),
	async execute(interaction) {
		try {
			var name = interaction.options.getString('prenom')

			if (!name || typeof name !== 'string') {
				interaction.reply("❌ Une erreur est survenue, vérifiez l'information rentrée.");
				setTimeout(() => interaction.deleteReply(), 5000)
				return;
			}
	
			//-- Envois la requête à la BDD
			const newSubscriber = new subscriber();
			newSubscriber.name = name;
			newSubscriber.discordid = interaction.user.id;
			await newSubscriber.save(); // on envois à la bdd
			//--

			await interaction.reply("✅ Vous serez notifié des anniversaires");
			setTimeout(() => interaction.deleteReply(), 5000);
		  } catch (err) {
			console.log(err)
			await interaction.reply(`❌ Erreur lors de l'envoi de l'anniversaire`);
		  }
	},
};