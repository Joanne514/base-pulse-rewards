'use client';

import { CheckCircle2, ChevronDown, CirclePlus, Coins, Gift, Loader2, LogOut, Sparkles, Trophy, Vote } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContract,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { basePollAbi, contractAddress, isContractConfigured, Poll } from '@/lib/contract';
import { builderDataSuffix, targetChain } from '@/lib/wagmi';
import { percent, remainingTime, shortAddress } from '@/lib/utils';

const rewardKey = 'base-pulse-reward-state';

type PollWithId = Poll & { id: bigint };
type RewardState = {
  points: number;
  streak: number;
  claimedAt: string;
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [reward, setReward] = useState<RewardState>({ points: 0, streak: 0, claimedAt: '' });
  const [rewardNotice, setRewardNotice] = useState('Tap once to reveal your first reward.');
  const wrongNetwork = isConnected && chainId !== targetChain.id;

  useEffect(() => {
    const saved = window.localStorage.getItem(rewardKey);
    if (!saved) return;

    try {
      setReward(JSON.parse(saved) as RewardState);
    } catch {
      window.localStorage.removeItem(rewardKey);
    }
  }, []);

  const pollCountQuery = useReadContract({
    address: contractAddress,
    abi: basePollAbi,
    functionName: 'pollCount',
    query: {
      enabled: isContractConfigured,
      refetchInterval: 12_000,
    },
  });

  const pollIds = useMemo(() => {
    const count = pollCountQuery.data ?? 0n;
    return Array.from({ length: Math.min(Number(count), 6) }, (_, index) => count - BigInt(index)).filter((id) => id > 0n);
  }, [pollCountQuery.data]);

  const pollsQuery = useReadContracts({
    contracts: pollIds.map((pollId) => ({
      address: contractAddress,
      abi: basePollAbi,
      functionName: 'getPoll',
      args: [pollId],
    })),
    query: {
      enabled: isContractConfigured && pollIds.length > 0,
      refetchInterval: 12_000,
    },
  });

  const polls = useMemo<PollWithId[]>(() => {
    return (
      pollsQuery.data
        ?.map((result, index) => {
          if (result.status !== 'success') return null;
          return { ...(result.result as unknown as Poll), id: pollIds[index] };
        })
        .filter((poll): poll is PollWithId => Boolean(poll)) ?? []
    );
  }, [pollIds, pollsQuery.data]);

  const activePoll = polls.find((poll) => Number(poll.endTime) > Math.floor(Date.now() / 1000));

  function claimReward() {
    const today = new Date().toISOString().slice(0, 10);
    const alreadyClaimedToday = reward.claimedAt === today;
    const nextReward = {
      points: reward.points + (alreadyClaimedToday ? 5 : 25),
      streak: alreadyClaimedToday ? reward.streak : reward.streak + 1,
      claimedAt: today,
    };

    setReward(nextReward);
    window.localStorage.setItem(rewardKey, JSON.stringify(nextReward));
    setRewardNotice(alreadyClaimedToday ? '+5 bonus points added instantly.' : '+25 points claimed instantly.');
  }

  return (
    <main className="min-h-screen px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-5">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400 text-stone-950">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">Base Pulse Rewards</p>
              <p className="text-xs font-medium text-stone-500">Daily rewards and community signals</p>
            </div>
          </div>
          <WalletButton />
        </header>

        <section className="app-card overflow-hidden">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div className="grid gap-5">
              <span className="pill w-fit">Zero-cost start</span>
              <div className="grid gap-3">
                <h1 className="text-4xl font-black leading-tight text-stone-950 sm:text-5xl">Claim your first Base boost.</h1>
                <p className="max-w-xl text-base leading-7 text-stone-600">
                  Earn instant points before spending gas, then connect a wallet when you want your community signal recorded on Base.
                </p>
              </div>
              <button className="primary-button max-w-sm" onClick={claimReward} type="button">
                <Gift size={18} />
                Claim Instant Boost
              </button>
              <p className="text-sm font-medium text-amber-800">{rewardNotice}</p>
            </div>

            <div className="grid gap-3 rounded-lg border border-amber-200 bg-[#fff1d7] p-4">
              <Metric icon={<Coins size={18} />} label="Reward points" value={reward.points.toString()} />
              <Metric icon={<Trophy size={18} />} label="Claim streak" value={`${reward.streak} day${reward.streak === 1 ? '' : 's'}`} />
              <Metric icon={<CheckCircle2 size={18} />} label="Wallet" value={address ? shortAddress(address) : 'Optional'} />
            </div>
          </div>
        </section>

        {wrongNetwork ? (
          <button className="secondary-button" onClick={() => switchChain({ chainId: targetChain.id })} type="button">
            Switch to {targetChain.name}
          </button>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="app-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-stone-950">Instant Reward</h2>
                <p className="mt-1 text-sm text-stone-500">Visible on the first tap.</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                <Gift size={19} />
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-stone-50 p-4">
              <div className="text-sm font-medium text-stone-500">Next action</div>
              <div className="mt-2 text-2xl font-black text-stone-950">{reward.claimedAt ? 'Keep your boost active' : 'Claim your first boost'}</div>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Points appear immediately on the first tap, so new users can participate before spending gas or buying tokens.
              </p>
            </div>
          </div>

          <div className="app-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-stone-950">Onchain Signal</h2>
                <p className="mt-1 text-sm text-stone-500">Vote on a live Base poll with your wallet.</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-blue-700">
                <Vote size={19} />
              </div>
            </div>

            <div className="mt-5">
              {!isContractConfigured ? (
                <StatusBox text="Contract address is not configured yet. Set NEXT_PUBLIC_CONTRACT_ADDRESS after deployment." />
              ) : activePoll ? (
                <div className="grid gap-5">
                  <PollCard poll={activePoll} onRefresh={() => void pollsQuery.refetch()} />
                  <CreatePollButton
                    onRefresh={() => {
                      void pollCountQuery.refetch();
                      void pollsQuery.refetch();
                    }}
                  />
                </div>
              ) : (
                <div className="grid gap-4">
                  <StatusBox text="No active poll is available right now. Create one on Base or wait for a new poll to appear." />
                  <CreatePollButton
                    onRefresh={() => {
                      void pollCountQuery.refetch();
                      void pollsQuery.refetch();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="app-card grid gap-4 p-5 sm:grid-cols-3">
          <Metric label="Network" value={targetChain.name} />
          <Metric label="Total polls" value={pollCountQuery.data?.toString() ?? '0'} />
          <Metric label="Attribution" value={builderDataSuffix === '0x' ? 'Builder code pending' : 'Enabled'} />
        </section>
      </div>
    </main>
  );
}

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const [autoTried, setAutoTried] = useState(false);

  useEffect(() => {
    const agent = window.navigator.userAgent;
    const ethereum = window.ethereum as { isCoinbaseWallet?: boolean; providers?: Array<{ isCoinbaseWallet?: boolean }> } | undefined;
    const hasCoinbaseProvider = Boolean(ethereum?.isCoinbaseWallet || ethereum?.providers?.some((provider) => provider.isCoinbaseWallet));
    const isBaseApp = /\b(Base|CoinbaseWallet)\b/i.test(agent) && hasCoinbaseProvider;
    const injectedConnector = connectors.find((connector) => connector.type === 'injected');

    if (!autoTried && !isConnected && isBaseApp && injectedConnector) {
      setAutoTried(true);
      connect({ connector: injectedConnector, chainId: targetChain.id });
    }
  }, [autoTried, connect, connectors, isConnected]);

  return (
    <div className="relative">
      <button className="secondary-button min-w-0 px-3 sm:px-4" onClick={() => setOpen((value) => !value)} type="button">
        {isPending ? <Loader2 className="animate-spin" size={16} /> : <ChevronDown size={16} />}
        <span className="hidden sm:inline">{isConnected ? shortAddress(address) : 'Connect Wallet'}</span>
        <span className="sm:hidden">{isConnected ? 'Wallet' : 'Connect'}</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-stone-200 bg-white p-2 shadow-soft">
          {connectors.map((connector) => (
            <button
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-stone-800 hover:bg-amber-50"
              key={connector.uid}
              onClick={() => {
                connect({ connector, chainId: targetChain.id });
                setOpen(false);
              }}
              type="button"
            >
              {connector.name}
              <span className="text-xs text-stone-400">{connector.type}</span>
            </button>
          ))}
          {isConnected ? (
            <button
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
              type="button"
            >
              <LogOut size={15} />
              Disconnect
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CreatePollButton({ onRefresh }: { onRefresh: () => void }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const wrongNetwork = isConnected && chainId !== targetChain.id;
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const [notice, setNotice] = useState('');
  const disabled = receipt.isLoading || isPending;

  useEffect(() => {
    if (receipt.isSuccess) {
      setNotice('Poll created on Base.');
      onRefresh();
    }
  }, [onRefresh, receipt.isSuccess]);

  useEffect(() => {
    if (error) setNotice(error.message.includes('User rejected') ? 'Transaction rejected.' : 'Poll creation failed.');
  }, [error]);

  function createPoll() {
    if (!isConnected) return setNotice('Connect a wallet first.');
    if (wrongNetwork) return setNotice(`Switch to ${targetChain.name}.`);

    setNotice('Confirm the contract transaction in your wallet.');
    writeContract({
      address: contractAddress,
      abi: basePollAbi,
      functionName: 'createPoll',
      args: ['Which Base reward should come next?', 'More daily boosts', 'More onchain polls', 86_400n],
      dataSuffix: builderDataSuffix,
    });
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <button className="primary-button" disabled={disabled} onClick={createPoll} type="button">
        {disabled ? <Loader2 className="animate-spin" size={18} /> : <CirclePlus size={18} />}
        Create Onchain Poll
      </button>
      <p className="mt-3 text-sm font-medium leading-6 text-amber-900">
        {notice || 'This button writes to the BasePoll contract and opens a 24-hour community vote.'}
      </p>
    </div>
  );
}

function PollCard({ onRefresh, poll }: { onRefresh: () => void; poll: PollWithId }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const wrongNetwork = isConnected && chainId !== targetChain.id;
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const [notice, setNotice] = useState('');

  const hasVotedQuery = useReadContract({
    address: contractAddress,
    abi: basePollAbi,
    functionName: 'hasUserVoted',
    args: [poll.id, address ?? '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: Boolean(address) && isContractConfigured,
      refetchInterval: 12_000,
    },
  });

  useEffect(() => {
    if (receipt.isSuccess) {
      setNotice('Vote recorded on Base.');
      void hasVotedQuery.refetch();
      onRefresh();
    }
  }, [hasVotedQuery, onRefresh, receipt.isSuccess]);

  useEffect(() => {
    if (error) setNotice(error.message.includes('User rejected') ? 'Transaction rejected.' : 'Vote failed.');
  }, [error]);

  const total = poll.voteA + poll.voteB;
  const hasVoted = Boolean(hasVotedQuery.data);

  function vote(choice: 1 | 2) {
    if (!isConnected) return setNotice('Connect a wallet first.');
    if (wrongNetwork) return setNotice(`Switch to ${targetChain.name}.`);
    if (hasVoted) return setNotice('This wallet already voted.');

    setNotice('');
    writeContract({
      address: contractAddress,
      abi: basePollAbi,
      functionName: 'vote',
      args: [poll.id, choice],
      dataSuffix: builderDataSuffix,
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="pill">Poll #{poll.id.toString()}</span>
        <span className="text-xs font-semibold text-stone-500">{remainingTime(poll.endTime)}</span>
      </div>
      <h3 className="mt-4 text-lg font-black leading-7 text-stone-950">{poll.question}</h3>
      <div className="mt-4 grid gap-3">
        <OptionBar label={poll.optionA} percentValue={percent(poll.voteA, total)} votes={poll.voteA} />
        <OptionBar label={poll.optionB} percentValue={percent(poll.voteB, total)} votes={poll.voteB} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button className="secondary-button" disabled={hasVoted || receipt.isLoading || isPending} onClick={() => vote(1)} type="button">
          Vote A
        </button>
        <button className="secondary-button" disabled={hasVoted || receipt.isLoading || isPending} onClick={() => vote(2)} type="button">
          Vote B
        </button>
      </div>
      <p className="mt-3 text-sm font-medium text-stone-500">{notice || (hasVoted ? 'Your wallet has voted.' : 'Wallet voting is optional and onchain.')}</p>
    </div>
  );
}

function OptionBar({ label, percentValue, votes }: { label: string; percentValue: number; votes: bigint }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 break-words font-semibold text-stone-800">{label}</span>
        <span className="shrink-0 text-stone-500">{votes.toString()} votes</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-amber-400" style={{ width: `${percentValue}%` }} />
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-stone-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 break-words text-2xl font-black text-stone-950">{value}</div>
    </div>
  );
}

function StatusBox({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-5 text-sm font-medium leading-6 text-stone-600">{text}</div>;
}
