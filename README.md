# ArcScope

ArcScope is a dark, responsive on-chain analysis interface running on Arc Testnet. Enter an EVM wallet or contract address to load live Arcscan/Blockscout and RPC data, normalized activity metrics, a Cytoscape connection map, node details, a transparent Wallet DNA estimate, balances, and recent transfers.

## Features

- Landing page with EVM address validation and example analysis
- Dynamic `/address/[address]` analysis route
- Interactive, directed Cytoscape graph with zoom, pan, fit, and node selection
- Wallet/contract/token/bridge visual distinctions
- Summary metrics, node inspector, Wallet DNA, and recent transaction table
- Live, typed API at `GET /api/address/[address]`
- Direct Arc RPC read for the canonical USDC balance with explorer fallback
- Two-hop, cached node expansion with graph deduplication
- Token balances and contract metadata
- Timeout, rate-limit, upstream, empty-address, loading, and validation states
- Five-minute CDN cache policy on address responses
- Responsive loading, error, and invalid-address states

## Stack

- Next.js App Router and strict TypeScript
- Tailwind CSS
- shadcn-compatible utilities (`class-variance-authority`, `clsx`, `tailwind-merge`)
- viem and Zod
- Cytoscape.js
- Framer Motion and Lucide React
- TanStack Query

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

```env
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_EXPLORER_URL=https://testnet.arcscan.app
ARC_EXPLORER_API_URL=https://testnet.arcscan.app/api/v2
BLOCKSCOUT_API_KEY=
NEXT_PUBLIC_USE_MOCK_DATA=false
```

Public URLs may be exposed to the browser. Keep `BLOCKSCOUT_API_KEY` server-only. Network defaults are centralized in `src/lib/arc/config.ts`; update them there or through environment variables instead of hard-coding endpoints in components.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```

## Architecture

```text
src/
  app/                  routes, route states, and address API
  components/
    address/            search, metrics, profile, transactions
    graph/              Cytoscape canvas and node inspector
    layout/             global navigation and identity
  lib/
    arc/                live clients, normalization, graph logic, fallback data
    validations/        Zod + viem validation
    utils/              presentation-safe formatters
  types/                normalized Arc and graph contracts
```

Blockchain response types and normalized view models do not leak into presentation concerns. The server route owns address validation and cache headers. Cytoscape layout work runs in a client component.

## Live and mock data

Live data is the default. Set `NEXT_PUBLIC_USE_MOCK_DATA=true` for deterministic development data when the explorer is unavailable. Any valid EVM address becomes the target node in mock mode.

Arc uses USDC as its native gas asset. ArcScope reads the canonical ERC-20 view at `0x3600000000000000000000000000000000000000` with 6 decimals. It never adds that amount to the 18-decimal native view, because both represent the same underlying balance.

## Vercel deployment

1. Push the project to a Git repository.
2. Import it into Vercel as a Next.js project.
3. Add the environment variables above.
4. Run the default `npm run build`.
5. Deploy.

The architecture is compatible with the Hobby plan: request-driven routes, no database, no worker, no persistent WebSocket, bounded graph data, and CDN-friendly address responses.

## Current limitations

- Each request intentionally analyzes at most 100 records per source and renders at most 40 nodes.
- Activity dates and relationship counts describe the bounded explorer window, while the transaction counter is the explorer’s full address counter.
- Serverless in-memory rate limiting is best-effort per Vercel instance; production-wide enforcement would require an external store.
- The public per-instance Blockscout API may eventually require migration to Blockscout’s multichain API.
- Wallet DNA is a behavior estimate, not an identity or compliance claim.

## Roadmap

1. Add pagination controls for deeper historical windows.
2. Add token-specific transfer filters and CSV exports.
3. Persist recent analyses and graph snapshots.
4. Add labeled bridge/DEX registries and richer contract decoding.
5. Add Playwright browser tests and production observability.
