import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fetcher utility for SWR
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
