const { EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'serverinfo',
  aliases: ['si', 'guildinfo', 'server'],
  description: 'Infos sur le serveur',
  async execute(message) {
    const g = message.guild;
    await g.members.fetch().catch(() => {});

    const text = g.channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
    const voice = g.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
    const cats = g.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size;
    const boost = g.premiumSubscriptionCount || 0;

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle(g.name)
      .setThumbnail(g.iconURL({ size: 256 }))
      .addFields(
        { name: 'Propriétaire', value: `<@${g.ownerId}>`, inline: true },
        { name: 'ID', value: g.id, inline: true },
        { name: 'Créé le', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true },
        { name: 'Membres', value: String(g.memberCount), inline: true },
        { name: 'Rôles', value: String(g.roles.cache.size), inline: true },
        { name: 'Emojis', value: String(g.emojis.cache.size), inline: true },
        { name: 'Salons', value: `💬 ${text} | 🔊 ${voice} | 📁 ${cats}`, inline: true },
        { name: 'Boosts', value: `${boost} (Niveau ${g.premiumTier})`, inline: true },
        { name: 'Vérification', value: String(g.verificationLevel), inline: true }
      )
      .setImage(g.bannerURL({ size: 512 }));

    await message.reply({ embeds: [embed] });
  },
};
