import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Shared CSS class constants for consistent styling across components
 */
export const INPUT_CLASS =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm";

export const CARD_CLASS = "rounded-md border bg-white shadow-sm";

export const TABLE_HEADER_CLASS =
  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500";

/**
 * Medical specialties used across the app for directory profiles and matching
 */
export const MEDICAL_SPECIALTIES = [
  "Family Medicine",
  "Internal Medicine",
  "Psychiatry",
  "Pediatrics",
  "Emergency Medicine",
  "Urgent Care",
  "Cardiology",
  "Dermatology",
  "Oncology",
  "Other",
] as const;

export type MedicalSpecialty = typeof MEDICAL_SPECIALTIES[number];
