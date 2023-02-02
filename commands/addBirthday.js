const { SlashCommandBuilder } = require('discord.js');
const birthday = require('../schemas/birthday')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addbirthday')
		.setDescription('Ajoute un nouvel anniversaire. Format : jour mois prénom')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const textInfos = interaction.options.getString('input')
			var tabInfos = textInfos.split(" ");
			var day = tabInfos[0];
			var month = tabInfos[1];
			var name = tabInfos[2];

			if (!day || !month || !name || isNaN(day) || isNaN(month) || typeof name !== 'string') {
				interaction.reply("❌ Veuillez entrer toutes les informations requises sous la forme suivante : jour mois nom (ce message s'autodréruira)");
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

			await interaction.reply("✅ L'anniversaire de "+name+" a été ajouté ! (ce message s'autodréruira)");
			setTimeout(() => interaction.deleteReply(), 5000);
		  } catch (err) {
			console.log(err)
			await interaction.reply(`Erreur lors de l'envoi de l'anniversaire`);
		  }
	},
};