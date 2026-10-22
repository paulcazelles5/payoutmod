# PayoutMod — Bot Discord de modération ultra-complet

Prefix : `*`

## 🔒 Système de Jail

1. `*jailsetup` — crée le rôle **Jailed** + salon `#jail`
2. `*jail @user [durée] [raison]` — retire tous les rôles, assigne Jail, isole dans `#jail`
3. `*unjail @user` — restaure les rôles
4. `*jails` — liste des prisonniers

Durée optionnelle : `*jail @user 2h Spam` — unjail auto à expiration.

## Commandes (aperçu)

### Modération
`ban` `softban` `tempban` `hackban` `unban` `kick`  
`timeout` `untimeout` `mute` `unmute`  
`warn` `warnings` `delwarn` `clearwarns`  
`jail` `unjail` `jailsetup` `jails`  
`note` `notes` `clearnotes`  
`purge` `nuke` `slowmode` `lock` `unlock` `hide` `unhide`  
`nick` `role` `addrole` `removerole` `modlogs`

### Vocal
`vckick` `vcmute` `vcunmute` `deafen` `undeafen` `vcmove`

### Utilitaires
`userinfo` `serverinfo` `roleinfo` `channelinfo`  
`avatar` `banner` `roles` `emojis` `membercount`  
`ping` `uptime` `invite` `snipe` `editsnipe` `firstmessage`  
`poll` `say` `embed` `announce` `steal`  
`createrole` `deleterole` `clone` `topic` `help`

`*help` ou `*help mod|voice|util|staff`

## Déploiement Railway

1. [railway.app](https://railway.app) → Deploy from GitHub → `payoutmod`
2. Variable : `DISCORD_TOKEN=...`
3. Optionnel : `MOD_LOG_CHANNEL_ID=...`
4. **Enable Sleeping = Off**

## Bot Discord — Intents à activer

- Server Members Intent
- Message Content Intent  
- (Presence Intent optionnel)

Permissions recommandées : Administrator (ou Kick, Ban, Moderate Members, Manage Messages/Channels/Roles/Nicknames, Move/Mute/Deafen Members, Manage Emojis).

**Place le rôle du bot tout en haut** (sous les admins).

## Structure

```
src/
  commands/     # 50+ commandes
  events/       # ready, messageCreate, messageDelete, messageUpdate
  utils/        # jail, warns, notes, snipe, modlog, storage
data/           # warns.json, jail.json, notes.json, tempbans.json (auto)
```
