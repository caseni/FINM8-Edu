import { getAcademyExpansionAssessmentReport } from '../src/domain/learning/academyExpansionAssessmentGuard';

const report = getAcademyExpansionAssessmentReport();

console.log('FINM8 EDU Academy expansion assessment audit');
console.log(`academy expansion assessment: ${report.expansionLessonCount} lessons, ${report.questionCount} questions, ${report.issues.length} issues`);

if (report.coverageIssues.length > 0) {
  console.log('Academy expansion assessment coverage issues:');
  for (const issue of report.coverageIssues) {
    console.log(`- ${issue}`);
  }
}

if (report.issues.length > 0) {
  console.log('Academy expansion assessment issues:');
  for (const issue of report.issues) {
    console.log(
      `- [${issue.reason}] ${issue.trackId} ${issue.lessonId} ${issue.targetId} (${issue.optionId}): ${issue.detail}`,
    );
  }
}

if (report.coverageIssues.length > 0 || report.issues.length > 0) {
  throw new Error(
    `Academy expansion assessment failed: ${report.coverageIssues.length} coverage issues, ${report.issues.length} content issues`,
  );
}

console.log('academy expansion assessment coverage: 60 lessons, 180 questions');
console.log('academy expansion assessment issues: 0');
