const { EmbedBuilder } = require('discord.js');
const { listJailed } = require('../utils/jail');
const config = require('../config');

module.exports = {
  name: 'jails',
  aliases: ['jailed', 'prisoners'],
  description: 'Liste des membres en jail',
  async execute(message) {
    const list = listJailed(message.guild.id);

    if (!list.length) {
      return message.reply('✅ Personne n\'est en jail actuellement.');
    }

    const lines = await Promise.all(
      list.slice(0, 20).map(async (entry) => {
        const user = await message.client.users.fetch(entry.userId).catch(() => null);
        const tag = user?.tag || entry.userId;
        const exp = entry.expiresAt
          ? `expire <t:${Math.floor(entry.expiresAt / 1000)}:R>`
          : 'permanent';
        return `• **${tag}** — ${entry.reason} (${exp})`;
      })
    );

    const embed = new EmbedBuilder()
      .setColor(config.colors.jail)
      .setTitle(`🔒 Membres en jail (${list.length})`)
      .setDescription(lines.join('\n'));

    await message.reply({ embeds: [embed] });
  },
};
