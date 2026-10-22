const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'banner',
  description: 'Afficher la bannière d\'un utilisateur',
  async execute(message, args) {
    const user =
      message.mentions.users.first() ||
      (args[0] ? await message.client.users.fetch(args[0]).catch(() => null) : null) ||
      message.author;

    const fetched = await message.client.users.fetch(user.id, { force: true });
    const banner = fetched.bannerURL({ size: 4096 });

    if (!banner) return message.reply(`**${user.tag}** n'a pas de bannière.`);

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle(`Bannière de ${user.tag}`)
      .setImage(banner);

    await message.reply({ embeds: [embed] });
  },
};
