const { readJSON, writeJSON } = require('./storage');

function load() {
  return readJSON('warns.json', {});
}

function save(data) {
  writeJSON('warns.json', data);
}

function addWarn(guildId, userId, moderatorId, reason) {
  const data = load();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = [];

  const warn = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    moderatorId,
    reason: reason || 'Aucune raison fournie',
    timestamp: Date.now(),
  };

  data[guildId][userId].push(warn);
  save(data);
  return warn;
}

function getWarns(guildId, userId) {
  const data = load();
  return data[guildId]?.[userId] || [];
}

function clearWarns(guildId, userId) {
  const data = load();
  if (data[guildId]?.[userId]) {
    delete data[guildId][userId];
    save(data);
    return true;
  }
  return false;
}

function removeWarn(guildId, userId, warnId) {
  const data = load();
  const list = data[guildId]?.[userId];
  if (!list) return false;
  const idx = list.findIndex((w) => w.id === warnId);
  if (idx === -1) return false;
  list.splice(idx, 1);
  if (!list.length) delete data[guildId][userId];
  save(data);
  return true;
}

module.exports = { addWarn, getWarns, clearWarns, removeWarn };
