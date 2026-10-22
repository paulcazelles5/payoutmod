const { EmbedBuilder } = require('discord.js');
const { getWarns } = require('../utils/warns');
const { isJailed, getJailData } = require('../utils/jail');
const { getNotes } = require('../utils/notes');
const config = require('../config');

module.exports = {
  name: 'userinfo',
  aliases: ['whois', 'ui', 'user'],
  description: 'Infos sur un membre',
  async execute(message, args) {
    const target =
      message.mentions.members.first() ||
      (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null) ||
      message.member;

    const roles = target.roles.cache
      .filter((r) => r.id !== message.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((r) => r.toString())
      .slice(0, 15);

    const warns = getWarns(message.guild.id, target.id);
    const notes = getNotes(message.guild.id, target.id);
    const jailed = isJailed(message.guild.id, target.id);
    const jailData = jailed ? getJailData(message.guild.id, target.id) : null;

    const embed = new EmbedBuilder()
      .setColor(target.displayHexColor === '#000000' ? config.colors.info : target.displayHexColor)
      .setAuthor({ name: target.user.tag, iconURL: target.user.displayAvatarURL() })
      .setThumbnail(target.user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: target.id, inline: true },
        { name: 'Bot', value: target.user.bot ? 'Oui' : 'Non', inline: true },
        { name: 'Compte créé', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'A rejoint', value: target.joinedTimestamp ? `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true },
        { name: 'Warns', value: String(warns.length), inline: true },
        { name: 'Notes staff', value: String(notes.length), inline: true },
        {
          name: 'Timeout',
          value: target.communicationDisabledUntil
            ? `Jusqu'à <t:${Math.floor(target.communicationDisabledUntilTimestamp / 1000)}:R>`
            : 'Non',
          inline: true,
        },
        {
          name: 'Jail',
          value: jailed
            ? `Oui — ${jailData.reason}${jailData.expiresAt ? ` (expire <t:${Math.floor(jailData.expiresAt / 1000)}:R>)` : ''}`
            : 'Non',
          inline: true,
        },
        {
          name: `Rôles [${target.roles.cache.size - 1}]`,
          value: roles.length ? roles.join(', ') : 'Aucun',
        }
      )
      .setFooter({ text: `Demandé par ${message.author.tag}` })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};
