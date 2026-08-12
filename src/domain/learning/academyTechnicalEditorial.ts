import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

type CopyPair = { tr: string; en: string };
type QuestionCopy = {
  prompt: CopyPair;
  correct: CopyPair;
  incorrect: readonly CopyPair[];
  explanation: CopyPair;
};
type LessonCopy = {
  title: CopyPair;
  objective: CopyPair;
  hook: CopyPair;
  explanation: CopyPair;
  misconception: CopyPair;
  takeaway: CopyPair;
  visualAlt: CopyPair;
  taskPrompt: CopyPair;
  taskCorrect: readonly CopyPair[];
  taskIncorrect: readonly CopyPair[];
  questions: readonly [QuestionCopy, QuestionCopy, QuestionCopy];
};

const p = (tr: string, en: string): CopyPair => ({ tr, en });
const localized = (value: CopyPair): LocalizedText => ({ tr: value.tr, en: value.en });

const COPY: Readonly<Record<string, LessonCopy>> = {
  'lesson.technical.breakout.001': {
    title: p('Fiyat bir seviyeyi aşınca neye bakmalısın?', 'What should you watch after price crosses a level?'),
    objective: p('Bir seviyeyi kısa süre aşmakla o seviyenin dışında kalabilmek arasındaki farkı anla.', 'Understand the difference between briefly crossing a level and being able to stay beyond it.'),
    hook: p('Fiyat daha önce geçemediği bölgenin üstüne bir an çıktı. Bu tek başına yeterli mi?', 'Price briefly moved above an area it could not cross before. Is that enough by itself?'),
    explanation: p('Fiyat daha önce zorlandığı bir bölgenin dışına çıktığında buna kırılım (breakout) denir. Ama çizgiyi bir an geçmek tek başına güçlü kanıt değildir. Asıl soru fiyatın bölgenin dışında kalıp kalamadığı ve hareketin devam edip etmediğidir. Kırılım bir gözlemdir; gelecek yönü garanti etmez.', 'When price moves beyond an area where it previously struggled, this is called a breakout. But briefly crossing the line is not strong evidence by itself. The key question is whether price can stay beyond the area and continue. A breakout is an observation, not a guarantee of future direction.'),
    misconception: p('Seviyenin üstüne çıkan her kısa hareketi güçlü kırılım sayma. Fiyat hemen geri dönebilir.', 'Do not treat every brief move beyond a level as a strong breakout. Price can quickly return.'),
    takeaway: p('Kırılımda yalnız “geçti mi?” değil, “dışarıda kalabildi mi?” sorusuna da bak.', 'With a breakout, ask not only “did it cross?” but also “could it stay beyond the area?”'),
    visualAlt: p('Aynı seviyeyi kısa süre aşan fiyat ile seviyenin üstünde kalıp devam eden fiyatı karşılaştıran sade grafik', 'Simple chart comparing a brief move beyond a level with price staying above it and continuing'),
    taskPrompt: p('Hangisi seviyenin gerçekten aşılmış olabileceğine dair daha güçlü gözlemdir?', 'Which is stronger evidence that a level may have been meaningfully crossed?'),
    taskCorrect: [p('Fiyatın bölgenin üzerine çıkıp orada kalmaya devam etmesi', 'Price moving above the area and continuing to stay there')],
    taskIncorrect: [p('Fiyatın bir an üstüne çıkıp hemen geri dönmesi', 'Price briefly moving above and immediately returning'), p('Fiyatın aralığın ortasında küçük hareket etmesi', 'Price making a small move in the middle of the range')],
    questions: [
      { prompt: p('Bir seviyenin üstüne çıkan fiyatı değerlendirirken önemli soru hangisidir?', 'What is an important question after price moves above a level?'), correct: p('Bölgenin dışında kalabiliyor mu?', 'Can price stay beyond the area?'), incorrect: [p('Mumun rengi ne?', 'What color is the candle?'), p('Grafiğin adı ne kadar uzun?', 'How long is the chart name?')], explanation: p('Kısa bir taşma yerine bölgenin dışında kalma ve devam davranışı daha fazla bilgi verir.', 'Staying beyond the area and continuing provides more information than a brief overshoot.') },
      { prompt: p('Kısa bir taşma neden tek başına yeterli değildir?', 'Why is a brief overshoot not enough by itself?'), correct: p('Fiyat hemen önceki alanın içine dönebilir', 'Price can quickly return inside the prior area'), incorrect: [p('Fiyat o anda tamamen durduğu için', 'Because price stops completely at that moment'), p('Bütün piyasalar aynı olduğu için', 'Because all markets are identical')], explanation: p('Seviyeyi kısa süre geçmek, fiyatın yeni bölgede kalabildiğini henüz göstermez.', 'Briefly crossing a level does not yet show that price can remain in the new area.') },
      { prompt: p('Kırılım gelecek yönü garanti eder mi?', 'Does a breakout guarantee future direction?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, her zaman', 'Yes, always'), p('Yalnız yeşil mumda', 'Only with a green candle')], explanation: p('Kırılım gözlenen bir fiyat davranışıdır; sonraki hareket yine belirsizdir.', 'A breakout is an observed price behavior; the next move remains uncertain.') },
    ],
  },
  'lesson.technical.false-breakout.001': {
    title: p('Fiyat seviyeyi aşıp geri dönerse ne olmuş olabilir?', 'What may have happened if price crossed a level and came back?'),
    objective: p('Bir seviyenin dışına çıkan fiyatın orada kalamayıp geri dönmesini ayırt et.', 'Recognize when price moves beyond a level but cannot stay there and returns.'),
    hook: p('Fiyat bölgenin üstüne çıktı, sonra kısa sürede yeniden içine döndü. İlk hareket ne anlatıyor olabilir?', 'Price moved above an area, then quickly returned inside it. What might that first move mean?'),
    explanation: p('Fiyat bir seviyeyi aşar ama dışarıda kalamayarak hızlıca geri dönerse buna başarısız kırılım (false breakout) denir. Bu davranış ilk hareketin sürdürülemediğini gösterir. Ancak tek başına yeni yönün kesinleştiği anlamına gelmez.', 'If price crosses a level but cannot stay outside and quickly returns, this is called a false breakout. It shows that the first move was not sustained. It does not by itself prove a new direction.'),
    misconception: p('Başarısız kırılımı otomatik ters yön sinyali sayma. Yalnız ilk hareketin dışarıda tutunamadığını biliyorsun.', 'Do not treat a false breakout as an automatic opposite-direction signal. You only know the first move failed to hold outside.'),
    takeaway: p('Dışarı çıktı, tutunamadı, geri döndü: bu başarısız kırılım olabilir; kesin yön sinyali değildir.', 'Moved out, failed to hold, returned: this may be a false breakout, not a certain direction signal.'),
    visualAlt: p('Bir seviyenin dışına çıkan fiyatın kısa süre sonra aynı alanın içine geri dönmesini gösteren sade grafik', 'Simple chart showing price moving beyond a level and shortly returning inside the same area'),
    taskPrompt: p('Hangisi başarısız kırılıma daha çok benzer?', 'Which behavior looks more like a false breakout?'),
    taskCorrect: [p('Bölgenin dışına çıkıp kısa sürede tekrar içine dönmek', 'Move beyond the area and return inside shortly after')],
    taskIncorrect: [p('Bölgenin dışına çıkıp orada kalmaya devam etmek', 'Move beyond the area and continue to stay there'), p('Bölgeye hiç yaklaşmamak', 'Never approach the area')],
    questions: [
      { prompt: p('Fiyat seviyeyi aşıp hızla geri dönerse ne görmüş olabilirsin?', 'What may you have seen if price crossed a level and quickly returned?'), correct: p('Sürdürülemeyen bir kırılım', 'A breakout that was not sustained'), incorrect: [p('Kesin yeni trend', 'A certain new trend'), p('Fiyatın tamamen durması', 'Price stopping completely')], explanation: p('Temel gözlem, fiyatın yeni bölgede kalamayıp eski alanın içine dönmesidir.', 'The core observation is that price could not remain in the new area and returned inside the old one.') },
      { prompt: p('Bu hareket otomatik ters yön garantisi midir?', 'Does this automatically guarantee the opposite direction?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, her zaman', 'Yes, always'), p('Yalnız günlük grafikte garanti eder', 'It guarantees it only on a daily chart')], explanation: p('Başarısız kırılım ilk hareketin tutunamadığını gösterir; sonraki yön için ek davranış gerekir.', 'A false breakout shows the first move did not hold; additional behavior is needed for the next direction.') },
      { prompt: p('Başarısız kırılımı anlamak için neye bakmak daha yararlıdır?', 'What is more useful when reading a false breakout?'), correct: p('Fiyatın dışarıda kalıp kalamadığına ve nasıl geri döndüğüne', 'Whether price could stay outside and how it returned'), incorrect: [p('Yalnız sembol adına', 'Only the ticker name'), p('Arka plan rengine', 'The background color')], explanation: p('Fiyatın tutunma veya geri dönüş davranışı, kullanılan etiketten daha fazla bilgi verir.', 'Whether price holds or returns provides more information than the label itself.') },
    ],
  },
  'lesson.technical.pullback.001': {
    title: p('Kısa geri çekilme trendin bittiğini gösterir mi?', 'Does a short pullback mean the trend is over?'),
    objective: p('Ana yön korunurken oluşan kısa karşı hareketi, gerçek yön değişiminden ayır.', 'Distinguish a short counter-move within an intact broader direction from a true directional change.'),
    hook: p('Fiyat yükselirken birkaç adım geri geldi. Bu yükselişin bittiği anlamına mı gelir?', 'Price moved a few steps lower during an advance. Does that mean the rise is over?'),
    explanation: p('Hayır. Daha geniş yön korunurken fiyatın kısa süre ters yönde hareket etmesine geri çekilme (pullback) denir. Küçük bir düşüş büyük resmi tek başına değiştirmez. Trendin gerçekten döndüğünü söylemek için daha geniş fiyat yapısının da değiştiğine dair kanıt gerekir.', 'No. A short move against the broader direction while that broader direction remains intact is called a pullback. A small decline does not change the bigger picture by itself. A true reversal needs evidence that the broader price structure has also changed.'),
    misconception: p('Birkaç kırmızı mum gördüğünde hemen “trend bitti” sonucuna atlama. Önce daha geniş yapının korunup korunmadığına bak.', 'Do not jump to “the trend is over” after a few red candles. First check whether the broader structure is still intact.'),
    takeaway: p('Kısa geri çekilme başka, ana yönün gerçekten değişmesi başkadır.', 'A short pullback and a true change in the broader direction are different things.'),
    visualAlt: p('Yukarı giden daha geniş hareket içinde kısa süreli aşağı yönlü geri çekilmeyi gösteren sade grafik', 'Simple chart showing a short downward pullback inside a broader upward move'),
    taskPrompt: p('Hangisi ana yön içindeki geçici geri çekilmeye daha çok benzer?', 'Which looks more like a temporary pullback within the broader direction?'),
    taskCorrect: [p('Kısa düşüşe rağmen daha geniş yükseliş yapısının korunması', 'The broader upward structure staying intact despite a short decline')],
    taskIncorrect: [p('Daha geniş yapının da bozulup yeni yönde devam etmesi', 'The broader structure breaking and continuing in a new direction'), p('Tek kırmızı mum görülmesi', 'Seeing one red candle')],
    questions: [
      { prompt: p('Yükselen fiyat birkaç adım geri gelince bu ne olabilir?', 'What may a short decline during an advance be?'), correct: p('Ana yön içindeki geçici geri çekilme', 'A temporary pullback within the broader direction'), incorrect: [p('Her zaman kesin trend dönüşü', 'Always a certain trend reversal'), p('Fiyatın artık hiç hareket etmeyeceği durum', 'A situation where price will never move again')], explanation: p('Daha geniş yapı korunuyorsa kısa karşı hareket ana yönün içinde kalabilir.', 'If the broader structure remains intact, a short counter-move can stay within the main direction.') },
      { prompt: p('Geri çekilmenin gerçek dönüş olduğunu söylemek için ne gerekir?', 'What is needed before calling a pullback a true reversal?'), correct: p('Daha geniş fiyat yapısının da değiştiğine dair kanıt', 'Evidence that the broader price structure has changed'), incorrect: [p('Tek bir kırmızı mum', 'One red candle'), p('Grafiği daha fazla yakınlaştırmak', 'Zooming further into the chart')], explanation: p('Yön değişimi kararı, tek kısa hareketten daha geniş bir fiyat davranışına dayanmalıdır.', 'Calling a reversal should rely on broader price behavior than one short move.') },
      { prompt: p('Kısa süreli düşüş büyük resmi tek başına değiştirir mi?', 'Does a short decline change the bigger picture by itself?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, her zaman', 'Yes, always'), p('Yalnız fiyat kırmızıysa', 'Only when price is red')], explanation: p('Kısa hareketin anlamı, daha geniş yapının korunup korunmadığıyla birlikte değerlendirilir.', 'A short move is interpreted together with whether the broader structure remains intact.') },
    ],
  },
  'lesson.technical.range.001': {
    title: p('Fiyat neden bazen iki sınır arasında gidip gelir?', 'Why does price sometimes move between two boundaries?'),
    objective: p('Fiyatın net yön kurmadan üst ve alt iki tepki bölgesi arasında gidip gelmesini tanı.', 'Recognize price moving between upper and lower reaction areas without establishing a clear direction.'),
    hook: p('Fiyat ne belirgin yükseliyor ne de düşüyor; sürekli aynı iki bölge arasında dönüyor. Ne görüyorsun?', 'Price is neither clearly rising nor falling and keeps returning between the same two areas. What are you seeing?'),
    explanation: p('Bazen fiyat yeni bir yön kurmak yerine üst ve alt iki bölge arasında tekrar gidip gelir. Buna yatay aralık (range) denir. Aralığın ortasındaki küçük hareketler yön konusunda daha az bilgi verir. Üst veya alt sınırın aşılması da tek başına yeni trend garantisi değildir.', 'Sometimes price moves repeatedly between an upper and lower area instead of establishing a new direction. This is called a range. Small moves in the middle often provide less directional information. Crossing either boundary does not by itself guarantee a new trend.'),
    misconception: p('Aralığın ortasındaki her küçük hareketten yeni trend çıkarmaya çalışma. Fiyat hâlâ iki sınır arasında olabilir.', 'Do not try to read a new trend from every small move in the middle. Price may still be inside the same range.'),
    takeaway: p('Yatay aralıkta önce üst ve alt sınırları gör; ortadaki küçük hareketlere gereğinden fazla anlam yükleme.', 'In a range, identify the upper and lower areas first and avoid overreading small moves in the middle.'),
    visualAlt: p('Fiyatın üst ve alt iki tepki bölgesi arasında tekrar gidip geldiğini gösteren sade yatay aralık grafiği', 'Simple range chart showing price repeatedly moving between upper and lower reaction areas'),
    taskPrompt: p('Yatay aralığı en iyi hangi iki bölge tanımlar?', 'Which two areas best define a price range?'),
    taskCorrect: [p('Fiyatın tekrar tekrar döndüğü üst bölge', 'The upper area where price repeatedly turns'), p('Fiyatın tekrar tekrar destek bulduğu alt bölge', 'The lower area where price repeatedly finds support')],
    taskIncorrect: [p('Aralığın rastgele orta noktası', 'A random point in the middle of the range')],
    questions: [
      { prompt: p('Fiyat net yön kurmadan iki bölge arasında gidip geliyorsa ne görüyorsun?', 'What are you seeing when price moves between two areas without a clear direction?'), correct: p('Yatay aralık (range)', 'A price range'), incorrect: [p('Kesin güçlü trend', 'A certain strong trend'), p('Fiyatın tamamen durması', 'Price stopping completely')], explanation: p('Range, fiyatın belirgin yön ilerlemesi kurmadan iki tepki bölgesi arasında hareket etmesidir.', 'A range is price moving between two reaction areas without clear directional progress.') },
      { prompt: p('Aralığın ortasındaki küçük hareketler neden yanıltıcı olabilir?', 'Why can small moves in the middle of a range be misleading?'), correct: p('Net bir yön değişimi göstermeyebilirler', 'They may not show a clear directional change'), incorrect: [p('Her zaman yeni trend başlattıkları için', 'Because they always start a new trend'), p('Fiyat ortada hiç hareket etmediği için', 'Because price never moves in the middle')], explanation: p('Aralığın ortasında fiyat iki sınır arasında gidip gelirken yön sinyali daha zayıf olabilir.', 'Directional information can be weaker while price moves between the two boundaries.') },
      { prompt: p('Aralık sınırı aşılırsa yeni trend kesinleşir mi?', 'Does crossing a range boundary guarantee a new trend?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, her zaman', 'Yes, always'), p('Yalnız üst sınırda kesinleşir', 'It is guaranteed only at the upper boundary')], explanation: p('Sınırın aşılması başlangıç olabilir; fiyatın dışarıda kalıp kalamadığı yine önemlidir.', 'Crossing the boundary may be a start; whether price can remain outside still matters.') },
    ],
  },
};

function replaceNormal<T extends { normal: LocalizedText; pro?: LocalizedText }>(copy: T, value: CopyPair): T {
  return { ...copy, normal: localized(value) };
}

export function normalizeAcademyTechnicalEditorial(lesson: MicroLesson): MicroLesson {
  const copy = COPY[lesson.id];
  if (!copy) return lesson;

  const contentBlocks = lesson.contentBlocks.map((block) => {
    if (block.kind === 'prompt') return { ...block, copy: replaceNormal(block.copy, copy.hook) };
    if (block.kind === 'explanation') return { ...block, copy: replaceNormal(block.copy, copy.explanation) };
    if (block.kind === 'misconception') return { ...block, copy: replaceNormal(block.copy, copy.misconception) };
    if (block.kind === 'visual') return { ...block, alt: localized(copy.visualAlt) };
    return block;
  });

  const taskCorrectIds = new Set(lesson.practicalTask.expectedEvidence);
  let correctTaskIndex = 0;
  let incorrectTaskIndex = 0;
  const taskChoices = lesson.practicalTask.choices?.map((choice) => {
    const correct = taskCorrectIds.has(choice.id);
    const pool = correct ? copy.taskCorrect : copy.taskIncorrect;
    const index = correct ? correctTaskIndex++ : incorrectTaskIndex++;
    return { ...choice, label: localized(pool[index % pool.length]) };
  });

  const questions = lesson.quiz.questions.map((question, questionIndex) => {
    const questionCopy = copy.questions[questionIndex];
    let incorrectIndex = 0;
    return {
      ...question,
      prompt: localized(questionCopy.prompt),
      options: question.options.map((option) => ({
        ...option,
        label: localized(
          option.id === question.correctOptionId
            ? questionCopy.correct
            : questionCopy.incorrect[(incorrectIndex++) % questionCopy.incorrect.length],
        ),
      })),
      explanation: localized(questionCopy.explanation),
    };
  });

  return microLessonSchema.parse({
    ...lesson,
    title: localized(copy.title),
    learningObjective: localized(copy.objective),
    contentBlocks,
    takeaway: localized(copy.takeaway),
    practicalTask: {
      ...lesson.practicalTask,
      prompt: replaceNormal(lesson.practicalTask.prompt, copy.taskPrompt),
      ...(taskChoices ? { choices: taskChoices } : {}),
    },
    quiz: { ...lesson.quiz, questions },
  });
}
