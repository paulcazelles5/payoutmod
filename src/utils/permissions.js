const { PermissionFlagsBits } = require('discord.js');

function canModerate(moderator, target) {
  if (!target) return { ok: false, reason: 'Membre introuvable.' };
  if (target.id === moderator.id) return { ok: false, reason: 'Tu ne peux pas te modérer toi-même.' };
  if (target.id === moderator.client.user.id) return { ok: false, reason: 'Je ne peux pas me modérer.' };
  if (target.user?.bot) return { ok: false, reason: 'Je ne modère pas les bots.' };

  const modMember = moderator.member || moderator;
  const guild = modMember.guild;

  if (target.roles.highest.position >= modMember.roles.highest.position && guild.ownerId !== modMember.id) {
    return { ok: false, reason: 'Tu ne peux pas modérer quelqu\'un avec un rôle égal ou supérieur.' };
  }

  if (target.roles.highest.position >= guild.members.me.roles.highest.position) {
    return { ok: false, reason: 'Je ne peux pas modérer ce membre (rôle trop haut).' };
  }

  return { ok: true };
}

function hasPermission(member, permission) {
  return member.permissions.has(permission) || member.permissions.has(PermissionFlagsBits.Administrator);
}

module.exports = { canModerate, hasPermission };
