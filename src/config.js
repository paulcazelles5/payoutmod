module.exports = {
  prefix: '*',
  // Mots interdits (minuscules). Vide = désactivé
  bannedWords: [
    // 'exemple',
  ],
  // Bloquer les invitations discord.gg / discord.com/invite
  blockInvites: false,
  // Anti-spam
  antiSpam: {
    enabled: true,
    maxMessages: 5,
    windowMs: 5000,
    timeoutMs: 60_000,
  },
  // Jail
  jail: {
    roleName: 'Jailed',
    channelName: 'jail',
  },
  // Couleurs embeds
  colors: {
    mod: 0xed4245,
    success: 0x57f287,
    warn: 0xfee75c,
    info: 0x5865f2,
    jail: 0x95a5a6,
    soft: 0xe67e22,
  },
};
