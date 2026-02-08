import { ILearningSegment } from '@learn-vietnamese/types'

export const vietnameseLearningSegments: ILearningSegment[] = [
  {
    id: 'tet-basics-1',
    language: 'vietnamese',
    dialect: 'northern',
    title: 'Tet Basics: Food, Wishes, Activities',
    description:
      'Beginner sentences for Lunar New Year food, wishes, and common holiday activities.',
    category: 'Beginner',
    questionTypes: ['FillInBlank', 'WriteSentence', 'ChooseEnglishMeaning'],
    sentences: [
      {
        id: 'food-1',
        vietnamese: 'Con thích ăn chả rán.',
        english: 'The child likes to eat fried ham.',
        clozeTargets: ['chả rán'],
      },
      {
        id: 'food-2',
        vietnamese: 'Tôi muốn gọi bánh chưng.',
        english: 'I want to order rice cake.',
        clozeTargets: ['bánh chưng'],
      },
      {
        id: 'food-3',
        vietnamese: 'Cả nhà ăn miến với canh.',
        english: 'The whole family eats vermicelli with soup.',
        clozeTargets: ['miến với canh'],
      },
      {
        id: 'wish-1',
        vietnamese: 'Chúc con ngoan, khỏe, ăn nhiều.',
        english: 'Wish you well-behaved, healthy, and eating well.',
        clozeTargets: ['ngoan, khỏe'],
      },
      {
        id: 'wish-2',
        vietnamese: 'Chúc bác vui, khỏe, nhiều tiền.',
        english: 'Wish you joy, health, and lots of money.',
        clozeTargets: ['nhiều tiền'],
      },
      {
        id: 'wish-3',
        vietnamese: 'Chúc năm mới vui khỏe.',
        english: 'Happy and healthy New Year.',
        clozeTargets: ['năm mới'],
      },
      {
        id: 'activity-1',
        vietnamese: 'Tối nay mình đi chùa.',
        english: 'Tonight we go to the temple.',
        clozeTargets: ['đi chùa'],
      },
      {
        id: 'activity-2',
        vietnamese: 'Sau đó chúng ta hát karaoke.',
        english: 'After that we sing karaoke.',
        clozeTargets: ['hát karaoke'],
      },
      {
        id: 'activity-3',
        vietnamese: 'Sáng mai em mừng tuổi ông bà.',
        english: 'Tomorrow morning I give red envelopes to my grandparents.',
        clozeTargets: ['mừng tuổi'],
      },
      {
        id: 'activity-4',
        vietnamese: 'Em nhận lì xì đầu năm.',
        english: 'I receive a red envelope at the start of the year.',
        clozeTargets: ['lì xì'],
      },
    ],
  },
]

export const vietnameseLearningSegmentMap = vietnameseLearningSegments.reduce(
  (acc, segment) => {
    acc[segment.id] = segment
    return acc
  },
  {} as Record<string, ILearningSegment>,
)
