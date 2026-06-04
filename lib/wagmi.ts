import { coinbaseWallet, injected } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

const selectedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || base.id);

export const targetChain = selectedChainId === base.id ? base : baseSepolia;

// ERC-8021 builder code data suffix from base.dev: bc_3l1r9gdx.
export const builderDataSuffix = '0x62635f336c3172396764780b0080218021802180218021802180218021' as `0x${string}`;

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: 'Base Pulse Rewards',
      preference: 'all',
    }),
  ],
  dataSuffix: builderDataSuffix,
  multiInjectedProviderDiscovery: true,
  ssr: true,
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
  },
});
