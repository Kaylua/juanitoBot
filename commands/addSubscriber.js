const { SlashCommandBuilder } = require('discord.js');
const subscriber = require('../schemas/subscriber')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addsubscriber')
		.setDescription('Ajoute une personne à notifier des anniversaires. Format : nom id')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const textInfos = interaction.options.getString('input')
			var tabInfos = textInfos.split(" ");
			var name = tabInfos[0];
			var id = tabInfos[1];

			if (!id || !name || isNaN(id) || typeof name !== 'string') {
				interaction.reply("❌ Veuillez entrer toutes les informations requises sous la forme suivante : nom id (ce message s'autodréruira)");
				setTimeout(() => interaction.deleteReply(), 5000)
				return;
			}
	
			//-- Envois la requête à la BDD
			const newSubscriber = new subscriber();
			newSubscriber.name = name;
			newSubscriber.discordid = id;
			await newSubscriber.save(); // on envois à la bdd
			//--

			await interaction.reply("✅ "+name+" sera notifié des anniversaires (ce message s'autodréruira)");
			setTimeout(() => interaction.deleteReply(), 5000);
		  } catch (err) {
			console.log(err)
			await interaction.reply(`Erreur lors de l'envoi de l'anniversaire`);
		  }
	},
};