import { getContentQualitySnapshot } from '../src/domain/learning/contentQuality';

const snapshot = getContentQualitySnapshot();
const { assessment, curriculumOverlap, english, visualCoverage } = snapshot;

console.log('FINM8 EDU content quality audit');
console.log(`lessons: ${curriculumOverlap.lessonCount}`);
console.log(`english complete: ${english.completeLessons}/${english.totalLessons}`);
console.log(`assessment low-signal issues: ${assessment.lowSignalIssues.length}`);
console.log(`duplicate quiz prompt groups: ${assessment.duplicatePromptGroups.length}`);
console.log(`concept reuse groups: ${curriculumOverlap.conceptReuseGroups.length}`);
console.log(`exact duplicate lesson surfaces: ${curriculumOverlap.exactSurfaceGroups.length}`);
console.log(`near-duplicate lesson pairs: ${curriculumOverlap.nearDuplicatePairs.length}`);
console.log(`visual anchors: ${visualCoverage.lessonsWithAnyVisualAnchor}/${visualCoverage.totalLessons}`);

if (curriculumOverlap.nearDuplicatePairs.length > 0) {
  console.log('Top near-duplicate lesson pairs:');
  for (const pair of curriculumOverlap.nearDuplicatePairs.slice(0, 10)) {
    console.log(
      `- ${pair.lessonIdA} <-> ${pair.lessonIdB}: ${pair.similarity} (${pair.sharesConceptKey ? 'shared concept' : 'different concepts'})`,
    );
  }
}

if (english.incompleteLessons.length > 0) {
  console.log(`English editorial pending lessons: ${english.incompleteLessons.length}`);
}

const blockers: string[] = [];

if (curriculumOverlap.exactSurfaceGroups.length > 0) {
  for (const group of curriculumOverlap.exactSurfaceGroups) {
    blockers.push(
      `exact duplicate ${group.field}: ${group.lessonIds.join(', ')} -> ${group.text}`,
    );
  }
}

if (visualCoverage.lessonsWithoutAnyVisualAnchor.length > 0) {
  for (const lesson of visualCoverage.lessonsWithoutAnyVisualAnchor) {
    blockers.push(`lesson has no visual anchor: ${lesson.lessonId} -> ${lesson.title}`);
  }
}

if (blockers.length > 0) {
  throw new Error(`Content quality blockers:\n${blockers.map((blocker) => `- ${blocker}`).join('\n')}`);
}

console.log('content quality blockers: 0');
