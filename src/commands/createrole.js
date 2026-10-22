const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'createrole',
  aliases: ['makerole'],
  description: 'Créer un rôle',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.ManageRoles)) {
      return message.reply('❌ Permission `Manage Roles` requise.');
    }

    const name = args.join(' ');
    if (!name) return message.reply('Usage : `*createrole <nom>`');

    try {
      const role = await message.guild.roles.create({
        name,
        reason: `Par ${message.author.tag}`,
      });
      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(`✅ Rôle ${role} créé.`);
      await message.reply({ embeds: [embed] });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
