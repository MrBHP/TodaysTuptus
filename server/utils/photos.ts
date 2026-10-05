import { resolve } from 'node:path'

export const PHOTO_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

// Formaty z iPhone'a: przy uploadzie konwertujemy je na JPG,
// bo poza Safari przeglądarki ich nie wyświetlą
export const HEIC_EXTENSIONS = ['heic', 'heif']

// Absolutna ścieżka do folderu photos/ w katalogu projektu
export function photosDir() {
  return resolve(process.cwd(), useRuntimeConfig().photosDir)
}

export function photoUrl(filename: string) {
  return `/photos/${encodeURIComponent(filename)}`
}
