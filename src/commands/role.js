const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'role',
  description: 'Ajouter ou retirer un rôle',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageRoles)) {
      return message.reply('❌ Permission `Manage Roles` requise.');
    }

    const action = (args[0] || '').toLowerCase();
    if (!['add', 'remove', 'ajouter', 'retirer'].includes(action)) {
      return message.reply('Usage : `*role add|remove @user @role`');
    }

    const target =
      message.mentions.members.first() ||
      (args[1] ? await message.guild.members.fetch(args[1]).catch(() => null) : null);

    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find((r) => r.name.toLowerCase() === args.slice(2).join(' ').toLowerCase());

    if (!target || !role) {
      return message.reply('Usage : `*role add|remove @user @role`');
    }

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    if (role.position >= message.guild.members.me.roles.highest.position) {
      return message.reply('❌ Je ne peux pas gérer ce rôle (trop haut).');
    }

    if (role.position >= message.member.roles.highest.position && message.guild.ownerId !== message.author.id) {
      return message.reply('❌ Tu ne peux pas gérer un rôle égal ou supérieur au tien.');
    }

    const isAdd = ['add', 'ajouter'].includes(action);

    try {
      if (isAdd) {
        await target.roles.add(role, `Par ${message.author.tag}`);
      } else {
        await target.roles.remove(role, `Par ${message.author.tag}`);
      }

      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(
          isAdd
            ? `✅ Rôle **${role.name}** ajouté à **${target.user.tag}**.`
            : `✅ Rôle **${role.name}** retiré de **${target.user.tag}**.`
        );

      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ Erreur : ${err.message}`);
    }
  },
};
