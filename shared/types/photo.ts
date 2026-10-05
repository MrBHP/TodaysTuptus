// Typy z folderu shared/ są auto-importowane i w app/, i w server/
export interface Photo {
  id: number
  filename: string
  url: string
}

export interface PaginatedPhotos {
  items: Photo[]
  total: number
  page: number
  pageSize: number
}
