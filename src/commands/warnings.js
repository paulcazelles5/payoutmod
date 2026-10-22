const { EmbedBuilder } = require('discord.js');
const { getWarns } = require('../utils/warns');
const config = require('../config');

module.exports = {
  name: 'warnings',
  aliases: ['warns'],
  description: 'Voir les avertissements d\'un membre',
  async execute(message, args) {
    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null) ||
      message.member;

    const warns = getWarns(message.guild.id, target.id);

    if (!warns.length) {
      return message.reply(`✅ **${target.user.tag}** n'a aucun avertissement.`);
    }

    const list = warns
      .slice(-10)
      .map(
        (w, i) =>
          `**${i + 1}.** <t:${Math.floor(w.timestamp / 1000)}:R> — ${w.reason}\n└ Par <@${w.moderatorId}> (\`${w.id}\`)`
      )
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(config.colors.warn)
      .setTitle(`Avertissements de ${target.user.tag}`)
      .setDescription(list)
      .setFooter({ text: `Total : ${warns.length}` });

    await message.reply({ embeds: [embed] });
  },
};
