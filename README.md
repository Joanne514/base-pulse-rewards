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
