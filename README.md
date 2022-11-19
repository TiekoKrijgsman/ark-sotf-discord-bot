# ark-sotf-discord-bot

Discord bot for [ARK: The Survival Of The Fittest Discord](https://discord.gg/playSOTF).

[Discord Documentation](https://discord.com/developers/applications)

## Prerequisites

- [Node.js](https://nodejs.org/) >= 16.0.0
- [npm](https://www.npmjs.com/) >= 8.0.0

### Installation

```sh
# Configure environment variables
cp .env.example .env

# Install
npm install
```

## Usage

```sh
# Register commands for `DISCORD_GUILD_ID` provided in `.env`
npm run discord:register-commands

# Run Discord bot
npm run build
npm run start
```
