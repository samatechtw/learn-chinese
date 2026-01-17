export interface IMoeDictDefinition {
  f?: string
  type?: string
  e?: string[]
  q?: string[]
  l?: string[]
}

export interface IMoeDictHeteronym {
  p?: string
  b?: string
  d?: IMoeDictDefinition[]
}

export interface IMoeDictEntry {
  t: string
  r?: string
  c?: number
  h?: IMoeDictHeteronym[]
  translation?: Record<string, string[]>
}
