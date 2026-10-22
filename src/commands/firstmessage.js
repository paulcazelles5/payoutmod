const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'firstmessage',
  aliases: ['first'],
  description: 'Lien vers le premier message du salon',
  async execute(message) {
    try {
      const messages = await message.channel.messages.fetch({ after: '0', limit: 1 });
      const first = messages.first();
      if (!first) return message.reply('Impossible de trouver le premier message.');

      const embed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setDescription(`[Aller au premier message](${first.url})`)
        .setFooter({ text: `Par ${first.author.tag}` })
        .setTimestamp(first.createdAt);

      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
