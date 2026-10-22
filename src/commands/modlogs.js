const { EmbedBuilder } = require('discord.js');
const { getWarns } = require('../utils/warns');
const config = require('../config');

module.exports = {
  name: 'modlogs',
  aliases: ['history', 'modhistory'],
  description: 'Voir l\'historique de modération (warns)',
  async execute(message, args) {
    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    if (!target) return message.reply('Usage : `*modlogs @user`');

    const warns = getWarns(message.guild.id, target.id);

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle(`Historique — ${target.user.tag}`)
      .setThumbnail(target.user.displayAvatarURL())
      .addFields(
        { name: 'ID', value: target.id, inline: true },
        { name: 'Avertissements', value: String(warns.length), inline: true },
        {
          name: 'Timeout actuel',
          value: target.communicationDisabledUntil
            ? `Jusqu'à <t:${Math.floor(target.communicationDisabledUntilTimestamp / 1000)}:R>`
            : 'Aucun',
          inline: true,
        }
      );

    if (warns.length) {
      const recent = warns
        .slice(-5)
        .reverse()
        .map((w) => `• <t:${Math.floor(w.timestamp / 1000)}:d> — ${w.reason}`)
        .join('\n');
      embed.addFields({ name: 'Derniers warns', value: recent });
    }

    await message.reply({ embeds: [embed] });
  },
};
