import { IUnit } from '@learn-chinese/types'

export const travelUnit: IUnit = {
  id: 'travel',
  title: 'Travel & Transport',
  titleChinese: '交通',
  description: 'Getting around Taiwan — vehicles, directions, asking for help, and navigating public transit.',
  icon: '🚇',
  color: '#0369a1',
  phrases: [
    // Vehicles
    { id: 'jiaotache', chinese: '腳踏車', pinyin: 'jiǎotàchē', english: 'bicycle' },
    { id: 'jiche', chinese: '機車', pinyin: 'jīchē', english: 'scooter / motorcycle' },
    { id: 'gongche', chinese: '公車', pinyin: 'gōngchē', english: 'bus' },
    { id: 'jieyun', chinese: '捷運', pinyin: 'jiéyùn', english: 'MRT / metro' },
    { id: 'jichengche', chinese: '計程車', pinyin: 'jìchéngchē', english: 'taxi' },
    { id: 'gaotie', chinese: '高鐵', pinyin: 'gāotiě', english: 'high-speed rail' },
    { id: 'feiji', chinese: '飛機', pinyin: 'fēijī', english: 'airplane' },
    { id: 'huoche', chinese: '火車', pinyin: 'huǒchē', english: 'train' },
    // Directions
    { id: 'zuozhuan', chinese: '左轉', pinyin: 'zuǒzhuǎn', english: 'turn left' },
    { id: 'youzhuan', chinese: '右轉', pinyin: 'yòuzhuǎn', english: 'turn right' },
    { id: 'zhizou', chinese: '直走', pinyin: 'zhízǒu', english: 'go straight' },
    { id: 'bei', chinese: '北', pinyin: 'běi', english: 'north' },
    { id: 'nan', chinese: '南', pinyin: 'nán', english: 'south' },
    { id: 'dong', chinese: '東', pinyin: 'dōng', english: 'east' },
    { id: 'xi', chinese: '西', pinyin: 'xī', english: 'west' },
    // Asking for help
    { id: 'qingwen', chinese: '請問', pinyin: 'qǐngwèn', english: 'excuse me / may I ask' },
    { id: 'milu', chinese: '迷路', pinyin: 'mílù', english: 'to get lost' },
    // Transit vocabulary
    { id: 'yuetai', chinese: '月台', pinyin: 'yuètái', english: 'platform' },
    { id: 'piao', chinese: '票', pinyin: 'piào', english: 'ticket' },
    { id: 'fujin', chinese: '附近', pinyin: 'fùjìn', english: 'nearby' },
    { id: 'chufa', chinese: '出發', pinyin: 'chūfā', english: 'to depart / set off' },
    { id: 'daoda', chinese: '到達', pinyin: 'dàodá', english: 'to arrive' },
  ],
  sentences: [
    {
      id: 's1',
      template: '我在等___車。',
      answer: '公',
      english: 'I am waiting for the bus.',
      distractors: ['機', '計', '火'],
    },
    {
      id: 's2',
      template: '請___，捷運站在哪裡？',
      answer: '問',
      english: 'Excuse me, where is the MRT station?',
      distractors: ['走', '發', '到'],
    },
    {
      id: 's3',
      template: '往___走就到了。',
      answer: '直',
      english: 'Go straight ahead and you\'ll be there.',
      distractors: ['左', '右', '北'],
    },
    {
      id: 's4',
      template: '我___路了，可以幫我嗎？',
      answer: '迷',
      english: "I'm lost, can you help me?",
      distractors: ['找', '走', '出'],
    },
    {
      id: 's5',
      template: '月___在哪裡？',
      answer: '台',
      english: 'Where is the platform?',
      distractors: ['站', '路', '程'],
    },
    {
      id: 's6',
      template: '飛機幾點出___？',
      answer: '發',
      english: 'What time does the plane depart?',
      distractors: ['到', '站', '走'],
    },
  ],
  orderPhrases: [
    {
      id: 'o1',
      words: ['請問', '怎麼', '去', '火車站'],
      english: 'Excuse me, how do I get to the train station?',
      distractors: ['我', '捷運', '票'],
    },
    {
      id: 'o2',
      words: ['在', '這裡', '停', '一下'],
      english: 'Stop here for a moment.',
      distractors: ['我', '去', '轉'],
    },
    {
      id: 'o3',
      words: ['我', '要', '買', '兩張票'],
      english: 'I want to buy two tickets.',
      distractors: ['出發', '附近', '高鐵'],
    },
    {
      id: 'o4',
      words: ['請問', '附近', '有', '公車站', '嗎'],
      english: 'Excuse me, is there a bus stop nearby?',
      distractors: ['去', '我', '捷運'],
    },
  ],
}
