const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'help',
  aliases: ['aide', 'commands'],
  description: 'Liste des commandes de modération',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor(config.colors.info)
      .setTitle('PayoutMod — Commandes')
      .setDescription(`Prefix : \`${config.prefix}\``)
      .addFields(
        {
          name: 'Modération',
          value: [
            '`*ban @user [raison] [jours]` — Bannir',
            '`*unban <id> [raison]` — Débannir',
            '`*kick @user [raison]` — Expulser',
            '`*timeout @user <durée> [raison]` — Timeout (10m, 1h, 1d...)',
            '`*untimeout @user [raison]` — Retirer timeout',
            '`*mute / *unmute` — Alias timeout',
            '`*warn @user [raison]` — Avertir',
            '`*warnings @user` — Voir les warns',
            '`*clearwarns @user` — Effacer les warns',
          ].join('\n'),
        },
        {
          name: 'Salon & Messages',
          value: [
            '`*purge <n> [@user]` — Supprimer des messages (1-100)',
            '`*slowmode <secondes>` — Slowmode (0 = off)',
            '`*lock [raison]` / `*unlock` — Verrouiller le salon',
          ].join('\n'),
        },
        {
          name: 'Utilitaires',
          value: [
            '`*nick @user [pseudo]` — Changer le pseudo',
            '`*role add|remove @user @role` — Gérer un rôle',
            '`*modlogs @user` — Historique',
            '`*help` — Cette aide',
          ].join('\n'),
        }
      )
      .setFooter({ text: 'Place le rôle du bot au-dessus des membres à modérer' });

    await message.reply({ embeds: [embed] });
  },
};
