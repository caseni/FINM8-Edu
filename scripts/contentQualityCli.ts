import { getContentQualitySnapshot } from '../src/domain/learning/contentQuality';

const snapshot = getContentQualitySnapshot();
const { assessment, curriculumOverlap, editorialDepth, english, visualCoverage } = snapshot;

console.log('FINM8 EDU content quality audit');
console.log(`lessons: ${curriculumOverlap.lessonCount}`);
console.log(`english complete: ${english.completeLessons}/${english.totalLessons}`);
console.log(`assessment low-signal issues: ${assessment.lowSignalIssues.length}`);
console.log(`duplicate quiz prompt groups: ${assessment.duplicatePromptGroups.length}`);
console.log(`concept reuse groups: ${curriculumOverlap.conceptReuseGroups.length}`);
console.log(`exact duplicate lesson surfaces: ${curriculumOverlap.exactSurfaceGroups.length}`);
console.log(`near-duplicate lesson pairs: ${curriculumOverlap.nearDuplicatePairs.length}`);
console.log(`visual anchors: ${visualCoverage.lessonsWithAnyVisualAnchor}/${visualCoverage.totalLessons}`);
console.log(`editorial missing explanation blocks: ${editorialDepth.lessonsWithoutExplanation.length}`);
console.log(`editorial missing misconception blocks: ${editorialDepth.lessonsWithoutMisconception.length}`);
console.log(`editorial thin teaching lessons: ${editorialDepth.thinTeachingLessons.length}`);
console.log(`editorial terse quiz explanations: ${editorialDepth.terseQuizExplanations.length}`);
console.log(`duplicate practical-task prompt groups: ${editorialDepth.duplicateTaskPromptGroups.length}`);
console.log(`duplicate quiz-explanation groups: ${editorialDepth.duplicateQuizExplanationGroups.length}`);

if (assessment.lowSignalIssues.length > 0) {
  const issueCountsByLesson = new Map<string, { total: number; binary: number; trivial: number }>();
  for (const issue of assessment.lowSignalIssues) {
    const current = issueCountsByLesson.get(issue.lessonId) ?? { total: 0, binary: 0, trivial: 0 };
    current.total += 1;
    if (issue.reason === 'low_signal_binary') current.binary += 1;
    if (issue.reason === 'trivial_distractor') current.trivial += 1;
    issueCountsByLesson.set(issue.lessonId, current);
  }

  console.log('Assessment quality debt by lesson:');
  for (const [lessonId, counts] of Array.from(issueCountsByLesson.entries()).sort(
    (left, right) => right[1].total - left[1].total || left[0].localeCompare(right[0]),
  )) {
    console.log(
      `- ${lessonId}: ${counts.total} (binary=${counts.binary}, trivial=${counts.trivial})`,
    );
  }
}

if (assessment.duplicatePromptGroups.length > 0) {
  console.log('Duplicate quiz prompt groups:');
  for (const group of assessment.duplicatePromptGroups) {
    console.log(`- ${group.questionIds.join(', ')} -> ${group.prompt}`);
  }
}

if (curriculumOverlap.nearDuplicatePairs.length > 0) {
  console.log('Top near-duplicate lesson pairs:');
  for (const pair of curriculumOverlap.nearDuplicatePairs.slice(0, 10)) {
    console.log(
      `- ${pair.lessonIdA} <-> ${pair.lessonIdB}: ${pair.similarity} (${pair.sharesConceptKey ? 'shared concept' : 'different concepts'})`,
    );
  }
}

if (english.incompleteLessons.length > 0) {
  console.log('English editorial pending lessons:');
  for (const lesson of english.incompleteLessons) {
    console.log(`- ${lesson.lessonId}: ${lesson.missingFields.length} missing fields`);
  }
}

if (editorialDepth.lessonsWithoutExplanation.length > 0) {
  console.log(`Lessons without an explanation block: ${editorialDepth.lessonsWithoutExplanation.join(', ')}`);
}

if (editorialDepth.lessonsWithoutMisconception.length > 0) {
  console.log(`Lessons without a misconception block: ${editorialDepth.lessonsWithoutMisconception.join(', ')}`);
}

if (editorialDepth.thinTeachingLessons.length > 0) {
  console.log('Thinnest teaching lessons:');
  for (const lesson of editorialDepth.thinTeachingLessons.slice(0, 20)) {
    console.log(`- ${lesson.lessonId}: ${lesson.teachingWordCount} words -> ${lesson.title}`);
  }
}

if (editorialDepth.terseQuizExplanations.length > 0) {
  console.log('Terse quiz explanations:');
  for (const item of editorialDepth.terseQuizExplanations.slice(0, 30)) {
    console.log(`- ${item.lessonId}/${item.questionId}: ${item.wordCount} words -> ${item.explanation}`);
  }
}

if (editorialDepth.duplicateTaskPromptGroups.length > 0) {
  console.log('Duplicate practical-task prompt groups:');
  for (const group of editorialDepth.duplicateTaskPromptGroups.slice(0, 15)) {
    console.log(`- ${group.lessonIds.join(', ')} -> ${group.prompt}`);
  }
}

if (editorialDepth.duplicateQuizExplanationGroups.length > 0) {
  console.log('Duplicate quiz-explanation groups:');
  for (const group of editorialDepth.duplicateQuizExplanationGroups.slice(0, 15)) {
    console.log(`- ${group.questionIds.join(', ')} -> ${group.explanation}`);
  }
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
