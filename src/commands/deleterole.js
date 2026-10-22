const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'deleterole',
  description: 'Supprimer un rôle',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageRoles)) {
      return message.reply('❌ Permission requise.');
    }

    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[0]) ||
      message.guild.roles.cache.find((r) => r.name.toLowerCase() === args.join(' ').toLowerCase());

    if (!role) return message.reply('Usage : `*deleterole @role`');

    if (role.position >= message.guild.members.me.roles.highest.position) {
      return message.reply('❌ Rôle trop haut pour moi.');
    }

    try {
      const name = role.name;
      await role.delete(`Par ${message.author.tag}`);
      await message.reply({
        embeds: [new EmbedBuilder().setColor(config.colors.mod).setDescription(`🗑️ Rôle **${name}** supprimé.`)],
      });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
