import { ACADEMY_TRACK_IDS, ACADEMY_TRACKS } from '../src/domain/learning/academyTracks';
import { MICRO_LESSON_CATALOG } from '../src/domain/learning/catalog';
import type { ContentBlock, MicroLesson } from '../src/domain/learning/types';

interface PublicBlock {
  readonly kind: string;
  readonly text: string;
}

function publicBlock(block: ContentBlock): PublicBlock | undefined {
  if (block.audience === 'pro') return undefined;

  if (block.kind === 'visual') {
    return { kind: 'visual', text: block.alt.tr };
  }

  if (block.kind === 'bullet_list') {
    const title = block.title?.normal.tr;
    const items = block.items.map((item) => item.normal.tr);
    return {
      kind: 'bullet_list',
      text: [title, ...items].filter(Boolean).join(' · '),
    };
  }

  return { kind: block.kind, text: block.copy.normal.tr };
}

function publicLesson(lesson: MicroLesson, trackId: string) {
  return {
    id: lesson.id,
    slug: lesson.slug,
    trackId,
    title: lesson.title.tr,
    titleEn: lesson.title.en,
    description: lesson.learningObjective.tr,
    descriptionEn: lesson.learningObjective.en,
    takeaway: lesson.takeaway.tr,
    takeawayEn: lesson.takeaway.en,
    learningStage: lesson.learningStage,
    estimatedMinutes: lesson.estimatedMinutes,
    blocks: lesson.contentBlocks
      .map(publicBlock)
      .filter((block): block is PublicBlock => Boolean(block)),
    sources: lesson.sources.map((source) => ({
      title: source.title,
      publisher: source.publisher,
    })),
  };
}

const academyTrackByLessonId = new Map<string, string>();
for (const trackId of ACADEMY_TRACK_IDS) {
  for (const lessonId of ACADEMY_TRACKS[trackId].lessonIds) {
    academyTrackByLessonId.set(lessonId, trackId);
  }
}

const lessons = MICRO_LESSON_CATALOG
  .filter((lesson) => lesson.accessTier === 'free')
  .map((lesson) => publicLesson(lesson, academyTrackByLessonId.get(lesson.id) ?? 'core'));

const lessonsByTrack = new Map<string, typeof lessons>();
for (const lesson of lessons) {
  const current = lessonsByTrack.get(lesson.trackId) ?? [];
  current.push(lesson);
  lessonsByTrack.set(lesson.trackId, current);
}

const sections = [
  {
    id: 'core',
    order: 0,
    title: 'FINM8 Core',
    description: 'Fiyat, grafik, risk ve karar kalitesini oluşturan temel öğrenme yolu.',
    lessonSlugs: (lessonsByTrack.get('core') ?? []).map((lesson) => lesson.slug),
  },
  ...ACADEMY_TRACK_IDS.map((trackId) => ({
    id: trackId,
    order: ACADEMY_TRACKS[trackId].order,
    title: ACADEMY_TRACKS[trackId].title.tr,
    description: ACADEMY_TRACKS[trackId].description.tr,
    lessonSlugs: (lessonsByTrack.get(trackId) ?? []).map((lesson) => lesson.slug),
  })),
];

const slugs = lessons.map((lesson) => lesson.slug);
if (new Set(slugs).size !== slugs.length) {
  throw new Error('Public Learn export requires globally unique lesson slugs.');
}

console.log(JSON.stringify({
  version: 1,
  canonicalLanguage: 'tr',
  lessonCount: lessons.length,
  sections,
  lessons,
}, null, 2));
