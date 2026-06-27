# Base Pulse Rewards

Base Pulse Rewards is a mobile-first Base mini app built with Next.js, TypeScript, the App Router, Wagmi, and Viem.

It is designed for a simple reward interaction on Base while keeping wallet connection flows lightweight and focused on injected wallets and Coinbase Wallet.

## Overview

This project provides a compact Base app experience with a tap-based reward flow.

Users can open the app, connect a supported wallet, and interact with the reward experience without relying on WalletConnect-first flows or additional wallet UI frameworks.

The app also includes Base attribution setup for both page-level attribution and onchain transaction attribution.

## Features

- Mobile-first interface for Base users.
- Instant local reward on the first tap, with no purchase required.
- Wallet connection support for injected wallets and Coinbase Wallet.
- Supports Base App embedded wallet, Coinbase Wallet, MetaMask, OKX, and other injected wallets.
- Avoids RainbowKit.
- Avoids WalletConnect project ID requirements.
- Avoids WalletConnect-first connection flows.
- Includes Base attribution metadata in the app layout.
- Centralizes onchain attribution configuration in the Wagmi setup.
- Built with Next.js App Router.
- Written in TypeScript.
- Uses Wagmi and Viem for wallet and chain interactions.

## Repository

Repository URL:

https://github.com/Joanne514/base-pulse-rewards.git

## Tech Stack

- Next.js
- TypeScript
- App Router
- Wagmi
- Viem
- Base

## Base Attribution Setup

Offchain attribution is configured in `app/layout.tsx`.

The app includes the following metadata tag in the document `<head>`:

```tsx
<meta name="base:app_id" content="6a212aad1bf1ab98bb37b997" />
```

This tag is included so page opens can appear in the base.dev Offchain dashboard after verification.

## Onchain Attribution

Onchain attribution is centralized in `lib/wagmi.ts`.

The current value is:

```ts
export const builderDataSuffix = '0x' as `0x${string}`;
```

After base.dev verification, replace `0x` with the encoded builder code.

Every current `writeContract` call passes the suffix explicitly:

```ts
dataSuffix: builderDataSuffix
```

Keeping the value centralized makes it easier to update attribution once verification is complete.

## Environment Variables

Create an environment file for local development and add the required values.

Example:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x04a25aAB96FF0C5E1E3be9a919950954fFE3CB27
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=
```

Use the appropriate chain ID for the target network:

```bash
8453
```

for Base Mainnet, or:

```bash
84532
```

for Base Sepolia.

## Setup

Clone the repository:

```bash
git clone https://github.com/Joanne514/base-pulse-rewards.git
```

Move into the project directory:

```bash
cd base-pulse-rewards
```

Install dependencies:

```bash
npm install
```

Add the environment variables listed above before running the app.

## Development

Start the local development server:

```bash
npm run dev
```

Then open the local Next.js development URL shown in your terminal.

## Build

Create a production build:

```bash
npm run build
```

## Lint

Run lint checks:

```bash
npm run lint
```

## Common Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```
