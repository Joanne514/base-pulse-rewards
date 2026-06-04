import { getAddress, zeroAddress } from 'viem';

export const basePollAbi = [
  {
    type: 'function',
    name: 'createPoll',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'optionA', type: 'string' },
      { name: 'optionB', type: 'string' },
      { name: 'duration', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'vote',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'pollId', type: 'uint256' },
      { name: 'choice', type: 'uint8' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'pollCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getPoll',
    stateMutability: 'view',
    inputs: [{ name: 'pollId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'creator', type: 'address' },
          { name: 'question', type: 'string' },
          { name: 'optionA', type: 'string' },
          { name: 'optionB', type: 'string' },
          { name: 'voteA', type: 'uint256' },
          { name: 'voteB', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'hasUserVoted',
    stateMutability: 'view',
    inputs: [
      { name: 'pollId', type: 'uint256' },
      { name: 'user', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getUserChoice',
    stateMutability: 'view',
    inputs: [
      { name: 'pollId', type: 'uint256' },
      { name: 'user', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

export type Poll = {
  creator: `0x${string}`;
  question: string;
  optionA: string;
  optionB: string;
  voteA: bigint;
  voteB: bigint;
  startTime: bigint;
  endTime: bigint;
  exists: boolean;
};

const defaultContractAddress = '0x04a25aAB96FF0C5E1E3be9a919950954fFE3CB27';
const configuredAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || defaultContractAddress;

export const contractAddress =
  configuredAddress && configuredAddress !== zeroAddress ? getAddress(configuredAddress) : zeroAddress;

export const isContractConfigured = contractAddress !== zeroAddress;
