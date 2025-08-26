import { clsx, type ClassValue } from "clsx";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
