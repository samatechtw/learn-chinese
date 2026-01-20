export interface IVietnameseVocabEntry {
  v: string
  e: string
}

// Vocabulary based on the Pinhok Vietnamese Top 100 Words list.
export const vietnameseBasicVocab: IVietnameseVocabEntry[] = [
  { v: 'tôi', e: 'I' },
  { v: 'bạn', e: 'you (singular)' },
  { v: 'anh ấy', e: 'he' },
  { v: 'cô ấy', e: 'she' },
  { v: 'nó', e: 'it' },
  { v: 'chúng tôi', e: 'we' },
  { v: 'các bạn', e: 'you (plural)' },
  { v: 'họ', e: 'they' },
  { v: 'cái gì', e: 'what' },
  { v: 'ai', e: 'who' },
  { v: 'ở đâu', e: 'where' },
  { v: 'tại sao', e: 'why' },
  { v: 'làm sao', e: 'how' },
  { v: 'cái nào', e: 'which' },
  { v: 'lúc nào', e: 'when' },
  { v: 'sau đó', e: 'then' },
  { v: 'nếu', e: 'if' },
  { v: 'thật sự', e: 'really' },
  { v: 'nhưng', e: 'but' },
  { v: 'bởi vì', e: 'because' },
  { v: 'không', e: 'not' },
  { v: 'này', e: 'this' },
  { v: 'đó', e: 'that' },
  { v: 'tất cả', e: 'all' },
  { v: 'hoặc', e: 'or' },
  { v: 'và', e: 'and' },
  { v: 'biết', e: 'to know' },
  { v: 'nghĩ', e: 'to think' },
  { v: 'đến', e: 'to come' },
  { v: 'đặt', e: 'to put' },
  { v: 'lấy', e: 'to take' },
  { v: 'tìm', e: 'to find' },
  { v: 'nghe', e: 'to listen' },
  { v: 'làm việc', e: 'to work' },
  { v: 'nói chuyện', e: 'to talk' },
  { v: 'cho', e: 'to give' },
  { v: 'thích', e: 'to like' },
  { v: 'giúp đỡ', e: 'to help' },
  { v: 'yêu', e: 'to love' },
  { v: 'gọi', e: 'to call' },
  { v: 'chờ đợi', e: 'to wait' },
  { v: 'một', e: 'one' },
  { v: 'hai', e: 'two' },
  { v: 'ba', e: 'three' },
  { v: 'bốn', e: 'four' },
  { v: 'năm', e: 'five' },
  { v: 'sáu', e: 'six' },
  { v: 'bảy', e: 'seven' },
  { v: 'tám', e: 'eight' },
  { v: 'chín', e: 'nine' },
  { v: 'mười', e: 'ten' },
]

export const vietnameseVocabMap = vietnameseBasicVocab.reduce(
  (acc, entry) => {
    acc[entry.v] = entry
    return acc
  },
  {} as Record<string, IVietnameseVocabEntry>,
)
