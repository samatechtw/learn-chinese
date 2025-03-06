import { ICharacterInfo } from '@frontend/types'
import { hsk1 } from '@frontend/util/characters'

interface IGeneratedInfo {
  char: string
  pinyin: string
  zhuyin: string
}

interface IDefinition {
  def: string
  type: string
  quote?: string[]
  example?: string[]
  link?: string[]
}

interface IHeteronym {
  bopomofo: string
  bopomofo2: string
  definitions: IDefinition[]
  pinyin: string
}

interface IMoeResponse {
  heteronyms: IHeteronym[]
  non_radical_stroke_count: number
  radical: string
  stroke_count: number
  title: string
}

const moeApi = 'https://www.moedict.tw/uni'

type ICharacterInfoEntries = [string, ICharacterInfo][]

async function getData(url: string, method = 'GET') {
  try {
    const response = await fetch(url, { method })
    if (!response.ok) {
      return response.status
    }
    return response.json()
  } catch (error) {
    console.error(error)
    return -1
  }
}

// Gets zhuyin from MOE heteronyms and strips non-zhuyin characters
const getZhuyin = (res: IMoeResponse, pinyin: string): string => {
  let het = res.heteronyms.find((h) => h.pinyin === pinyin) ?? res.heteronyms[0]
  if (!het.bopomofo) {
    console.log('Missing het', pinyin, JSON.stringify(res.heteronyms, null, 2))
    het = res.heteronyms.find((h) => !!h.bopomofo) as IHeteronym
  }
  return het.bopomofo.replace(/ *（[^)）]*） */g, '')
}

async function tryGetInfo(
  char: string,
  pinyin: string,
): Promise<IGeneratedInfo | undefined> {
  const res = await getData(`${moeApi}/${char}`)
  if (typeof res !== 'number') {
    return { char, pinyin, zhuyin: getZhuyin(res as IMoeResponse, pinyin) }
  }
  if (char.length <= 1) {
    return undefined
  }
  const aggregate: IGeneratedInfo = { char, pinyin, zhuyin: '' }
  for (const c of char) {
    const res = await getData(`${moeApi}/${c}`)
    if (typeof res === 'number') {
      console.log('Failed to get: ', c)
    } else {
      console.log('zy', getZhuyin(res as IMoeResponse, pinyin))
      aggregate.zhuyin += `${getZhuyin(res as IMoeResponse, pinyin)} `
    }
  }
  aggregate.zhuyin = aggregate.zhuyin.trim()
  return aggregate
}

const infoFromCharacters = async (
  entries: ICharacterInfoEntries,
): Promise<IGeneratedInfo[]> => {
  const info: IGeneratedInfo[] = []
  for (const [char, data] of entries) {
    const charInfo = await tryGetInfo(char, data.p)
    if (charInfo) {
      info.push(charInfo)
    } else {
      console.log('No info for: ', char)
    }
  }
  return info
}

const printInfo = (info: IGeneratedInfo[]) => {
  for (const data of info) {
    console.log(`${data.char}: info('${data.pinyin}', '${data.zhuyin}'),`)
  }
}

const go = async () => {
  const entries = Object.entries(hsk1) as ICharacterInfoEntries
  // const entries = [['什麼', hsk1['什麼']]] as ICharacterInfoEntries
  const info = await infoFromCharacters(entries)
  printInfo(info)
}

go()
