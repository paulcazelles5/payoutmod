const { EmbedBuilder } = require('discord.js');
const config = require('../config');

async function sendModLog(guild, { action, moderator, target, reason, extra }) {
  const channelId = process.env.MOD_LOG_CHANNEL_ID;
  let channel = null;

  if (channelId) {
    channel = guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(() => null);
  }

  if (!channel) {
    channel = guild.channels.cache.find(
      (c) =>
        c.isTextBased() &&
        (c.name.includes('mod-log') || c.name.includes('modlog') || c.name.includes('logs-mod') || c.name === 'moderation')
    );
  }

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(config.colors.mod)
    .setTitle(`Modération — ${action}`)
    .addFields(
      { name: 'Modérateur', value: `${moderator} (\`${moderator.id}\`)`, inline: true },
      { name: 'Cible', value: target ? `${target} (\`${target.id || target}\`)` : 'N/A', inline: true },
      { name: 'Raison', value: reason || 'Aucune raison fournie' }
    )
    .setTimestamp();

  if (extra) {
    for (const [name, value] of Object.entries(extra)) {
      embed.addFields({ name, value: String(value), inline: true });
    }
  }

  await channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { sendModLog };
