import { LAMPORTS_PER_SOL } from "@solana/web3.js";

// shorten the checksummed version of the input address to have 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function fromLamports(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

export function toLamports(amount: number): number {
  return amount * LAMPORTS_PER_SOL;
}

export function formatAmount(amount: number, power: number = 4) {
  const factor = Math.pow(10, power);
  return Math.round(amount * factor) / factor;
}
