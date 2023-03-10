const { SlashCommandBuilder } = require('discord.js');
const functions = require('../functions')
const client = require('../index')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playsound')
		.setDescription('Joue un son youtube dans ton channel')
		.addStringOption(option =>
			option.setName('lien')
				.setDescription('The input to echo back')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const lienYTB = interaction.options.getString('lien')
			const Member = interaction.member
			const channelID = Member.voice.channel?.id
			const guildID = interaction.guild.id
		
			if (Member.voice.channel) { 
			  await functions.joinchannel(channelID, guildID)
			  await functions.playsoundYTB(guildID, lienYTB)
			  await interaction.reply("✅ Son joué");
			  setTimeout(() => interaction.deleteReply(), 5000)
			} else {
			  // Pas connecté à un channel
			  throw new Error(`Veuillez vous connecter à un salon vocal.`);
			};
			//--
		
		  } catch (err) {
			console.log(err)
			await interaction.reply("❌ Erreur, connectez vous à un salon vocal ou vérifiez le lien donné.");
			setTimeout(() => interaction.deleteReply(), 7000)
		  }
	},
};