import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Website and contract info
export const WEBSITE_URL = 'https://boomchainlabgravatar.link';
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Placeholder, update with real contract

// Utility function to combine Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to format large numbers
export function formatNumber(num: number | string, options: Intl.NumberFormatOptions = {}) {
  const parsedNum = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat('en-US', options).format(parsedNum);
}

// Utility function to truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Format address for display
export function formatAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}