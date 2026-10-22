const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const WARNS_FILE = path.join(DATA_DIR, 'warns.json');

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(WARNS_FILE)) fs.writeFileSync(WARNS_FILE, '{}');
}

function loadWarns() {
  ensureData();
  try {
    return JSON.parse(fs.readFileSync(WARNS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveWarns(data) {
  ensureData();
  fs.writeFileSync(WARNS_FILE, JSON.stringify(data, null, 2));
}

function addWarn(guildId, userId, moderatorId, reason) {
  const data = loadWarns();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = [];

  const warn = {
    id: Date.now().toString(36),
    moderatorId,
    reason: reason || 'Aucune raison fournie',
    timestamp: Date.now(),
  };

  data[guildId][userId].push(warn);
  saveWarns(data);
  return warn;
}

function getWarns(guildId, userId) {
  const data = loadWarns();
  return data[guildId]?.[userId] || [];
}

function clearWarns(guildId, userId) {
  const data = loadWarns();
  if (data[guildId]?.[userId]) {
    delete data[guildId][userId];
    saveWarns(data);
    return true;
  }
  return false;
}

module.exports = { addWarn, getWarns, clearWarns };
