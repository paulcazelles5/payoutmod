const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'membercount',
  aliases: ['members', 'mc'],
  description: 'Nombre de membres',
  async execute(message) {
    const g = message.guild;
    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setDescription(`👥 **${g.memberCount}** membres sur **${g.name}**.`);
    await message.reply({ embeds: [embed] });
  },
};
