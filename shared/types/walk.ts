// Dane z formularza "Umów się na spacer" (tabela walk_form)
export interface WalkFormInput {
  name: string
  email: string
  arguments: string
  not_guys: boolean
}

export interface WalkRequest extends WalkFormInput {
  id: number
  created_at: string
}
