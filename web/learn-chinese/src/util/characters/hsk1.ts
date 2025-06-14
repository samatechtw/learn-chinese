import { ICharacterInfo, ICharacterSet } from '@frontend/types'

const info = (p: string, z: string, audio?: string): ICharacterInfo => {
  return { p, z }
}

export const hsk1: ICharacterSet = {
  愛: info('ài', 'ㄞˋ'),
  八: info('bā', 'ㄅㄚ'),
  爸爸: info('bà ba', 'ㄅㄚˋ ˙ㄅㄚ'),
  杯子: info('bēi zi', 'ㄅㄟ ˙ㄗ'),
  北京: info('běi jīng', 'ㄅㄟˇ ㄐㄧㄥ'),
  本: info('běn', 'ㄅㄣˇ'),
  不客氣: info('bú kè qi', 'ㄅㄨˋ ㄎㄜˋ ㄑㄧˋ'),
  不: info('bù', 'ㄅㄨˋ'),
  菜: info('cài', 'ㄘㄞˋ'),
  茶: info('chá', 'ㄔㄚˊ'),
  吃: info('chī', 'ㄔ'),
  出租車: info('chū zū chē', 'ㄔㄨ ㄗㄨ ㄔㄜ'),
  打電話: info('dǎ diàn huà', 'ㄉㄚˇ ㄉㄧㄢˋ ㄏㄨㄚˋ'),
  大: info('dà', 'ㄉㄚˋ'),
  的: info('de', '˙ㄉㄜ'),
  點: info('diǎn', 'ㄉㄧㄢˇ'),
  電腦: info('diàn nǎo', 'ㄉㄧㄢˋ ㄋㄠˇ'),
  電視: info('diàn shì', 'ㄉㄧㄢˋ ㄕˋ'),
  電影: info('diàn yǐng', 'ㄉㄧㄢˋ ㄧㄥˇ'),
  東西: info('dōng xi', 'ㄉㄨㄥ ˙ㄒㄧ'),
  都: info('dōu', 'ㄉㄡ'),
  讀: info('dú', 'ㄉㄨˊ'),
  對不起: info('duì bu qǐ', 'ㄉㄨㄟˋ ˙ㄅㄨ ㄑㄧˇ'),
  多: info('duō', 'ㄉㄨㄛ'),
  多少: info('duō shǎo', 'ㄉㄨㄛ ㄕㄠˇ'),
  兒子: info('ér zi', 'ㄦˊ ㄗˇ'),
  二: info('èr', 'ㄦˋ'),
  飯店: info('fàn diàn', 'ㄈㄢˋ ㄉㄧㄢˋ'),
  飛機: info('fēi jī', 'ㄈㄟ ㄐㄧ'),
  分鍾: info('fēn zhōng', 'ㄈㄣ ㄓㄨㄥ'),
  高興: info('gāo xìng', 'ㄍㄠ ㄒㄧㄥˋ'),
  個: info('gè', 'ㄍㄜˋ'),
  工作: info('gōng zuò', 'ㄍㄨㄥ ㄗㄨㄛˋ'),
  狗: info('gǒu', 'ㄍㄡˇ'),
  漢語: info('hàn yǔ', 'ㄏㄢˋ ㄩˇ'),
  好: info('hǎo', 'ㄏㄠˇ'),
  號: info('hào', 'ㄏㄠˋ'),
  喝: info('hē', 'ㄏㄜ'),
  和: info('hé', 'ㄏㄜˊ'),
  很: info('hěn', 'ㄏㄣˇ'),
  後面: info('hòu miàn', 'ㄏㄡˋ ㄇㄧㄢˋ'),
  回: info('huí', 'ㄏㄨㄟˊ'),
  會: info('huì', 'ㄏㄨㄟˋ'),
  幾: info('jǐ', 'ㄐㄧˇ'),
  家: info('jiā', 'ㄐㄧㄚ'),
  叫: info('jiào', 'ㄐㄧㄠˋ'),
  今天: info('jīn tiān', 'ㄐㄧㄣ ㄊㄧㄢ'),
  九: info('jiǔ', 'ㄐㄧㄡˇ'),
  開: info('kāi', 'ㄎㄞ'),
  看: info('kàn', 'ㄎㄢˋ'),
  看見: info('kàn jiàn', 'ㄎㄢˋ ˙ㄐㄧㄢ'),
  塊: info('kuài', 'ㄎㄨㄞˋ'),
  來: info('lái', 'ㄌㄞˊ'),
  老師: info('lǎo shī', 'ㄌㄠˇ ㄕ'),
  了: info('le', '˙ㄌㄜ'),
  冷: info('lěng', 'ㄌㄥˇ'),
  裡: info('lǐ', 'ㄌㄧˇ'),
  六: info('liù', 'ㄌㄧㄡˋ'),
  嗎: info('ma', '˙ㄇㄚ'),
  媽媽: info('mā ma', 'ㄇㄚ ˙ㄇㄚ'),
  買: info('mǎi', 'ㄇㄞˇ'),
  貓: info('māo', 'ㄇㄠ'),
  沒關系: info('méi guān xi', 'ㄇㄛˋ ㄍㄨㄢ ㄒㄧˋ'),
  沒有: info('méi yǒu', 'ㄇㄟˊ ㄧㄡˇ'),
  米飯: info('mǐ fàn', 'ㄇㄧˇ ㄈㄢˋ'),
  名字: info('míng zi', 'ㄇㄧㄥˊ ˙ㄗ'),
  明天: info('míng tiān', 'ㄇㄧㄥˊ ㄊㄧㄢ'),
  哪: info('nǎ', 'ㄋㄚˇ'),
  哪兒: info('nǎ er', 'ㄋㄚˇ ㄦˊ'),
  那: info('nà', 'ㄋㄚˋ'),
  呢: info('ne', '˙ㄋㄜ'),
  能: info('néng', 'ㄋㄥˊ'),
  你: info('nǐ', 'ㄋㄧˇ'),
  年: info('nián', 'ㄋㄧㄢˊ'),
  女兒: info('nǚ ér', 'ㄋㄩˇ ㄦˊ'),
  朋友: info('péng you', 'ㄆㄥˊ ㄧㄡˇ'),
  漂亮: info('piào liang', 'ㄆㄧㄠˋ ˙ㄌㄧㄤ'),
  蘋果: info('píng guǒ', 'ㄆㄧㄥˊ ㄍㄨㄛˇ'),
  七: info('qī', 'ㄑㄧ'),
  前面: info('qián miàn', 'ㄑㄧㄢˊ ㄇㄧㄢˋ'),
  錢: info('qián', 'ㄑㄧㄢˊ'),
  請: info('qǐng', 'ㄑㄧㄥˇ'),
  去: info('qù', 'ㄑㄩˋ'),
  熱: info('rè', 'ㄖㄜˋ'),
  人: info('rén', 'ㄖㄣˊ'),
  認識: info('rèn shi', 'ㄖㄣˋ ˙ㄕ'),
  三: info('sān', 'ㄙㄢ'),
  商店: info('shāng diàn', 'ㄕㄤ ㄉㄧㄢˋ'),
  上: info('shàng', 'ㄕㄤˋ'),
  上午: info('shàng wǔ', 'ㄕㄤˋ ㄨˇ'),
  少: info('shǎo', 'ㄕㄠˇ'),
  誰: info('shéi', 'ㄕㄟˊ'),
  什麼: info('shén me', 'ㄕㄣˊ ˙ㄇㄜㄕㄜˊ ˙ㄇㄜ'),
  十: info('shí', 'ㄕˊ'),
  時候: info('shí hou', 'ㄕˊ ㄏㄡˋ'),
  是: info('shì', 'ㄕˋ'),
  書: info('shū', 'ㄕㄨ'),
  水: info('shuǐ', 'ㄕㄨㄟˇ'),
  水果: info('shuǐguǒ', 'ㄕㄨㄟˇ ㄍㄨㄛˇ'),
  睡覺: info('shuì jiào', 'ㄕㄨㄟˋ ㄐㄧㄠˋ'),
  說: info('shuō', 'ㄕㄨㄛ'),
  四: info('sì', 'ㄙˋ'),
  歲: info('suì', 'ㄙㄨㄟˋ'),
  他: info('tā', 'ㄊㄚ'),
  她: info('tā', 'ㄊㄚ'),
  太: info('tài', 'ㄊㄞˋ'),
  天氣: info('tiān qì', 'ㄊㄧㄢ ㄑㄧˋ'),
  聽: info('tīng', 'ㄊㄧㄥ'),
  同學: info('tóng xué', 'ㄊㄨㄥˊ ㄒㄩㄝˊ'),
  喂: info('wèi', 'ㄨㄟˋ'),
  我: info('wǒ', 'ㄨㄛˇ'),
  我們: info('wǒ men', 'ㄨㄛˇ ˙ㄇㄣ'),
  五: info('wǔ', 'ㄨˇ'),
  喜歡: info('xǐ huan', 'ㄒㄧˇ ㄏㄨㄢ'),
  下: info('xià', 'ㄒㄧㄚˋ'),
  下午: info('xià wǔ', 'ㄒㄧㄚˋ ㄨˇ'),
  下雨: info('xià yǔ', 'ㄒㄧㄚˋ ㄩˇ'),
  先生: info('xiān sheng', 'ㄒㄧㄢ ㄕㄥ'),
  現在: info('xiàn zài', 'ㄒㄧㄢˋ ㄗㄞˋ'),
  想: info('xiǎng', 'ㄒㄧㄤˇ'),
  小: info('xiǎo', 'ㄒㄧㄠˇ'),
  小姐: info('xiǎo jie', 'ㄒㄧㄠˇ ㄐㄧㄝˇ'),
  些: info('xiē', 'ㄒㄧㄝ'),
  寫: info('xiě', 'ㄒㄧㄝˇ'),
  謝謝: info('xiè xie', 'ㄒㄧㄝˋ ˙ㄒㄧㄝ'),
  星期: info('xīng qī', 'ㄒㄧㄥ ㄑㄧˊ'),
  學生: info('xué sheng', 'ㄒㄩㄝˊ ㄕㄥ'),
  學習: info('xué xí', 'ㄒㄩㄝˊ ㄒㄧˊ'),
  學校: info('xué xiào', 'ㄒㄩㄝˊ ㄒㄧㄠˋ'),
  一: info('yī', 'ㄧ'),
  一點兒: info('yī diǎn er', 'ㄧ ㄉㄧㄢˇㄦ (變)ㄧˋ ㄉㄧㄚˇㄦ'),
  醫生: info('yī shēng', 'ㄧ ㄕㄥ'),
  醫院: info('yī yuàn', 'ㄧ ㄩㄢˋ'),
  衣服: info('yī fu', 'ㄧ ˙ㄈㄨ'),
  椅子: info('yǐ zi', 'ㄧˇ ˙ㄗ'),
  有: info('yǒu', 'ㄧㄡˇ'),
  月: info('yuè', 'ㄩㄝˋ'),
  再見: info('zài jiàn', 'ㄗㄞˋ ㄐㄧㄢˋ'),
  在: info('zài', 'ㄗㄞˋ'),
  怎麼: info('zěn me', 'ㄗㄣˇ ˙ㄇㄜ'),
  怎麼樣: info('zěn me yàng', 'ㄗㄣˇ ˙ㄇㄜ ㄧㄤˋ'),
  這: info('zhè', 'ㄓㄜˋ'),
  中國: info('zhōng guó', 'ㄓㄨㄥ ㄍㄨㄛˊ'),
  中午: info('zhōng wǔ', 'ㄓㄨㄥ ㄨˇ'),
  住: info('zhù', 'ㄓㄨˋ'),
  桌子: info('zhuō zi', 'ㄓㄨㄛ ˙ㄗ'),
  字: info('zì', 'ㄗˋ'),
  昨天: info('zuó tiān', 'ㄗㄨㄛˊ ㄊㄧㄢ'),
  做: info('zuò', 'ㄗㄨㄛˋ'),
  坐: info('zuò', 'ㄗㄨㄛˋ'),
}
