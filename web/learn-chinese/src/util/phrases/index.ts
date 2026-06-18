export { phraseSections } from './phrases'

// True for CJK ideographs (the characters worth a dictionary lookup).
// Punctuation, spaces, and latin letters return false.
export const isLookupChar = (char: string): boolean => {
  return /\p{Script=Han}/u.test(char)
}
