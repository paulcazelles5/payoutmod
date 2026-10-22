const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const { ensureJailRole, ensureJailChannel } = require('../utils/jail');
const config = require('../config');

module.exports = {
  name: 'jailsetup',
  aliases: ['setupjail'],
  description: 'Créer le rôle et le salon Jail',
  async execute(message) {
    if (!hasPermission(message.member, PermissionFlagsBits.Administrator) &&
        !hasPermission(message.member, PermissionFlagsBits.ManageGuild)) {
      return message.reply('❌ Permission Administrateur ou Manage Server requise.');
    }

    try {
      const role = await ensureJailRole(message.guild);
      const channel = await ensureJailChannel(message.guild, role);

      // Donner aux modos la vue sur #jail
      const modPerms = [
        PermissionFlagsBits.KickMembers,
        PermissionFlagsBits.ModerateMembers,
        PermissionFlagsBits.BanMembers,
      ];
      for (const r of message.guild.roles.cache.values()) {
        if (modPerms.some((p) => r.permissions.has(p)) && r.id !== message.guild.id) {
          await channel.permissionOverwrites.edit(r, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
          }).catch(() => {});
        }
      }

      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('🔒 Jail configuré')
        .setDescription(
          `**Rôle :** ${role}\n**Salon :** ${channel}\n\n` +
            `Les membres jailés perdent leurs rôles et ne voient plus que ${channel}.\n` +
            `Utilise \`*jail @user [durée] [raison]\` pour emprisonner.`
        );

      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ Erreur setup : ${err.message}`);
    }
  },
};
