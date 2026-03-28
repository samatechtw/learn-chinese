import { IUnit, IUnitQuestion, UnitQuestionType } from '@learn-chinese/types'

const shuffle = <T>(arr: T[]): T[] => arr.slice().sort(() => Math.random() - 0.5)

const pickDistractors = (pool: string[], exclude: string, count: number): string[] =>
  shuffle(pool.filter((x) => x !== exclude)).slice(0, count)

export function buildUnitQuestions(
  unit: IUnit,
  enabledTypes: UnitQuestionType[],
): IUnitQuestion[] {
  const enabled = (type: UnitQuestionType) => !enabledTypes || enabledTypes.includes(type)

  const allChinese = unit.phrases.map((p) => p.chinese)
  const allEnglish = unit.phrases.map((p) => p.english)

  const translateCE: IUnitQuestion[] = unit.phrases.map((phrase) => ({
    id: `translate-ce-${phrase.id}`,
    type: 'TranslatePhrase',
    phraseId: phrase.id,
    displayText: phrase.chinese,
    correctAnswer: phrase.english,
    options: shuffle([phrase.english, ...pickDistractors(allEnglish, phrase.english, 3)]),
    audioText: phrase.chinese,
  }))

  const translateEC: IUnitQuestion[] = shuffle(unit.phrases)
    .slice(0, 7)
    .map((phrase) => ({
      id: `translate-ec-${phrase.id}`,
      type: 'TranslatePhrase',
      phraseId: phrase.id,
      displayText: phrase.english,
      correctAnswer: phrase.chinese,
      options: shuffle([phrase.chinese, ...pickDistractors(allChinese, phrase.chinese, 3)]),
    }))

  const fillIn: IUnitQuestion[] = unit.sentences.map((sentence) => ({
    id: `fill-${sentence.id}`,
    type: 'FillInBlank',
    phraseId: sentence.id,
    template: sentence.template,
    displayText: sentence.english,
    correctAnswer: sentence.answer,
    options: shuffle([sentence.answer, ...sentence.distractors.slice(0, 3)]),
  }))

  const orderQ: IUnitQuestion[] = unit.orderPhrases.map((op) => ({
    id: `order-${op.id}`,
    type: 'OrderCharacters',
    phraseId: op.id,
    displayText: op.english,
    correctAnswer: op.words.join(''),
    wordBank: shuffle([...op.words, ...op.distractors]),
  }))

  const listenQ: IUnitQuestion[] = shuffle(unit.phrases)
    .slice(0, 5)
    .map((phrase) => ({
      id: `listen-${phrase.id}`,
      type: 'ListenSelect',
      phraseId: phrase.id,
      displayText: phrase.pinyin,
      correctAnswer: phrase.chinese,
      options: shuffle([phrase.chinese, ...pickDistractors(allChinese, phrase.chinese, 3)]),
      audioText: phrase.chinese,
      skippable: true,
    }))

  // Interleave for natural progression: intro vocab → context → construction → audio
  const allQuestions: IUnitQuestion[] = [
    ...(enabled('TranslatePhrase') ? [...shuffle(translateCE).slice(0, 8), ...shuffle(translateEC).slice(0, 5)] : []),
    ...(enabled('FillInBlank') ? shuffle(fillIn) : []),
    ...(enabled('OrderCharacters') ? shuffle(orderQ) : []),
    ...(enabled('ListenSelect') ? shuffle(listenQ) : []),
  ]

  return allQuestions
}
