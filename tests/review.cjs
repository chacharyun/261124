const assert = require('node:assert/strict');
const {calculateNextReview,getTodayDateString}=require(process.argv[2]);
assert.equal(calculateNextReview('2026-11-24','none').nextReviewDate,'2026-11-25');
assert.equal(calculateNextReview('2026-11-24','mastered',2).nextReviewDate,'2026-12-01');
assert.equal(calculateNextReview('2027-03-19','mastered',4).nextReviewDate,'2027-03-20');
assert.equal(calculateNextReview('2026-11-24','mastered',4,true,'2026-11-26').nextReviewDate,'2026-11-26');
assert.equal(calculateNextReview('2027-03-21','none').nextReviewDate,'2027-03-22');
assert.match(getTodayDateString(),/^\d{4}-\d{2}-\d{2}$/);
console.log('6 checks passed');
