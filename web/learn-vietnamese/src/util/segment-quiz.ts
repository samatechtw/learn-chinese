import { shuffleArray as shuffle } from '@frontend/util/misc'
import {
  ILearningSegment,
  ILearningSegmentQuestion,
  ILearningSentence,
  SegmentQuestionType,
} from '@learn-vietnamese/types'

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const normalizeSpace = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ')
}

const normalizeTypedAnswer = (value: string): string => {
  return normalizeSpace(value)
    .replace(/[.,!?;:]/g, '')
    .toLocaleLowerCase()
}

const stripDiacritics = (value: string): string => {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const keepLettersNumbersAndSpace = (value: string): string => {
  return value.replace(/[^0-9a-zA-Z\u00C0-\u024F\s]/g, '')
}

const keepPunctuationOnly = (value: string): string => {
  return value.replace(/[^.,!?;:]/g, '')
}

const levenshteinDistance = (a: string, b: string): number => {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const row = Array.from({ length: b.length + 1 }, (_, i) => i)

  for (let i = 1; i <= a.length; i += 1) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const temp = row[j]
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost)
      prev = temp
    }
  }

  return row[b.length]
}

const getSimilarityScore = (a: string, b: string): number => {
  const maxLength = Math.max(a.length, b.length)
  if (maxLength === 0) return 1
  const distance = levenshteinDistance(a, b)
  return Math.max(0, 1 - distance / maxLength)
}

export interface ISegmentTypedAnswerGrade {
  totalScore: number
  spellingScore: number
  accentScore: number
  punctuationScore: number
  label: string
}

export const gradeSegmentTypedAnswer = (
  expectedAnswer: string,
  userAnswer: string,
): ISegmentTypedAnswerGrade => {
  const expected = normalizeSpace(expectedAnswer).toLocaleLowerCase()
  const user = normalizeSpace(userAnswer).toLocaleLowerCase()

  const expectedNoPunc = keepLettersNumbersAndSpace(expected)
  const userNoPunc = keepLettersNumbersAndSpace(user)
  const expectedBase = stripDiacritics(expectedNoPunc)
  const userBase = stripDiacritics(userNoPunc)
  const expectedPunctuation = keepPunctuationOnly(expected)
  const userPunctuation = keepPunctuationOnly(user)

  const spellingScore = getSimilarityScore(expectedBase, userBase)
  const accentScore = getSimilarityScore(expectedNoPunc, userNoPunc)
  const punctuationScore = getSimilarityScore(expectedPunctuation, userPunctuation)

  const totalScore = Math.max(
    0,
    Math.min(1, spellingScore * 0.7 + accentScore * 0.25 + punctuationScore * 0.05),
  )

  const label =
    totalScore >= 0.95
      ? 'Excellent'
      : totalScore >= 0.85
        ? 'Good'
        : totalScore >= 0.7
          ? 'Fair'
          : 'Needs Work'

  return {
    totalScore,
    spellingScore,
    accentScore,
    punctuationScore,
    label,
  }
}

const replaceTargetOnce = (input: string, target: string): string => {
  const pattern = new RegExp(escapeRegExp(target), 'i')
  return input.replace(pattern, '____')
}

const sampleOptions = (
  pool: string[],
  correctAnswer: string,
  count: number,
): string[] => {
  const filtered = pool.filter((item) => item !== correctAnswer)
  const sampled = shuffle(filtered).slice(0, count)
  return shuffle([correctAnswer, ...sampled])
}

const getClozeAnswer = (sentence: ILearningSentence): string => {
  return normalizeSpace(sentence.clozeTargets.join(' '))
}

const buildFillInBlankDisplay = (sentence: ILearningSentence): string => {
  return sentence.clozeTargets.reduce((output, target) => {
    return replaceTargetOnce(output, target)
  }, sentence.vietnamese)
}

const buildQuestionTypeOrder = (segment: ILearningSegment): SegmentQuestionType[] => {
  if (segment.questionTypes.length === 0) {
    return ['FillInBlank', 'WriteSentence', 'ChooseEnglishMeaning']
  }
  return shuffle(segment.questionTypes)
}

export const buildSegmentQuestions = (
  segment: ILearningSegment,
): ILearningSegmentQuestion[] => {
  const typeOrder = buildQuestionTypeOrder(segment)
  const englishPool = segment.sentences.map((sentence) => sentence.english)
  const clozePool = segment.sentences.map((sentence) => getClozeAnswer(sentence))

  return segment.sentences.map((sentence, index) => {
    const type = typeOrder[index % typeOrder.length]
    const base = {
      id: `${segment.id}-${sentence.id}-${type}`,
      sentenceId: sentence.id,
      type,
      audioText: sentence.vietnamese,
      english: sentence.english,
      vietnamese: sentence.vietnamese,
    }

    if (type === 'FillInBlank') {
      const correctAnswer = getClozeAnswer(sentence)
      return {
        ...base,
        prompt: 'Fill in the missing words',
        displayText: buildFillInBlankDisplay(sentence),
        correctAnswer,
        options: sampleOptions(clozePool, correctAnswer, 3),
      }
    }

    if (type === 'WriteSentence') {
      return {
        ...base,
        prompt: 'Listen and type the full Vietnamese sentence',
        displayText: '',
        correctAnswer: sentence.vietnamese,
      }
    }

    return {
      ...base,
      prompt: 'Choose the correct English meaning',
      displayText: sentence.vietnamese,
      correctAnswer: sentence.english,
      options: sampleOptions(englishPool, sentence.english, 3),
    }
  })
}

export const isSegmentAnswerCorrect = (
  question: ILearningSegmentQuestion,
  answer: string,
): boolean => {
  if (question.type === 'WriteSentence') {
    return normalizeTypedAnswer(answer) === normalizeTypedAnswer(question.correctAnswer)
  }
  return normalizeSpace(answer) === normalizeSpace(question.correctAnswer)
}
