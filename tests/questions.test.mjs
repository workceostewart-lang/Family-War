import assert from "node:assert/strict";
import test from "node:test";
import { BONUS_QUESTIONS, pickQuestionCycleIds, pickQuestionIds, QUESTIONS } from "../lib/questions.mjs";

test("ships a deep, family-friendly question bank", () => {
  assert.ok(QUESTIONS.length >= 50, `expected at least 50 regular questions, received ${QUESTIONS.length}`);
  assert.ok(BONUS_QUESTIONS.length >= 75, `expected at least 75 rapid-fire questions, received ${BONUS_QUESTIONS.length}`);
  assert.equal(new Set(QUESTIONS.map((question) => question.prompt)).size, QUESTIONS.length);
  assert.equal(new Set(BONUS_QUESTIONS.map((question) => question.prompt)).size, BONUS_QUESTIONS.length);

  for (const question of QUESTIONS) {
    assert.equal(question.answers.length, 6, question.prompt);
    assert.equal(question.answers.reduce((total, answer) => total + answer.points, 0), 100, question.prompt);
  }
  for (const question of BONUS_QUESTIONS) assert.equal(question.answers.length, 3, question.prompt);
});

test("new-game decks are unique and avoid the previous match", () => {
  const previousRegular = [1, 2, 3];
  const previousBonus = [4, 5, 6, 7, 8];
  const regularDeck = pickQuestionIds(QUESTIONS.length, 3, previousRegular, () => 0.42);
  const bonusDeck = pickQuestionIds(BONUS_QUESTIONS.length, 5, previousBonus, () => 0.73);

  assert.equal(new Set(regularDeck).size, 3);
  assert.equal(new Set(bonusDeck).size, 5);
  assert.ok(regularDeck.every((id) => !previousRegular.includes(id)));
  assert.ok(bonusDeck.every((id) => !previousBonus.includes(id)));
});

test("question picker falls back safely when nearly the whole bank is excluded", () => {
  const deck = pickQuestionIds(3, 3, [0, 1, 2], () => 0.5);
  assert.deepEqual([...deck].sort(), [0, 1, 2]);
});

test("Sudden Death cycles through the full bank before repeating", () => {
  let usedIds = [];
  let previous = [];
  const seen = new Set();

  for (let round = 0; round < 15; round += 1) {
    const result = pickQuestionCycleIds(BONUS_QUESTIONS.length, 5, usedIds, previous, () => (round + 1) / 17);
    assert.equal(result.ids.length, 5);
    assert.ok(result.ids.every((id) => !seen.has(id)));
    result.ids.forEach((id) => seen.add(id));
    previous = result.ids;
    usedIds = result.usedIds;
  }

  assert.equal(seen.size, BONUS_QUESTIONS.length);
  const reset = pickQuestionCycleIds(BONUS_QUESTIONS.length, 5, usedIds, previous, () => 0.5);
  assert.ok(reset.ids.every((id) => !previous.includes(id)));
});
