const { readJSON, writeJSON } = require('./storage');

function load() {
  return readJSON('notes.json', {});
}

function save(data) {
  writeJSON('notes.json', data);
}

function addNote(guildId, userId, moderatorId, content) {
  const data = load();
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = [];

  const note = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    moderatorId,
    content,
    timestamp: Date.now(),
  };

  data[guildId][userId].push(note);
  save(data);
  return note;
}

function getNotes(guildId, userId) {
  return load()[guildId]?.[userId] || [];
}

function clearNotes(guildId, userId) {
  const data = load();
  if (data[guildId]?.[userId]) {
    delete data[guildId][userId];
    save(data);
    return true;
  }
  return false;
}

function removeNote(guildId, userId, noteId) {
  const data = load();
  const list = data[guildId]?.[userId];
  if (!list) return false;
  const idx = list.findIndex((n) => n.id === noteId);
  if (idx === -1) return false;
  list.splice(idx, 1);
  if (!list.length) delete data[guildId][userId];
  save(data);
  return true;
}

module.exports = { addNote, getNotes, clearNotes, removeNote };
