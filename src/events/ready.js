module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    console.log(`📊 ${client.guilds.cache.size} serveur(s) | ${client.commands.size} commandes`);
    client.user.setActivity('*help | Modération complète', { type: 3 });
  },
};
