const { PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { canModerate, hasPermission } = require('../utils/permissions');
const config = require('../config');

module.exports = {
  name: 'vcmove',
  aliases: ['move'],
  description: 'Déplacer un membre vers un salon vocal',
  async execute(message, args) {
    if (!hasPermission(message.member, PermissionFlagsBits.MoveMembers)) {
      return message.reply('❌ Permission `Move Members` requise.');
    }

    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[1]) ||
      message.guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildVoice && c.name.toLowerCase() === args.slice(1).join(' ').toLowerCase()
      );

    if (!target || !channel || channel.type !== ChannelType.GuildVoice) {
      return message.reply('Usage : `*vcmove @user #salon-vocal`');
    }

    if (!target.voice.channel) return message.reply('❌ Le membre n\'est pas en vocal.');

    const check = canModerate(message.member, target);
    if (!check.ok) return message.reply(`❌ ${check.reason}`);

    try {
      await target.voice.setChannel(channel, `Par ${message.author.tag}`);
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.info)
            .setDescription(`➡️ **${target.user.tag}** déplacé vers ${channel}.`),
        ],
      });
    } catch (err) {
      await message.reply(`❌ ${err.message}`);
    }
  },
};
