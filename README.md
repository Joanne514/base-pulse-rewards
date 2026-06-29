# Base Pulse Rewards

Base Pulse Rewards is a mobile-first Base mini app built with Next.js, TypeScript, the App Router, Wagmi, and Viem.

The app provides a lightweight reward experience for Base users with a simple tap-based interaction and focused wallet connection flow.

## Overview

Base Pulse Rewards is designed to keep the user experience compact, fast, and easy to access on mobile devices.

Users can open the app, connect a supported wallet, and interact with the reward flow without relying on WalletConnect-first flows or additional wallet UI frameworks.

The project also includes Base attribution setup for both page-level attribution and onchain transaction attribution.

## Features

- Mobile-first interface for Base users.
- Simple tap-based reward experience.
- Instant local reward on the first tap, with no purchase required.
- Wallet connection support for injected wallets and Coinbase Wallet.
- Supports Base App embedded wallet, Coinbase Wallet, MetaMask, OKX, and other injected wallets.
- No RainbowKit dependency.
- No WalletConnect project ID requirement for the current connection flow.
- No WalletConnect-first connection flow.
- Base attribution metadata included in the app layout.
- Centralized onchain attribution configuration in the Wagmi setup.
- Built with the Next.js App Router.
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

## Base Attribution

Page-level attribution is configured in `app/layout.tsx`.

The app includes the following metadata tag in the document `<head>`:

```tsx
<meta name="base:app_id" content="6a212aad1bf1ab98bb37b997" />
```

This metadata is included so page opens can appear in the base.dev Offchain dashboard after verification.

## Onchain Attribution

Onchain attribution is centralized in `lib/wagmi.ts`.

The current value is:

```ts
export const builderDataSuffix = '0x' as `0x${string}`;
```

After base.dev verification, replace `0x` with the encoded builder code.

Current `writeContract` calls pass the suffix explicitly:

```ts
dataSuffix: builderDataSuffix
```

Keeping this value in one place makes attribution easier to update after verification is complete.

## Environment Variables

Create an environment file for local development and add the required values.
