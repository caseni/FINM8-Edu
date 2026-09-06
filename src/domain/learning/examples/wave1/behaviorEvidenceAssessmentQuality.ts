import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
}

const copy = (tr: string): LocalizedText => ({ tr });

const BEHAVIOR_EVIDENCE_ASSESSMENT_OVERRIDES: Readonly<
  Record<string, AssessmentCopyOverride>
> = {
  'lesson.behavior.fomo.001': {
    questionOptions: {
      'question.fomo-karari-nasil-bozar.1': {
        b: copy('Yoğun aciliyet hissini piyasa kanıtı gibi yorumlamak'),
        c: copy('Plan dışına çıkmayı fiyat hareketiyle haklı çıkarmak'),
      },
      'question.fomo-karari-nasil-bozar.2': {
        b: copy('Fiyat yükselmeye devam ettiği sürece bekleme kuralını kaldırmak'),
        c: copy('Başkalarının işlemlerini görüp kendi kriterini esnetmek'),
      },
      'question.fomo-karari-nasil-bozar.3': {
        b: copy('Piyasa yönüyle uyumlu bir sinyal olduğunu'),
        c: copy('Fırsat penceresinin kapanmak üzere olduğunu'),
      },
    },
  },
  'lesson.behavior.overtrading.001': {
    questionOptions: {
      'question.asiri-islem-nasil-fark-edilir.1': {
        b: copy('İşlem sayısının tek başına yüksek olmasını'),
        c: copy('Aynı planın farklı günlerde yeniden uygulanmasını'),
      },
      'question.asiri-islem-nasil-fark-edilir.2': {
        b: copy('Piyasa hakkındaki bilgi miktarını otomatik olarak'),
        c: copy('Her yeni işlemin karar kalitesini otomatik olarak'),
      },
    },
  },
  'lesson.behavior.confirmation-bias.001': {
    questionOptions: {
      'question.sadece-hakli-cikaran-kanit.2': {
        b: copy('Tezimi başka hangi kaynaklar destekliyor?'),
        c: copy('Aynı görüşteki kaynakların sayısı kaç?'),
      },
      'question.sadece-hakli-cikaran-kanit.3': {
        b: copy('Kaynak sayısı fazlaysa çoğu zaman evet'),
        c: copy('Hesaplar farklı platformlardaysa evet'),
      },
    },
  },
  'lesson.evidence.data-quality.001': {
    questionOptions: {
      'question.her-veri-ayni-kalitede-degildir.1': {
        b: copy('Sayının daha çok ondalık basamak içermesi'),
        c: copy('Kaynağın çok kişi tarafından takip edilmesi'),
      },
      'question.her-veri-ayni-kalitede-degildir.2': {
        b: copy('Olumlu kanıt yoksa otomatik olarak olumsuz sayılarak'),
        c: copy('En yakın tahminle doldurularak'),
      },
      'question.her-veri-ayni-kalitede-degildir.3': {
        b: copy('Kaynak güvenilir ve değer çok hassassa evet'),
        c: copy('Aynı sayı birden fazla ekranda görünüyorsa evet'),
      },
    },
  },
  'lesson.evidence.freshness.001': {
    taskChoices: {
      logo: copy('Kaynağın ne sıklıkta yayın yaptığı'),
      followers: copy('Verinin kaç farklı hesap tarafından paylaşıldığı'),
    },
    questionOptions: {
      'question.dogru-veri-ne-zaman-eskir.1': {
        b: copy('Yalnız verinin üretildiği takvim tarihine'),
        c: copy('Yalnız kaynağın güvenilirliğine'),
      },
      'question.dogru-veri-ne-zaman-eskir.2': {
        b: copy('Kaynak güvenilir ise zaman etiketi olmadan'),
        c: copy('Son değerle farkı küçükse güncel veri gibi'),
      },
      'question.dogru-veri-ne-zaman-eskir.3': {
        b: copy('Kaynak sık güncelleniyorsa evet'),
        c: copy('Aynı veri birden fazla yerde görünüyorsa evet'),
      },
    },
  },
  'lesson.behavior.decision-journal.001': {
    questionOptions: {
      'question.sonucu-degil-karari-kaydet.1': {
        b: copy('Kararın kurallara uygun yürütüldüğünü'),
        c: copy('Aynı kararın tekrar iyi sonuç vereceğini'),
      },
      'question.sonucu-degil-karari-kaydet.2': {
        b: copy('Gözlemi sonuçtan sonra yeniden yorumlayabilmek için'),
        c: copy('Yorumun gözlemle aynı şey olduğunu göstermek için'),
      },
    },
  },
};

export function normalizeBehaviorEvidenceAssessmentQuality(
  lesson: MicroLesson,
): MicroLesson {
  const override = BEHAVIOR_EVIDENCE_ASSESSMENT_OVERRIDES[lesson.id];
  if (!override) return lesson;

  const practicalTask =
    override.taskChoices && lesson.practicalTask.choices
      ? {
          ...lesson.practicalTask,
          choices: lesson.practicalTask.choices.map((choice) => ({
            ...choice,
            label: override.taskChoices?.[choice.id] ?? choice.label,
          })),
        }
      : lesson.practicalTask;

  const questions = lesson.quiz.questions.map((question) => {
    const optionOverrides = override.questionOptions?.[question.id];
    if (!optionOverrides) return question;

    return {
      ...question,
      options: question.options.map((option) => ({
        ...option,
        label: optionOverrides[option.id] ?? option.label,
      })),
    };
  });

  return microLessonSchema.parse({
    ...lesson,
    practicalTask,
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
