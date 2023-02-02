const { SlashCommandBuilder } = require('discord.js');
const functions = require('../functions')
const client = require('../index')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playsound')
		.setDescription('Replies with Pong!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const Member = interaction.member
			const channelID = Member.voice.channel?.id
			const guildID = interaction.guild.id
		
			if (Member.voice.channel) { 
			  await functions.joinchannel(channelID, guildID)
			  await functions.playsoundYTB(guildID, "https://www.youtube.com/watch?v=D7OWuslFYCw")
			  await interaction.reply("✅ Son joué");
			  setTimeout(() => interaction.deleteReply(), 10000)
			} else {
			  // Pas connecté à un channel
			  throw new Error(`Veuillez vous connecter à un salon vocal.`);
			};
			//--
		
		  } catch (err) {
			console.log(err)
			await interaction.reply("❌ Erreur, connectez vous à un salon vocal ou vérifiez le lien donné.");
			setTimeout(() => interaction.deleteReply(), 10000)
		  }
	},
};