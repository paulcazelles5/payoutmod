const config = require('../config');
const { PermissionFlagsBits } = require('discord.js');

// Anti-spam cache
const spamMap = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const { client } = message;

    // --- Auto-mod : mots interdits ---
    if (config.bannedWords.length > 0) {
      const content = message.content.toLowerCase();
      if (config.bannedWords.some((w) => content.includes(w))) {
        if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return;
        await message.delete().catch(() => {});
        const warnMsg = await message.channel
          .send(`${message.author}, ce mot n'est pas autorisé.`)
          .catch(() => null);
        if (warnMsg) setTimeout(() => warnMsg.delete().catch(() => {}), 5000);
        return;
      }
    }

    // --- Auto-mod : invitations ---
    if (config.blockInvites) {
      const inviteRegex = /(discord\.gg\/|discord\.com\/invite\/|discordapp\.com\/invite\/)/i;
      if (inviteRegex.test(message.content)) {
        if (message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return;
        await message.delete().catch(() => {});
        return;
      }
    }

    // --- Anti-spam ---
    if (config.antiSpam.enabled && !message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const key = `${message.guild.id}-${message.author.id}`;
      const now = Date.now();
      let timestamps = spamMap.get(key) || [];
      timestamps = timestamps.filter((t) => now - t < config.antiSpam.windowMs);
      timestamps.push(now);
      spamMap.set(key, timestamps);

      if (timestamps.length >= config.antiSpam.maxMessages) {
        spamMap.set(key, []);
        try {
          await message.member.timeout(config.antiSpam.timeoutMs, 'Anti-spam automatique');
          await message.channel.send(
            `⏱️ ${message.author} a été mis en timeout 1 min pour spam.`
          ).catch(() => {});
        } catch {}
        return;
      }
    }

    // --- Commandes prefix ---
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command =
      client.commands.get(commandName) ||
      client.commands.find((c) => c.aliases?.includes(commandName));

    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (err) {
      console.error(`Erreur commande ${commandName}:`, err);
      await message.reply('❌ Une erreur est survenue en exécutant cette commande.').catch(() => {});
    }
  },
};
