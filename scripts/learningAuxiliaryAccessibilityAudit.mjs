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

const reviewPath = 'src/screens/learn/LearningReviewScreen.tsx';
const challengePath = 'src/screens/learn/LearningChallengeScreen.tsx';
const review = read(reviewPath);
const challenge = read(challengePath);

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

const contextualReviewActions = (review.match(/accessibilityLabel=\{language === 'tr' \? `\$\{lessonTitle\}/g) ?? []).length;
if (contextualReviewActions < 3) {
  throw new Error(`Review lesson controls: expected at least 3 contextual action labels, found ${contextualReviewActions}`);
}

const challengeButtonRoles = (challenge.match(/accessibilityRole="button"/g) ?? []).length;
if (challengeButtonRoles < 3) {
  throw new Error(`Challenge controls: expected at least 3 explicit button roles, found ${challengeButtonRoles}`);
}

console.log('Learning auxiliary accessibility audit PASS');
console.log('  Review Center: contextual lesson actions + expanded/selected states + named back control');
console.log('  Challenge: named actions + disabled state + live result summary + 44/52px touch targets');
