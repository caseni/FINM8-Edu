import { getAcademyExpansionAssessmentReport } from '../src/domain/learning/academyExpansionAssessmentGuard';
import { MICRO_LESSON_CATALOG } from '../src/domain/learning/catalog';

const report = getAcademyExpansionAssessmentReport();

console.log('FINM8 EDU Academy expansion assessment audit');
console.log(`academy expansion assessment: ${report.expansionLessonCount} lessons, ${report.questionCount} questions, ${report.issues.length} issues`);

if (report.issues.length > 0) {
  console.log('Academy expansion assessment issues:');
  for (const issue of report.issues) {
    console.log(
      `- [${issue.reason}] ${issue.trackId} ${issue.lessonId} ${issue.targetId} (${issue.optionId}): ${issue.detail}`,
    );
  }

  const catalogById = new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson]));
  const renderedTargets = new Set(report.issues.map((issue) => `${issue.lessonId}::${issue.targetId}`));
  console.log('Rendered contexts for remaining Academy expansion assessment issues:');
  for (const key of renderedTargets) {
    const [lessonId, targetId] = key.split('::');
    const lesson = catalogById.get(lessonId);
    if (!lesson) continue;
    const question = lesson.quiz.questions.find((item) => item.id === targetId);
    if (question) {
      console.log(`CONTEXT ${lessonId} ${targetId}`);
      console.log(`TR STEM: ${question.prompt.tr}`);
      console.log(`EN STEM: ${question.prompt.en ?? ''}`);
      console.log(`CORRECT: ${question.correctOptionId}`);
      for (const option of question.options) {
        console.log(`OPT ${option.id} TR: ${option.label.tr}`);
        console.log(`OPT ${option.id} EN: ${option.label.en ?? ''}`);
      }
      console.log(`TR EXPL: ${question.explanation.tr}`);
      console.log(`EN EXPL: ${question.explanation.en ?? ''}`);
      continue;
    }
    if (lesson.practicalTask.id === targetId) {
      console.log(`CONTEXT ${lessonId} ${targetId}`);
      console.log(`TR STEM: ${lesson.practicalTask.prompt.tr}`);
      console.log(`EN STEM: ${lesson.practicalTask.prompt.en ?? ''}`);
      console.log(`EVIDENCE: ${lesson.practicalTask.expectedEvidence.join(',')}`);
      for (const choice of lesson.practicalTask.choices ?? []) {
        console.log(`OPT ${choice.id} TR: ${choice.label.tr}`);
        console.log(`OPT ${choice.id} EN: ${choice.label.en ?? ''}`);
      }
    }
  }

  throw new Error(`Academy expansion assessment issues: ${report.issues.length}`);
}

console.log('academy expansion assessment issues: 0');
