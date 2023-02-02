const { SlashCommandBuilder } = require('discord.js');
const functions = require('../functions')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stopsound')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		try {
			const guildID = interaction.guild.id
			await functions.stopsound(guildID)
			await interaction.reply("✅ Son stoppé");
			setTimeout(() => interaction.deleteReply(), 10000)
		  } catch (err) {
			await interaction.reply("❌ Erreur lors de l'arrêt du son");
			setTimeout(() => interaction.deleteReply(), 10000)
			console.log(err)
		  }
	},
};