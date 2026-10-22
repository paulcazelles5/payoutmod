const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'lock',
  description: 'Verrouiller le salon',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Permission `Manage Channels` requise.');
    }

    const reason = args.join(' ') || 'Aucune raison fournie';
    const everyone = message.guild.roles.everyone;

    try {
      await message.channel.permissionOverwrites.edit(everyone, {
        SendMessages: false,
      });

      const embed = new EmbedBuilder()
        .setColor(config.colors.mod)
        .setDescription(`🔒 Salon verrouillé.\n**Raison :** ${reason}`);

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'LOCK',
        moderator: message.author,
        target: message.channel,
        reason,
      });
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
