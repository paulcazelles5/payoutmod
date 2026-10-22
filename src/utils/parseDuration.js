const ms = require('ms');

function parseDuration(str) {
  if (!str) return null;
  const value = ms(str);
  if (!value || value < 1000) return null;
  // Discord timeout max 28 days
  if (value > 28 * 24 * 60 * 60 * 1000) return null;
  return value;
}

function formatDuration(msValue) {
  return ms(msValue, { long: true });
}

module.exports = { parseDuration, formatDuration };
