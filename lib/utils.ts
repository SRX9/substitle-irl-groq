import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractLinksFromText(text: string) {
  const urlPattern =
    /((https?:\/\/)?([a-zA-Z0-9.-]+(\.[a-zA-Z]{2,6}))([^\s]*))/g;
  const links = text.match(urlPattern);
  return links || [];
}
