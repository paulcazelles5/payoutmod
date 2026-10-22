# PayoutMod - Bot Discord de Modération

Bot de modération complet pour Discord avec le prefix `*`.

## Fonctionnalités

### Commandes de modération
| Commande | Description |
|----------|-------------|
| `*ban @user [raison] [jours]` | Bannir un membre (supprime les messages des X derniers jours, max 7) |
| `*unban <id> [raison]` | Débannir un utilisateur |
| `*kick @user [raison]` | Expulser un membre |
| `*timeout @user <durée> [raison]` | Timeout (ex: 10m, 1h, 1d, max 28j) |
| `*untimeout @user [raison]` | Retirer le timeout |
| `*mute @user <durée> [raison]` | Alias de timeout |
| `*unmute @user [raison]` | Alias de untimeout |
| `*warn @user [raison]` | Avertir un membre |
| `*warnings @user` | Voir les warns d'un membre |
| `*clearwarns @user` | Supprimer tous les warns |
| `*purge <nombre> [@user]` | Supprimer des messages (1-100) |
| `*clear <nombre> [@user]` | Alias de purge |
| `*slowmode <secondes>` | Activer le slowmode (0 pour désactiver) |
| `*lock [raison]` | Verrouiller le salon |
| `*unlock [raison]` | Déverrouiller le salon |
| `*nick @user [nouveau_pseudo]` | Changer le pseudo (vide = reset) |
| `*role add/remove @user @role` | Ajouter/retirer un rôle |
| `*modlogs @user` | Historique de modération |
| `*help` | Liste des commandes |

### Auto-modération basique
- Détection de spam (5 messages en 5s → timeout 1 min)
- Filtre de mots interdits (configurable dans `src/config.js`)
- Blocage des invitations Discord (optionnel)

## Installation locale

1. Clone le repo
2. `npm install`
3. Copie `.env.example` en `.env` et mets ton `DISCORD_TOKEN`
4. `npm start`

## Permissions requises pour le bot

- Kick Members
- Ban Members
- Moderate Members (timeout)
- Manage Messages
- Manage Channels
- Manage Nicknames
- Manage Roles
- View Audit Log
- Send Messages / Embed Links

**Important** : Place le rôle du bot **au-dessus** des rôles qu'il doit modérer.

## Déploiement sur Railway

1. Va sur [railway.app](https://railway.app) et connecte ton compte GitHub
2. **New Project** → **Deploy from GitHub repo** → sélectionne `payoutmod`
3. Dans **Variables**, ajoute :
   ```
   DISCORD_TOKEN=ton_token_bot
   ```
4. (Optionnel) Ajoute `MOD_LOG_CHANNEL_ID=id_du_channel_logs`
5. Railway détecte automatiquement Node.js et lance `npm start`
6. Désactive le sleep (Settings → Enable Sleeping = Off) pour que le bot reste connecté

### Créer le bot Discord

1. [Discord Developer Portal](https://discord.com/developers/applications) → New Application
2. Onglet **Bot** → Add Bot → Reset Token → copie le token
3. Active les **Privileged Gateway Intents** :
   - Server Members Intent
   - Message Content Intent
4. Onglet **OAuth2 → URL Generator** :
   - Scopes : `bot`
   - Permissions : celles listées plus haut
5. Ouvre le lien généré et invite le bot sur ton serveur

## Structure du projet

```
src/
  index.js          # Point d'entrée
  config.js         # Configuration (prefix, mots interdits...)
  commands/         # Toutes les commandes
  events/           # Events (ready, messageCreate...)
  utils/            # Helpers (permissions, logs, warns)
data/               # Stockage local des warns (créé auto)
```

## Notes

- Les warns sont stockés dans `data/warns.json` (persistant tant que le volume Railway n'est pas effacé).
- Pour une persistance plus robuste en production, tu pourras plus tard brancher une base (SQLite / Postgres).
