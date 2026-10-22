const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'avatar',
  aliases: ['av', 'pp', 'pdp'],
  description: 'Afficher l\'avatar',
  async execute(message, args) {
    const user =
      message.mentions.users.first() ||
      (args[0] ? await message.client.users.fetch(args[0]).catch(() => null) : null) ||
      message.author;

    const url = user.displayAvatarURL({ size: 4096, extension: 'png' });

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle(`Avatar de ${user.tag}`)
      .setImage(url)
      .setDescription(`[Lien PNG](${url}) · [WebP](${user.displayAvatarURL({ size: 4096 })})`);

    await message.reply({ embeds: [embed] });
  },
};
