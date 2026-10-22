const { setEdited } = require('../utils/snipe');

module.exports = {
  name: 'messageUpdate',
  execute(oldMessage, newMessage) {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    setEdited(oldMessage.channel.id, {
      oldContent: oldMessage.content || '*vide*',
      newContent: newMessage.content || '*vide*',
      authorTag: oldMessage.author?.tag || 'Inconnu',
      authorId: oldMessage.author?.id,
      authorAvatar: oldMessage.author?.displayAvatarURL?.() || null,
      editedAt: Date.now(),
    });
  },
};
