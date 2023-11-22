import { type ClassValue, clsx } from "clsx"
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function capitalizeFirstLetter(string: string): string {
  const words = string.split(" ");

  const capitalize = words.map((word) => { 
      return word[0].toUpperCase() + word.substring(1); 
  }).join(" ");

  return capitalize
}


export const formatDate = (date: Date): string => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
};