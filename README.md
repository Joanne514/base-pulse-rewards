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
