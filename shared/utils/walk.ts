// Walidacja wspólna dla formularza (app/) i API (server/).
// Zwraca błędy w formie { pole: 'komunikat' }; pusty obiekt = wszystko OK.
export const WALK_LIMITS = { name: 100, email: 200, arguments: 2000 }

export function validateWalkForm(input: Partial<WalkFormInput>) {
  const errors: Partial<Record<keyof WalkFormInput, string>> = {}
  const name = input.name?.trim() ?? ''
  const email = input.email?.trim() ?? ''
  const args = input.arguments?.trim() ?? ''

  if (!name) errors.name = 'Podaj imię'
  else if (name.length > WALK_LIMITS.name) errors.name = 'Za długie imię'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Podaj poprawny e-mail'
  else if (email.length > WALK_LIMITS.email) errors.email = 'Za długi e-mail'

  if (!args) errors.arguments = 'Przekonaj Tuptusia 🐾'
  else if (args.length > WALK_LIMITS.arguments) errors.arguments = `Maksymalnie ${WALK_LIMITS.arguments} znaków`

  // if (!input.not_guys) errors.not_guys = 'Zaznacz, żeby wysłać'

  return errors
}
