const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'purge',
  aliases: ['clear', 'clean'],
  description: 'Supprimer des messages',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ Permission `Manage Messages` requise.');
    }

    const amount = parseInt(args[0], 10);
    if (!amount || amount < 1 || amount > 100) {
      return message.reply('Usage : `*purge <nombre 1-100> [@user]`');
    }

    const target = message.mentions.users.first();

    try {
      const fetched = await message.channel.messages.fetch({ limit: 100 });
      let toDelete = fetched.filter((m) => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);

      if (target) {
        toDelete = toDelete.filter((m) => m.author.id === target.id);
      }

      toDelete = [...toDelete.values()].slice(0, amount);

      if (!toDelete.length) {
        return message.reply('Aucun message à supprimer (limite 14 jours de Discord).');
      }

      const deleted = await message.channel.bulkDelete(toDelete, true);

      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(`🗑️ **${deleted.size}** message(s) supprimé(s)${target ? ` de ${target.tag}` : ''}.`);

      const reply = await message.channel.send({ embeds: [embed] });
      setTimeout(() => reply.delete().catch(() => {}), 4000);
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
