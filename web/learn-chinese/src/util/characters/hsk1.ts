import { ICharacterInfo } from '@frontend/types'

const info = (p: string, audio?: string): ICharacterInfo => {
  return { p, audio }
}

export const hsk1: Record<string, ICharacterInfo> = {
  愛: info('ài'),
  八: info('bā'),
  爸爸: info('bà ba'),
  杯子: info('bēi zi'),
  北京: info('běi jīng'),
  本: info('běn'),
  不客氣: info('bú kè qi'),
  不: info('bù'),
  菜: info('cài'),
  茶: info('chá'),
  吃: info('chī'),
  出租車: info('chū zū chē'),
  打電話: info('dǎ diàn huà'),
  大: info('dà'),
  的: info('de'),
  點: info('diǎn'),
  電腦: info('diàn nǎo'),
  電視: info('diàn shì'),
  電影: info('diàn yǐng'),
  東西: info('dōng xi'),
  都: info('dōu'),
  讀: info('dú'),
  對不起: info('duì bu qǐ'),
  多: info('duō'),
  多少: info('duō shǎo'),
  兒子: info('ér zi'),
  二: info('èr'),
  飯店: info('fàn diàn'),
  飛機: info('fēi jī'),
  分鍾: info('fēn zhōng'),
  高興: info('gāo xìng'),
  個: info('gè'),
  工作: info('gōng zuò'),
  狗: info('gǒu'),
  漢語: info('hàn yǔ'),
  好: info('hǎo'),
  號: info('hào'),
  喝: info('hē'),
  和: info('hé'),
  很: info('hěn'),
  後面: info('hòu miàn'),
  回: info('huí'),
  會: info('huì'),
  幾: info('jǐ'),
  家: info('jiā'),
  叫: info('jiào'),
  今天: info('jīn tiān'),
  九: info('jiǔ'),
  開: info('kāi'),
  看: info('kàn'),
  看見: info('kàn jiàn'),
  塊: info('kuài'),
  來: info('lái'),
  老師: info('lǎo shī'),
  了: info('le'),
  冷: info('lěng'),
  裏: info('lǐ'),
  六: info('liù'),
  嗎: info('ma'),
  媽媽: info('mā ma'),
  買: info('mǎi'),
  貓: info('māo'),
  沒關系: info('méi guān xi'),
  沒有: info('méi yǒu'),
  米飯: info('mǐ fàn'),
  名字: info('míng zi'),
  明天: info('míng tiān'),
  哪: info('nǎ'),
  哪兒: info('nǎ er'),
  那: info('nà'),
  呢: info('ne'),
  能: info('néng'),
  你: info('nǐ'),
  年: info('nián'),
  女兒: info('nǚ ér'),
  朋友: info('péng you'),
  漂亮: info('piào liang'),
  蘋果: info('píng guǒ'),
  七: info('qī'),
  前面: info('qián miàn'),
  錢: info('qián'),
  請: info('qǐng'),
  去: info('qù'),
  熱: info('rè'),
  人: info('rén'),
  認識: info('rèn shi'),
  三: info('sān'),
  商店: info('shāng diàn'),
  上: info('shàng'),
  上午: info('shàng wǔ'),
  少: info('shǎo'),
  誰: info('shéi'),
  什麽: info('shén me'),
  十: info('shí'),
  時候: info('shí hou'),
  是: info('shì'),
  書: info('shū'),
  水: info('shuǐ'),
  水果: info('shuǐguǒ'),
  睡覺: info('shuì jiào'),
  說: info('shuō'),
  四: info('sì'),
  歲: info('suì'),
  他: info('tā'),
  她: info('tā'),
  太: info('tài'),
  天氣: info('tiān qì'),
  聽: info('tīng'),
  同學: info('tóng xué'),
  喂: info('wèi'),
  我: info('wǒ'),
  我們: info('wǒ men'),
  五: info('wǔ'),
  喜歡: info('xǐ huan'),
  下: info('xià'),
  下午: info('xià wǔ'),
  下雨: info('xià yǔ'),
  先生: info('xiān sheng'),
  現在: info('xiàn zài'),
  想: info('xiǎng'),
  小: info('xiǎo'),
  小姐: info('xiǎo jie'),
  些: info('xiē'),
  寫: info('xiě'),
  謝謝: info('xiè xie'),
  星期: info('xīng qī'),
  學生: info('xué sheng'),
  學習: info('xué xí'),
  學校: info('xué xiào'),
  一: info('yī'),
  一點兒: info('yī diǎn er'),
  醫生: info('yī shēng'),
  醫院: info('yī yuàn'),
  衣服: info('yī fu'),
  椅子: info('yǐ zi'),
  有: info('yǒu'),
  月: info('yuè'),
  再見: info('zài jiàn'),
  在: info('zài'),
  怎麽: info('zěn me'),
  怎麽樣: info('zěn me yàng'),
  這: info('zhè'),
  中國: info('zhōng guó'),
  中午: info('zhōng wǔ'),
  住: info('zhù'),
  桌子: info('zhuō zi'),
  字: info('zì'),
  昨天: info('zuó tiān'),
  做: info('zuò'),
  坐: info('zuò'),
}
