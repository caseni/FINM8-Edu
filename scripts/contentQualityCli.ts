import { getBeginnerJourneyQualityReport } from '../src/domain/learning/beginnerJourneyQuality';
import { getContentQualitySnapshot } from '../src/domain/learning/contentQuality';

const snapshot = getContentQualitySnapshot();
const beginnerJourney = getBeginnerJourneyQualityReport();
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
console.log(`beginner sections: ${beginnerJourney.sectionCount}/4`);
console.log(`beginner lessons: ${beginnerJourney.lessonCount}/${beginnerJourney.expectedLessonCount}`);
console.log(`beginner journey issues: ${beginnerJourney.issues.length}`);

const topThinLessons = editorialDepth.thinTeachingLessons
  .slice(0, 5)
  .map((lesson) => `${lesson.lessonId}(${lesson.teachingWordCount})`)
  .join(', ') || 'none';
const topTerseQuiz = editorialDepth.terseQuizExplanations
  .slice(0, 5)
  .map((item) => `${item.questionId}(${item.wordCount})`)
  .join(', ') || 'none';
console.log(
  `::notice title=Editorial depth summary::missing explanation=${editorialDepth.lessonsWithoutExplanation.length}; missing misconception=${editorialDepth.lessonsWithoutMisconception.length}; thin teaching=${editorialDepth.thinTeachingLessons.length}; terse quiz explanations=${editorialDepth.terseQuizExplanations.length}; duplicate task prompts=${editorialDepth.duplicateTaskPromptGroups.length}; duplicate quiz explanations=${editorialDepth.duplicateQuizExplanationGroups.length}; thinnest=${topThinLessons}; tersest=${topTerseQuiz}`,
);

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

if (beginnerJourney.issues.length > 0) {
  console.log('Beginner journey quality issues:');
  for (const issue of beginnerJourney.issues) {
    console.log(`- ${issue.lessonId}: ${issue.reason} -> ${issue.detail}`);
  }
}

const blockers: string[] = [];

if (english.incompleteLessons.length > 0) {
  blockers.push(`English editorial coverage incomplete for ${english.incompleteLessons.length} lesson(s)`);
}

if (assessment.lowSignalIssues.length > 0) {
  blockers.push(`low-signal assessment issues: ${assessment.lowSignalIssues.length}`);
}

if (assessment.duplicatePromptGroups.length > 0) {
  blockers.push(`duplicate quiz prompt groups: ${assessment.duplicatePromptGroups.length}`);
}

if (curriculumOverlap.exactSurfaceGroups.length > 0) {
  for (const group of curriculumOverlap.exactSurfaceGroups) {
    blockers.push(
      `exact duplicate ${group.field}: ${group.lessonIds.join(', ')} -> ${group.text}`,
    );
  }
}

if (curriculumOverlap.nearDuplicatePairs.length > 0) {
  blockers.push(`near-duplicate lesson pairs: ${curriculumOverlap.nearDuplicatePairs.length}`);
}

if (visualCoverage.lessonsWithoutAnyVisualAnchor.length > 0) {
  for (const lesson of visualCoverage.lessonsWithoutAnyVisualAnchor) {
    blockers.push(`lesson has no visual anchor: ${lesson.lessonId} -> ${lesson.title}`);
  }
}

if (editorialDepth.lessonsWithoutExplanation.length > 0) {
  blockers.push(`lessons without explanation blocks: ${editorialDepth.lessonsWithoutExplanation.length}`);
}

if (editorialDepth.lessonsWithoutMisconception.length > 0) {
  blockers.push(`lessons without misconception blocks: ${editorialDepth.lessonsWithoutMisconception.length}`);
}

if (editorialDepth.thinTeachingLessons.length > 0) {
  blockers.push(`thin teaching lessons: ${editorialDepth.thinTeachingLessons.length}`);
}

if (editorialDepth.terseQuizExplanations.length > 0) {
  blockers.push(`terse quiz explanations: ${editorialDepth.terseQuizExplanations.length}`);
}

if (editorialDepth.duplicateTaskPromptGroups.length > 0) {
  blockers.push(`duplicate practical-task prompt groups: ${editorialDepth.duplicateTaskPromptGroups.length}`);
}

if (editorialDepth.duplicateQuizExplanationGroups.length > 0) {
  blockers.push(`duplicate quiz-explanation groups: ${editorialDepth.duplicateQuizExplanationGroups.length}`);
}

if (beginnerJourney.sectionCount !== 4) {
  blockers.push(`beginner section count drifted: ${beginnerJourney.sectionCount}`);
}

if (beginnerJourney.lessonCount !== beginnerJourney.expectedLessonCount) {
  blockers.push(`beginner lesson count drifted: ${beginnerJourney.lessonCount}/${beginnerJourney.expectedLessonCount}`);
}

if (beginnerJourney.issues.length > 0) {
  blockers.push(`beginner journey quality issues: ${beginnerJourney.issues.length}`);
}

if (blockers.length > 0) {
  throw new Error(`Content quality blockers:\n${blockers.map((blocker) => `- ${blocker}`).join('\n')}`);
}

console.log('content quality blockers: 0');
