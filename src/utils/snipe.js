// Mémoire des messages supprimés / édités (par channel)
const deleted = new Map(); // channelId -> { message snapshot }
const edited = new Map();

function setDeleted(channelId, data) {
  deleted.set(channelId, data);
}

function getDeleted(channelId) {
  return deleted.get(channelId) || null;
}

function setEdited(channelId, data) {
  edited.set(channelId, data);
}

function getEdited(channelId) {
  return edited.get(channelId) || null;
}

module.exports = { setDeleted, getDeleted, setEdited, getEdited };
