const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'invite',
  aliases: ['inv'],
  description: 'Créer une invitation du salon',
  async execute(message) {
    try {
      if (!message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.CreateInstantInvite)) {
        return message.reply('❌ Je ne peux pas créer d\'invitation ici.');
      }
      const inv = await message.channel.createInvite({
        maxAge: 3600,
        maxUses: 0,
        reason: `Demandé par ${message.author.tag}`,
      });
      const embed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setDescription(`🔗 Invitation (1h) : ${inv.url}`);
      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
