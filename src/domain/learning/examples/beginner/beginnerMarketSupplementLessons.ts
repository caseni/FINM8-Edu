import type { ContentSource } from '../../types';
import { createFoundationLesson } from '../wave1/foundationLessonFactory';

const reviewedAt = '2026-09-09T12:00:00+03:00';

const BEGINNER_MARKET_SUPPLEMENT_SOURCES: readonly ContentSource[] = [
  {
    id: 'source.investorgov.index-funds',
    title: 'Index Funds',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-4',
    reviewedAt,
  },
  {
    id: 'source.investorgov.etf-basics',
    title: 'Exchange-Traded Funds (ETFs)',
    publisher: 'Investor.gov — U.S. Securities and Exchange Commission',
    url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-2',
    reviewedAt,
  },
];

const indexEtf = createFoundationLesson({
  id: 'lesson.market.index-etf.001',
  slug: 'endeks-ve-etf-ayni-sey-mi',
  conceptKey: 'market.etf.basics',
  skillId: 'skill.financial-markets',
  competencyId: 'competency.distinguish-index-etf.foundation',
  title: 'Endeks ile borsada işlem gören fon aynı şey mi?',
  titleEn: 'Is an index the same as an exchange-traded fund?',
  objective: 'Endeksin ölçü, ETF’nin ise alınıp satılabilen fon payı olduğunu ayırt eder.',
  objectiveEn: 'Distinguish an index as a measure from an ETF as a tradable fund share.',
  minutes: 4,
  hook: 'Bir endeksi doğrudan satın alabilir misin?',
  hookEn: 'Can you buy a market index directly?',
  explanation: 'Endeks, seçilmiş bir varlık grubunun performansını belirli kurallarla özetleyen ölçüdür. ETF ise borsada işlem gören bir fon payıdır; bir endeksi izleyebilir ama endeksin kendisi değildir. ETF’nin riski tuttuğu varlıklar ve yapısından gelir.',
  explanationEn: 'An index measures a selected group of assets using defined rules. An ETF is a fund share traded on an exchange; it may track an index but is not the index itself. Its risk depends on its holdings and structure.',
  proExplanation: 'Endeks metodolojisi bileşen seçimi ve ağırlıklandırmayı belirler. ETF’de buna ek olarak fon yapısı, ücretler, spread, likidite ve piyasa fiyatının net varlık değerinden sapması gibi unsurlar önem kazanabilir.',
  proExplanationEn: 'Index methodology determines constituent selection and weighting. For an ETF, fund structure, fees, spreads, liquidity, and possible gaps between market price and net asset value can also matter.',
  misconception: 'Yaygın hata: Endeks adı taşıyan her ETF’yi endeksin kendisi veya risksiz ürün sanmak.',
  misconceptionEn: 'Common mistake: treating an index-tracking ETF as the index itself or assuming the ETF label makes it low risk.',
  takeaway: 'Endeks ölçer; ETF bir yatırım aracıdır.',
  takeawayEn: 'An index measures; an ETF is an investment vehicle.',
  prerequisiteConceptKeys: ['market.basics.instruments'],
  relatedConceptKeys: ['market.indices.basics', 'portfolio.diversification', 'market.structure.liquidity'],
  visualAlt: 'Bir tarafta varlık sepetini ölçen endeks, diğer tarafta aynı sepete erişim sağlayabilen ETF payını karşılaştıran görsel',
  visualAltEn: 'Visual comparing an index that measures a basket of assets with an ETF share that can provide access to a basket',
  taskPrompt: 'Hangisi borsada alınıp satılabilen fon payıdır?',
  taskPromptEn: 'Which one is a fund share that can trade on an exchange?',
  taskChoices: [
    { id: 'etf', label: 'ETF', labelEn: 'ETF' },
    { id: 'index', label: 'Endeksin kendisi', labelEn: 'The index itself' },
    { id: 'weight', label: 'Endeks ağırlığı', labelEn: 'An index weight' },
  ],
  taskCorrectIds: ['etf'],
  questions: [
    {
      prompt: 'Endeks en temel olarak ne yapar?',
      promptEn: 'What does an index fundamentally do?',
      choices: [
        { id: 'measure', label: 'Seçilmiş varlık grubunun performansını ölçer ve özetler', labelEn: 'Measures and summarizes the performance of a selected group of assets' },
        { id: 'fund-share', label: 'Her zaman doğrudan alınıp satılan fon payıdır', labelEn: 'It is always a fund share traded directly' },
        { id: 'guarantee', label: 'Gelecekteki getiriyi garanti eder', labelEn: 'Guarantees future returns' },
      ],
      correctId: 'measure',
      explanation: 'Endeks bir ölçüm çerçevesidir; seçilmiş varlıkların performansını belirli kurallarla özetler.',
      explanationEn: 'An index is a measurement framework that summarizes selected assets under defined rules.',
    },
    {
      prompt: 'ETF ile endeks arasındaki doğru ilişki hangisidir?',
      promptEn: 'Which statement correctly describes the relationship between an ETF and an index?',
      choices: [
        { id: 'can-track', label: 'Bir ETF bir endeksi izleyebilir ama endeksin kendisi değildir', labelEn: 'An ETF can track an index but is not the index itself' },
        { id: 'same-thing', label: 'ETF ve endeks her zaman aynı şeydir', labelEn: 'An ETF and an index are always the same thing' },
        { id: 'no-assets', label: 'ETF’nin arkasında hiçbir varlık veya strateji bulunmaz', labelEn: 'An ETF has no underlying assets or strategy' },
      ],
      correctId: 'can-track',
      explanation: 'ETF yatırım aracıdır; endeks ise ölçüdür. ETF belirli bir endeksi izlemeyi hedefleyebilir.',
      explanationEn: 'An ETF is an investment vehicle, while an index is a measure. An ETF may seek to track a particular index.',
    },
    {
      prompt: 'Bir ETF’nin riskini anlamak için önce neye bakmalısın?',
      promptEn: 'What should you examine first to understand an ETF’s risk?',
      choices: [
        { id: 'holdings-structure', label: 'Hangi varlıkları tuttuğuna ve nasıl yapılandırıldığına', labelEn: 'What it holds and how it is structured' },
        { id: 'name-only', label: 'Yalnız adında ETF yazmasına', labelEn: 'Only whether its name says ETF' },
        { id: 'index-name', label: 'Yalnız izlediği endeksin popülerliğine', labelEn: 'Only how popular the index it tracks is' },
      ],
      correctId: 'holdings-structure',
      explanation: 'ETF etiketi tek başına risk düzeyini söylemez; içerik ve yapı belirleyicidir.',
      explanationEn: 'The ETF label alone does not determine risk; holdings and structure are what matter.',
    },
  ],
  sources: BEGINNER_MARKET_SUPPLEMENT_SOURCES,
});

export const BEGINNER_MARKET_SUPPLEMENT_LESSONS = [indexEtf] as const;
