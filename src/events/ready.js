module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    console.log(`📊 Présent sur ${client.guilds.cache.size} serveur(s)`);
    client.user.setActivity('*help | Modération', { type: 3 }); // Watching
  },
};
