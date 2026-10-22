const { readJSON, writeJSON } = require('./storage');
const config = require('../config');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

function load() {
  return readJSON('jail.json', {});
}

function save(data) {
  writeJSON('jail.json', data);
}

function getJailData(guildId, userId) {
  return load()[guildId]?.[userId] || null;
}

function isJailed(guildId, userId) {
  return !!getJailData(guildId, userId);
}

function listJailed(guildId) {
  const g = load()[guildId] || {};
  return Object.entries(g).map(([userId, data]) => ({ userId, ...data }));
}

async function ensureJailRole(guild) {
  let role = guild.roles.cache.find((r) => r.name === config.jail.roleName);
  if (!role) {
    role = await guild.roles.create({
      name: config.jail.roleName,
      color: 0x95a5a6,
      reason: 'Rôle Jail automatique — PayoutMod',
      permissions: [],
    });
  }

  // Empêcher le rôle Jail d'écrire partout sauf dans #jail
  for (const channel of guild.channels.cache.values()) {
    if (!channel.permissionOverwrites) continue;
    try {
      if (channel.name === config.jail.channelName) {
        await channel.permissionOverwrites.edit(role, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
        });
      } else {
        await channel.permissionOverwrites.edit(role, {
          ViewChannel: false,
          SendMessages: false,
        });
      }
    } catch {
      // ignore channels we can't edit
    }
  }

  return role;
}

async function ensureJailChannel(guild, jailRole) {
  let channel = guild.channels.cache.find(
    (c) => c.name === config.jail.channelName && c.type === ChannelType.GuildText
  );

  if (!channel) {
    channel = await guild.channels.create({
      name: config.jail.channelName,
      type: ChannelType.GuildText,
      topic: 'Salon de jail — les membres jailés peuvent uniquement parler ici.',
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: jailRole.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: guild.members.me.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageChannels,
          ],
        },
      ],
      reason: 'Salon Jail automatique — PayoutMod',
    });
  }

  return channel;
}

async function jailMember(member, moderator, reason, durationMs = null) {
  const guild = member.guild;
  const jailRole = await ensureJailRole(guild);
  await ensureJailChannel(guild, jailRole);

  if (member.roles.cache.has(jailRole.id)) {
    return { ok: false, error: 'Ce membre est déjà en jail.' };
  }

  // Sauvegarder les rôles (hors @everyone, managed, jail)
  const rolesToSave = member.roles.cache
    .filter((r) => r.id !== guild.id && !r.managed && r.id !== jailRole.id)
    .map((r) => r.id);

  const data = load();
  if (!data[guild.id]) data[guild.id] = {};

  data[guild.id][member.id] = {
    roles: rolesToSave,
    moderatorId: moderator.id,
    reason: reason || 'Aucune raison fournie',
    jailedAt: Date.now(),
    expiresAt: durationMs ? Date.now() + durationMs : null,
  };
  save(data);

  // Retirer tous les rôles et ajouter Jail
  await member.roles.set([jailRole.id], `Jail par ${moderator.tag}: ${reason}`);

  return { ok: true, roles: rolesToSave, expiresAt: data[guild.id][member.id].expiresAt };
}

async function unjailMember(member, moderator, reason) {
  const guild = member.guild;
  const entry = getJailData(guild.id, member.id);
  if (!entry) {
    return { ok: false, error: 'Ce membre n\'est pas en jail.' };
  }

  const jailRole = guild.roles.cache.find((r) => r.name === config.jail.roleName);
  const rolesToRestore = entry.roles.filter((id) => guild.roles.cache.has(id));

  try {
    await member.roles.set(rolesToRestore, `Unjail par ${moderator.tag}: ${reason}`);
  } catch {
    // fallback: remove jail role only
    if (jailRole) await member.roles.remove(jailRole, `Unjail par ${moderator.tag}`).catch(() => {});
    for (const id of rolesToRestore) {
      await member.roles.add(id).catch(() => {});
    }
  }

  const data = load();
  if (data[guild.id]) {
    delete data[guild.id][member.id];
    save(data);
  }

  return { ok: true, restored: rolesToRestore.length };
}

/** Appelé au démarrage pour replanifier les unjails expirés */
function scheduleExpirations(client) {
  const data = load();
  for (const [guildId, users] of Object.entries(data)) {
    for (const [userId, entry] of Object.entries(users)) {
      if (!entry.expiresAt) continue;
      const remaining = entry.expiresAt - Date.now();
      if (remaining <= 0) {
        // unjail immédiat
        client.guilds.fetch(guildId).then(async (guild) => {
          const member = await guild.members.fetch(userId).catch(() => null);
          if (member) await unjailMember(member, client.user, 'Jail expiré');
        }).catch(() => {});
      } else {
        setTimeout(async () => {
          try {
            const guild = await client.guilds.fetch(guildId);
            const member = await guild.members.fetch(userId).catch(() => null);
            if (member && isJailed(guildId, userId)) {
              await unjailMember(member, client.user, 'Jail expiré');
            }
          } catch {}
        }, remaining);
      }
    }
  }
}

module.exports = {
  getJailData,
  isJailed,
  listJailed,
  ensureJailRole,
  ensureJailChannel,
  jailMember,
  unjailMember,
  scheduleExpirations,
};
