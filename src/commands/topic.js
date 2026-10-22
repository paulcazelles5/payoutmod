const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'topic',
  aliases: ['settopic'],
  description: 'Changer le topic du salon',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ Permission requise.');
    }

    const topic = args.join(' ') || null;
    try {
      await message.channel.setTopic(topic, `Par ${message.author.tag}`);
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(topic ? `✅ Topic défini : ${topic}` : '✅ Topic effacé.'),
        ],
      });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
