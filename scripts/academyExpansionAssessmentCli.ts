import { getAcademyExpansionAssessmentReport } from '../src/domain/learning/academyExpansionAssessmentGuard';

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
  throw new Error(`Academy expansion assessment issues: ${report.issues.length}`);
}

console.log('academy expansion assessment issues: 0');
