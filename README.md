# PackOdds

[Discord](https://discord.gg/K7WkGRjetM) · [GitHub](https://github.com/SebbeJohansson/tcgpriser-packs-demo)

A Pokémon TCG pack-opening simulator built with [Nuxt](https://nuxt.com). It pulls expansion, card, and pull-rate data from [tcgpriser.se](https://tcgpriser.se) and lets you crack digital packs using community-collected slot odds.

## API usage

Data is fetched server-side (`server/api/expansions.get.ts`) via the [`tcgpriser`](https://www.npmjs.com/package/tcgpriser) SDK, which wraps [api.tcgpriser.se](https://api.tcgpriser.se). Full API reference: [api.tcgpriser.se/docs](https://api.tcgpriser.se/docs).

Endpoints used:

- `GET /expansions` — list all expansions, filtered down to the ones with enough cards to simulate a pack.
- `GET /expansions/{technicalName}/products?grouped=true` — cards and sealed products for an expansion.
- `GET /pack-rates/{expansionId}` — community-collected pull-rate buckets used to weight the "hit" slot when opening a pack.

The response is cached for 30 minutes and reshaped into `CardGroup`s (`app/types/tcgpriser.ts`) that the rest of the app reads from `useTcgPriser()`.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
