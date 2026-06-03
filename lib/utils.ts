export function shortAddress(address?: string) {
  if (!address) return 'Not connected';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function percent(part: bigint, total: bigint) {
  if (total === 0n) return 0;
  return Math.round((Number(part) / Number(total)) * 100);
}

export function remainingTime(endTime: bigint) {
  const seconds = Number(endTime) - Math.floor(Date.now() / 1000);

  if (seconds <= 0) return 'Ended';

  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${Math.max(minutes, 1)}m left`;
}
