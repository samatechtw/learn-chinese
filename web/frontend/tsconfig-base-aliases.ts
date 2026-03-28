import path from 'path'
import ts from 'typescript'

const parseTsconfig = (tsconfigPath: string): ts.ParsedCommandLine | undefined => {
  const parsed = ts.getParsedCommandLineOfConfigFile(tsconfigPath, {}, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: () => undefined,
  })

  return parsed ?? undefined
}

export const tsconfigBaseAliases = (
  fromPath: string,
  configName = 'tsconfig.json',
): Record<string, string> => {
  const tsconfigPath = path.resolve(fromPath, configName)
  const parsed = parseTsconfig(tsconfigPath)

  if (!parsed) {
    return {}
  }

  const baseUrl = parsed.options.baseUrl ?? path.dirname(tsconfigPath)
  const paths = parsed.options.paths ?? {}
  const aliases: Record<string, string> = {}

  for (const [name, targets] of Object.entries(paths)) {
    const target = targets[0]
    if (!target) {
      continue
    }

    if (name.endsWith('/*')) {
      aliases[name.slice(0, -1)] = `${path.resolve(baseUrl, target.slice(0, -1))}/`
      continue
    }

    aliases[name] = path.resolve(baseUrl, target)
  }

  return aliases
}
