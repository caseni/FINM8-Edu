import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function requireSource(source, expected, label) {
  if (!source.includes(expected)) {
    throw new Error(`${label}: missing required accessibility contract -> ${expected}`);
  }
}

const landingPath = 'src/screens/learn/LearnLandingScreen.tsx';
const beginnerSectionPath = 'src/screens/learn/BeginnerSectionScreen.tsx';
const reviewPath = 'src/screens/learn/LearningReviewScreen.tsx';
const challengePath = 'src/screens/learn/LearningChallengeScreen.tsx';
const lessonQuizPath = 'src/screens/learn/LessonQuizScreen.tsx';
const lessonPlayerPath = 'src/components/learning/LessonPlayer.tsx';
const languageSwitchPath = 'src/components/learning/LearningLanguageSwitch.tsx';
const beginnerTaskPlayerPath = 'src/components/learning/BeginnerPracticalTaskPlayer.tsx';
const academyTaskPlayerPath = 'src/components/learning/PracticalTaskPlayer.tsx';
const academyQuizPlayerPath = 'src/components/learning/QuizPlayer.tsx';
const landing = read(landingPath);
const beginnerSection = read(beginnerSectionPath);
const review = read(reviewPath);
const challenge = read(challengePath);
const lessonQuiz = read(lessonQuizPath);
const lessonPlayer = read(lessonPlayerPath);
const languageSwitch = read(languageSwitchPath);
const beginnerTaskPlayer = read(beginnerTaskPlayerPath);
const academyTaskPlayer = read(academyTaskPlayerPath);
const academyQuizPlayer = read(academyQuizPlayerPath);

for (const [expected, label] of [
  ['<LearningLanguageSwitch />', 'Beginner landing language switch'],
  ['const sectionAccessibilityLabel = language === \'tr\'', 'Beginner landing contextual status'],
  ['`${sectionTitle}. ${status}. ${completedCount}/${section.lessonIds.length} ders, yüzde ${progressPercent}.`', 'Beginner landing progress label'],
  ['accessibilityLabel={sectionAccessibilityLabel}', 'Beginner landing card label'],
  ['accessibilityState={active ? undefined : { disabled: true }}', 'Beginner landing disabled state'],
  ['Temel okuryazarlık yolu tamamlandı. 24/24 ders tamamlandı.', 'Beginner landing completion summary'],
  ['İleri öğrenme yoluna geç', 'Beginner landing completion action'],
]) {
  requireSource(landing, expected, label);
}

for (const [expected, label] of [
  ["type SupportedLearningLanguage = 'tr' | 'en';", 'Learning language supported set'],
  ['accessibilityRole="toolbar"', 'Learning language toolbar semantics'],
  ['accessibilityRole="button"', 'Learning language button semantics'],
  ['accessibilityState={{ selected }}', 'Learning language selected state'],
  ['onPress={() => void setLanguage(option.id)}', 'Learning language persisted selection'],
  ['Öğrenme dili', 'Learning language Turkish toolbar label'],
  ['Learning language', 'Learning language English toolbar label'],
]) {
  requireSource(languageSwitch, expected, label);
}

for (const [expected, label] of [
  ['const sectionProgressAccessibilityLabel = language === \'tr\'', 'Beginner section progress summary'],
  ['accessibilityLabel={sectionProgressAccessibilityLabel}', 'Beginner section hero summary'],
  ['accessibilityLabel={`${lessonTitle}. ${lessonState}.`}', 'Beginner lesson contextual state'],
  ['`${sectionTitle} bölümü tamamlandı. 6/6 ders.`', 'Beginner section completion summary'],
  ['`Sıradaki bölüme geç: ${nextSection.title.tr}`', 'Beginner next-section action context'],
]) {
  requireSource(beginnerSection, expected, label);
}

for (const [expected, label] of [
  ['const stepAccessibilityLabel = language === \'tr\'', 'Lesson step contextual announcement'],
  ["const lessonTitleSeparator = /[.!?]$/.test(lessonTitle.trim()) ? ' ' : '. ';", 'Lesson step punctuation normalization'],
  ['`${lessonTitle}${lessonTitleSeparator}Adım ${stepIndex + 1}/${totalSteps}.`', 'Lesson step Turkish context'],
  ['accessible={true}', 'Lesson step explicit accessibility element'],
  ['accessibilityRole="summary"', 'Lesson step summary semantics'],
  ['accessibilityLabel={stepAccessibilityLabel}', 'Lesson step label binding'],
  ['accessibilityLiveRegion="polite"', 'Lesson step live announcement'],
  ['role="progressbar"', 'Lesson step web progress semantics'],
  ['aria-valuemin={0}', 'Lesson progress web minimum'],
  ['aria-valuemax={totalSteps}', 'Lesson progress web maximum'],
  ['aria-valuenow={stepIndex + 1}', 'Lesson progress web current value'],
  ['accessibilityRole="progressbar"', 'Lesson step native progress semantics'],
  ['accessibilityValue={{ min: 0, max: totalSteps, now: stepIndex + 1 }}', 'Lesson progress native value'],
]) {
  requireSource(lessonPlayer, expected, label);
}

for (const [expected, label] of [
  ['accessibilityLabel={language === \'tr\' ? \'M8 Learn’e dön\' : \'Return to M8 Learn\'}', 'Review back control'],
  ['accessibilityState={{ selected: presentationMode === mode }}', 'Review presentation mode state'],
  ['accessibilityState={{ expanded }}', 'Review module expanded state'],
  ['`${lessonTitle} slayt önizlemesi`', 'Review lesson slide context'],
  ['`${lessonTitle} görev önizlemesi`', 'Review lesson task context'],
  ['`${lessonTitle} quiz önizlemesi`', 'Review lesson quiz context'],
  ['challenge önizlemesini aç', 'Review challenge context'],
]) {
  requireSource(review, expected, label);
}

for (const [expected, label] of [
  ['const resultAccessibilityLabel = passed', 'Challenge result summary label'],
  ['accessibilityRole="summary"', 'Challenge summary semantics'],
  ['accessibilityLiveRegion="polite"', 'Challenge live result announcement'],
  ['accessibilityState={{ disabled: missingLessonCount > 0 }}', 'Challenge locked state'],
  ['accessibilityLabel={startLabel}', 'Challenge start action context'],
  ['accessibilityLabel={resultPrimaryLabel}', 'Challenge result action context'],
  ['minHeight: 52', 'Challenge primary touch target'],
  ['minHeight: 44', 'Challenge secondary touch target'],
]) {
  requireSource(challenge, expected, label);
}

for (const [expected, label] of [
  ['const resultAccessibilityLabel = showAcademyTrackCompletion', 'Lesson quiz result summary label'],
  ['accessibilityLabel={resultAccessibilityLabel}', 'Lesson quiz result label binding'],
  ['accessibilityLiveRegion="polite"', 'Lesson quiz live result announcement'],
  ['Quiz tamamlandı. Skor yüzde', 'Lesson quiz passed summary'],
  ['Quiz henüz tamamlanmadı. Skor yüzde', 'Lesson quiz failed summary'],
  ['Tekrar tamamlandı. Skor yüzde', 'Lesson review passed summary'],
  ['Tekrar henüz tamamlanmadı. Skor yüzde', 'Lesson review failed summary'],
  ['Geçme eşiği yüzde ${lesson.quiz.passingScore}', 'Lesson quiz passing threshold context'],
]) {
  requireSource(lessonQuiz, expected, label);
}

for (const [expected, label] of [
  ['const feedbackAccessibilityLabel = passed', 'Beginner task feedback summary label'],
  ['accessibilityLabel={feedbackAccessibilityLabel}', 'Beginner task feedback label binding'],
  ['accessibilityLiveRegion="polite"', 'Beginner task live feedback announcement'],
  ['Doğru. Seçimin senaryodaki kanıtlarla uyumlu.', 'Beginner task correct feedback context'],
  ['Henüz değil. Senaryodaki ipuçlarını birlikte değerlendir.', 'Beginner task retry feedback context'],
  ['İpucu: ${takeawayText}', 'Beginner task retry hint context'],
]) {
  requireSource(beginnerTaskPlayer, expected, label);
}

for (const [expected, label] of [
  ['const feedbackLabel = passed', 'Academy task feedback summary label'],
  ['accessibilityLabel={feedbackLabel}', 'Academy task feedback label binding'],
  ['accessibilityLiveRegion="polite"', 'Academy task live feedback announcement'],
  ['Doğru. Seçimin senaryodaki kanıtlarla uyumlu.', 'Academy task correct feedback context'],
  ['Henüz değil. Senaryodaki ipuçlarını birlikte değerlendir.', 'Academy task retry feedback context'],
]) {
  requireSource(academyTaskPlayer, expected, label);
}

for (const [expected, label] of [
  ['const feedbackAccessibilityLabel = selectedIsCorrect', 'Academy quiz feedback summary label'],
  ['accessibilityLabel={feedbackAccessibilityLabel}', 'Academy quiz feedback label binding'],
  ['accessibilityLiveRegion="polite"', 'Academy quiz live feedback announcement'],
  ['Doğru. Neden: ${explanation}', 'Academy quiz correct feedback context'],
  ['Bu kez değil. Senin seçimin:', 'Academy quiz retry feedback context'],
  ['Doğru cevap:', 'Academy quiz correct-answer context'],
]) {
  requireSource(academyQuizPlayer, expected, label);
}

const contextualReviewActions = (review.match(/accessibilityLabel=\{language === 'tr' \? `\$\{lessonTitle\}/g) ?? []).length;
if (contextualReviewActions < 3) {
  throw new Error(`Review lesson controls: expected at least 3 contextual action labels, found ${contextualReviewActions}`);
}

const challengeButtonRoles = (challenge.match(/accessibilityRole="button"/g) ?? []).length;
if (challengeButtonRoles < 3) {
  throw new Error(`Challenge controls: expected at least 3 explicit button roles, found ${challengeButtonRoles}`);
}

console.log('Learning auxiliary accessibility audit PASS');
console.log('  Beginner landing: persistent TR/EN switch + named progress cards + completion summary + disabled state');
console.log('  Beginner section: named lesson states + progress/completion summaries + contextual next action');
console.log('  Lesson player: live contextual step announcements + progressbar value');
console.log('  Review Center: contextual lesson actions + expanded/selected states + named back control');
console.log('  Challenge: named actions + disabled state + live result summary + 44/52px touch targets');
console.log('  Lesson quiz: live passed/failed quiz and spaced-review result summaries with score context');
console.log('  Beginner task: live correct/retry feedback with takeaway or hint context');
console.log('  Academy task: live correct/retry feedback');
console.log('  Academy quiz: live correct/retry feedback with answer and explanation context');
