const { setDeleted } = require('../utils/snipe');

module.exports = {
  name: 'messageDelete',
  execute(message) {
    if (!message.guild || message.author?.bot) return;
    if (!message.content && !message.attachments.size) return;

    setDeleted(message.channel.id, {
      content: message.content || null,
      authorTag: message.author?.tag || 'Inconnu',
      authorId: message.author?.id,
      authorAvatar: message.author?.displayAvatarURL?.() || null,
      image: message.attachments.find((a) => a.contentType?.startsWith('image/'))?.url || null,
      createdAt: message.createdTimestamp,
      deletedAt: Date.now(),
    });
  },
};
