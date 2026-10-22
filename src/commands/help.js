const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'help',
  aliases: ['aide', 'commands', 'cmds'],
  description: 'Liste des commandes',
  async execute(message, args) {
    const cat = (args[0] || '').toLowerCase();

    const categories = {
      mod: {
        title: '🔨 Modération',
        value: [
          '`*ban` `*softban` `*tempban` `*hackban` `*unban`',
          '`*kick` `*timeout` `*untimeout` `*mute` `*unmute`',
          '`*warn` `*warnings` `*delwarn` `*clearwarns`',
          '`*jail` `*unjail` `*jailsetup` `*jails`',
          '`*note` `*notes` `*clearnotes`',
          '`*purge` `*nuke` `*slowmode` `*lock` `*unlock`',
          '`*nick` `*role` `*modlogs`',
        ].join('\n'),
      },
      voice: {
        title: '🔊 Vocal',
        value: [
          '`*vckick` `*vcmute` `*vcunmute`',
          '`*deafen` `*undeafen` `*vcmove`',
          '`*disconnect` `*vcmuteall` `*vcunmuteall`',
        ].join('\n'),
      },
      util: {
        title: '🛠️ Utilitaires',
        value: [
          '`*userinfo` `*serverinfo` `*roleinfo` `*channelinfo`',
          '`*avatar` `*banner` `*roles` `*emojis`',
          '`*membercount` `*ping` `*uptime` `*invite`',
          '`*snipe` `*editsnipe` `*firstmessage`',
          '`*poll` `*say` `*embed` `*announce`',
        ].join('\n'),
      },
      staff: {
        title: '⚙️ Staff / Serveur',
        value: [
          '`*createrole` `*deleterole` `*addrole` `*removerole`',
          '`*createchannel` `*deletechannel`',
          '`*setmodlog` `*steal` `*clone`',
          '`*hide` `*unhide` `*topic`',
        ].join('\n'),
      },
    };

    if (cat && categories[cat]) {
      const c = categories[cat];
      const embed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle(c.title)
        .setDescription(c.value)
        .setFooter({ text: `Prefix : ${config.prefix}` });
      return message.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle('PayoutMod — Bot de modération complet')
      .setDescription(
        `Prefix : \`${config.prefix}\`\n\nUtilise \`*help <catégorie>\` pour le détail.\nCatégories : \`mod\` · \`voice\` · \`util\` · \`staff\``
      )
      .addFields(
        Object.values(categories).map((c) => ({
          name: c.title,
          value: c.value.length > 1024 ? c.value.slice(0, 1020) + '…' : c.value,
        }))
      )
      .setFooter({ text: `${message.client.commands.size} commandes chargées` });

    await message.reply({ embeds: [embed] });
  },
};
