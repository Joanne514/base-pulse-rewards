# Base Pulse Rewards

A mobile-first Base mini app built with Next.js, TypeScript, App Router, Wagmi, and Viem.

## What it does

- Gives users an instant local reward on the first tap, with no token purchase required.
- Lets users connect with injected wallets or Coinbase Wallet only.
- Supports Base App embedded wallet, Coinbase Wallet, MetaMask, OKX, and other injected wallets.
- Avoids RainbowKit, WalletConnect project IDs, and WalletConnect-first connection flows.
- Reserves Base attribution points for both offchain and onchain reporting.

## Base attribution setup

Offchain attribution is hardcoded in `app/layout.tsx`:

```tsx
<meta name="base:app_id" content="6a212aad1bf1ab98bb37b997" />
```

This tag is hardcoded in the document `<head>` so page opens can appear in the base.dev Offchain dashboard after verification.

Onchain attribution is centralized in `lib/wagmi.ts`:

```ts
export const builderDataSuffix = '0x' as `0x${string}`;
```

After base.dev verification, replace `0x` with the encoded builder code. Every current `writeContract` call passes `dataSuffix: builderDataSuffix` explicitly.

## Environment variables

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x04a25aAB96FF0C5E1E3be9a919950954fFE3CB27
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=
```

Use `8453` for Base Mainnet or `84532` for Base Sepolia.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Deploy

Deploy as a standard Next.js app on Vercel. Add the environment variables above in Vercel before the production build.
