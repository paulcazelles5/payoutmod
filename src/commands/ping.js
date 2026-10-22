const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'ping',
  aliases: ['latency'],
  description: 'Latence du bot',
  async execute(message) {
    const sent = await message.reply('Pinging...');
    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setDescription(
        `🏓 **Pong!**\nLatence API : **${sent.createdTimestamp - message.createdTimestamp}ms**\nWebsocket : **${message.client.ws.ping}ms**`
      );
    await sent.edit({ content: null, embeds: [embed] });
  },
};
