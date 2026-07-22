# Family War

A fast, voice-hosted family survey game made for phones, tablets, and PC. Players reveal popular answers, survive three strikes, steal round banks, and finish with a 30-second Championship Rush.

## Highlights

- Responsive blue game-show UI with a no-scroll mobile game board
- Three escalating survey rounds with strikes, steals, and fuzzy answer matching
- CPU and same-screen family modes with Easy, Medium, and Hard tuning
- Private cross-device lobbies with durable Cloudflare D1 state and short party codes
- Spoken questions, replayable host audio, and Web Audio sound effects
- Five-question Championship Rush bonus round
- Installable mobile web-app manifest and branded social sharing card

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm test
```

The test command creates the Cloudflare-compatible production build, runs the game-engine checks, and verifies the rendered product shell, private-lobby contract, and mobile visibility contract.

## Production

The project uses vinext and is published through Cloudflare Sites and the Fantom Zone Cloudflare Worker route. Hosting identity is stored in `.openai/hosting.json`, while `wrangler.jsonc` owns the public `family-war.fantomzone.app/*` route so it takes priority over Fantom Zone's fallback game. Private lobbies persist in the `family-war-lobbies` D1 database through the `DB` binding.

```bash
npm run deploy:cloudflare
```
