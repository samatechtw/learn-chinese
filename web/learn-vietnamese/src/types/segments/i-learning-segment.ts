export type SegmentLanguage = 'vietnamese' | 'chinese'

export type SegmentDialect = 'northern' | 'central' | 'southern'

export type SegmentQuestionType = 'FillInBlank' | 'WriteSentence' | 'ChooseEnglishMeaning'

export interface ILearningSentence {
  id: string
  vietnamese: string
  english: string
  clozeTargets: string[]
}

export interface ILearningSegment {
  id: string
  language: SegmentLanguage
  dialect: SegmentDialect
  title: string
  description: string
  category: string
  questionTypes: SegmentQuestionType[]
  sentences: ILearningSentence[]
}

export interface ILearningSegmentQuestion {
  id: string
  sentenceId: string
  type: SegmentQuestionType
  prompt: string
  displayText: string
  audioText: string
  correctAnswer: string
  options?: string[]
  english: string
  vietnamese: string
}
