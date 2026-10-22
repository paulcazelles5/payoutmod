module.exports = {
  prefix: '*',
  // Mots interdits (minuscules). Vide = désactivé
  bannedWords: [
    // 'exemple',
  ],
  // Bloquer les invitations discord.gg / discord.com/invite
  blockInvites: false,
  // Anti-spam : max messages dans la fenêtre (ms)
  antiSpam: {
    enabled: true,
    maxMessages: 5,
    windowMs: 5000,
    timeoutMs: 60_000, // 1 minute
  },
  // Couleurs embeds
  colors: {
    mod: 0xed4245,
    success: 0x57f287,
    warn: 0xfee75c,
    info: 0x5865f2,
  },
};
