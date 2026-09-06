import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

type CopyPair = { tr: string; en: string };
type TaskCopy = { correct: readonly CopyPair[]; incorrect: readonly CopyPair[] };

const COPY: Readonly<Record<string, TaskCopy>> = {
  'lesson.risk.volatility.001': {
    correct: [
      { tr: 'Geniş fiyat hareketi aynı miktarın parasal etkisini büyütebilir', en: 'Wide price movement can increase the cash impact of the same amount' },
      { tr: 'Volatilite hareket genişliğini anlatır, yönü garanti etmez', en: 'Volatility describes movement width and does not guarantee direction' },
    ],
    incorrect: [
      { tr: 'Yüksek volatilite fiyatın kesin yükseleceğini gösterir', en: 'High volatility proves price will certainly rise' },
      { tr: 'Fiyat çok oynuyorsa risk otomatik olarak sıfırlanır', en: 'If price moves a lot, risk automatically becomes zero' },
    ],
  },
  'lesson.risk.position-sizing.001': {
    correct: [
      { tr: 'Daha büyük miktar aynı harekette daha büyük parasal etki yaratabilir', en: 'A larger amount can create a larger cash impact from the same move' },
      { tr: 'Risk düşünürken fiyat hareketiyle birlikte taşıdığın miktar da önemlidir', en: 'When thinking about risk, the amount held matters together with the price move' },
    ],
    incorrect: [
      { tr: 'Daha büyük pozisyon fiyatın yönünü daha doğru tahmin eder', en: 'A larger position predicts price direction more accurately' },
      { tr: 'Alabileceğin en büyük miktar her zaman en güvenli miktardır', en: 'The largest amount you can buy is always the safest amount' },
    ],
  },
  'lesson.risk.reward.001': {
    correct: [
      { tr: 'Hedef büyüklüğüyle birlikte gerçekleşme ihtimali de düşünülmelidir', en: 'The likelihood of reaching a target should be considered together with target size' },
      { tr: 'Komisyon ve fiyat kayması gerçek sonucu değiştirebilir', en: 'Fees and slippage can change the actual result' },
    ],
    incorrect: [
      { tr: 'Büyük hedef yazmak sonucu garanti eder', en: 'Writing a large target guarantees the result' },
      { tr: 'Risk/getiri oranı tek başına karar kalitesini kanıtlar', en: 'The risk-reward ratio alone proves decision quality' },
    ],
  },
  'lesson.risk.stop-orders.001': {
    correct: [
      { tr: 'Stop seviyesi çıkış emrini tetikler ama fiyatı durdurmaz', en: 'A stop level triggers an exit order but does not stop price' },
      { tr: 'Hızlı piyasada gerçek çıkış stop seviyesinden daha kötü olabilir', en: 'In a fast market, the actual exit can be worse than the stop level' },
    ],
    incorrect: [
      { tr: 'Stop seviyesi maksimum kaybı kesin olarak garanti eder', en: 'A stop level guarantees the maximum loss with certainty' },
      { tr: 'Fiyat stop seviyesine geldiğinde piyasa otomatik olarak donar', en: 'The market automatically freezes when price reaches the stop level' },
    ],
  },
  'lesson.portfolio.diversification.001': {
    correct: [
      { tr: 'Farklı risk kaynaklarına yayılmak tek bir olaya bağımlılığı azaltabilir', en: 'Spreading across different risk sources can reduce dependence on one event' },
      { tr: 'Varlıkların aynı olaydan birlikte etkilenip etkilenmediğine bakmak önemlidir', en: 'It matters whether assets can all be affected by the same event' },
    ],
    incorrect: [
      { tr: 'Yalnız isim sayısını artırmak otomatik olarak çeşitlendirmedir', en: 'Simply increasing the number of names automatically creates diversification' },
      { tr: 'Çeşitlendirme bütün kayıpları kesin olarak engeller', en: 'Diversification prevents every loss with certainty' },
    ],
  },
};

function localized(value: CopyPair): LocalizedText {
  return { tr: value.tr, en: value.en };
}

export function normalizeBeginnerRiskTaskQuality(lesson: MicroLesson): MicroLesson {
  // The first risk lesson intentionally keeps its concrete possibility-vs-realized-loss
  // choices. That contrast is clearer for a true beginner than replacing the choices
  // with abstract rule statements.
  if (lesson.id === 'lesson.risk.uncertainty.001') return lesson;

  const copy = COPY[lesson.id];
  if (!copy || !lesson.practicalTask.choices?.length) return lesson;

  const correctIds = new Set(lesson.practicalTask.expectedEvidence);
  let correctIndex = 0;
  let incorrectIndex = 0;
  const choices = lesson.practicalTask.choices.map((choice) => {
    const isCorrect = correctIds.has(choice.id);
    const pool = isCorrect ? copy.correct : copy.incorrect;
    const index = isCorrect ? correctIndex++ : incorrectIndex++;
    const replacement = pool[index % pool.length];
    return { ...choice, label: localized(replacement) };
  });

  const multi = correctIds.size > 1;
  const prompt: LocalizedText = multi
    ? {
        tr: 'Hangileri bu dersin ana fikrini doğru anlatır?',
        en: 'Which statements correctly describe the main idea of this lesson?',
      }
    : lesson.practicalTask.prompt.normal;

  return microLessonSchema.parse({
    ...lesson,
    practicalTask: {
      ...lesson.practicalTask,
      prompt: { normal: prompt },
      choices,
    },
  });
}
