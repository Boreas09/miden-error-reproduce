import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a balance value from bigint to a readable number string
 * @param balance - The balance as a bigint (e.g., 200000000n)
 * @param decimals - Number of decimal places (default: 6)
 * @returns The formatted balance as a string (e.g., "200")
 */
export const formatBalance = (balance: bigint, decimals: number = 6): string => {
  if (balance === BigInt(0)) {
    return '0';
  }

  const divisor = BigInt(Math.pow(10, decimals));
  const wholePart = balance / divisor;
  const fractionalPart = balance % divisor;

  if (fractionalPart === BigInt(0)) {
    return wholePart.toString();
  }

  // Format with appropriate decimal places, limit to 3 chars
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '').substring(0, 3);

  if (trimmedFractional === '') {
    return wholePart.toString();
  }

  return `${wholePart}.${trimmedFractional}`;
};
