const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const { jailMember, isJailed } = require('../utils/jail');
const { parseDuration, formatDuration } = require('../utils/parseDuration');
const { sendModLog } = require('../utils/modlog');
const config = require('../config');

module.exports = {
  name: 'jail',
  aliases: ['prison', 'cage'],
  description: 'Mettre un membre en jail',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ModerateMembers) &&
        !hasPermission(message.member, PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ Permission de modération requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) {
      return message.reply('Usage : `*jail @user [durée] [raison]`\nEx : `*jail @user 2h Spam` ou `*jail @user Insultes`');
    }

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    if (isJailed(message.guild.id, target.id)) {
      return message.reply('❌ Ce membre est déjà en jail. Utilise `*unjail`.');
    }

    // Durée optionnelle
    let durationMs = null;
    let reasonParts = args.slice(1).filter((a) => !a.startsWith('<@'));
    const durArg = reasonParts.find((a) => parseDuration(a));
    if (durArg) {
      durationMs = parseDuration(durArg);
      reasonParts = reasonParts.filter((a) => a !== durArg);
    }
    const reason = reasonParts.join(' ') || 'Aucune raison fournie';

    try {
      const result = await jailMember(target, message.author, reason, durationMs);
      if (!result.ok) return message.reply(`❌ ${result.error}`);

      // Replanifier unjail si durée
      if (durationMs) {
        setTimeout(async () => {
          try {
            const { unjailMember, isJailed: still } = require('../utils/jail');
            if (still(message.guild.id, target.id)) {
              const m = await message.guild.members.fetch(target.id).catch(() => null);
              if (m) await unjailMember(m, message.client.user, 'Jail expiré');
            }
          } catch {}
        }, durationMs);
      }

      const embed = new EmbedBuilder()
        .setColor(config.colors.jail)
        .setDescription(
          `🔒 **${target.user.tag}** a été mis en jail.\n**Raison :** ${reason}` +
            (durationMs ? `\n**Durée :** ${formatDuration(durationMs)}` : '\n**Durée :** Permanente (jusqu\'à unjail)')
        )
        .setFooter({ text: `Par ${message.author.tag}` });

      await message.reply({ embeds: [embed] });
      await sendModLog(message.guild, {
        action: 'JAIL',
        moderator: message.author,
        target: target.user,
        reason,
        color: config.colors.jail,
        extra: durationMs ? { Durée: formatDuration(durationMs) } : { Durée: 'Permanente' },
      });

      await target.send(
        `Tu as été mis en **jail** sur **${message.guild.name}**.\n**Raison :** ${reason}` +
          (durationMs ? `\n**Durée :** ${formatDuration(durationMs)}` : '')
      ).catch(() => {});
    } catch (err) {
      await message.reply(`❌ Erreur jail : ${err.message}`);
    }
  },
};
