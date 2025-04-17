import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CONTRACT_ADDRESS = "<DEPLOYED_CONTRACT_ADDRESS>";
export const SOLANA_CONTRACT_ADDRESS = "DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump";
export const SOLANA_NETWORK = "mainnet-beta";
export const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";