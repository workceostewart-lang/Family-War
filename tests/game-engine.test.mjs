import assert from "node:assert/strict";
import test from "node:test";
import { chooseCpuAnswer, findMatchingAnswer, makeLobbyCode, normalizeAnswer, similarity } from "../lib/game-engine.mjs";

const answers = [
  { text: "Toilet paper", points: 34, aliases: ["bathroom tissue", "tp"] },
  { text: "Remote control", points: 20, aliases: ["remote"] },
];

test("normalizes filler words and punctuation", () => {
  assert.equal(normalizeAnswer("The TOILET-paper!"), "toilet paper");
});

test("accepts aliases and common wording", () => {
  assert.equal(findMatchingAnswer("bathroom tissue", answers, [], "medium"), 0);
  assert.equal(findMatchingAnswer("the remote", answers, [], "medium"), 1);
});

test("does not return an answer that is already revealed", () => {
  assert.equal(findMatchingAnswer("remote", answers, [1], "easy"), -1);
});

test("hard mode rejects loose guesses", () => {
  assert.equal(findMatchingAnswer("bath thing", answers, [], "hard"), -1);
  assert.ok(similarity("spagetti", "spaghetti") > 0.7);
});

test("lobby codes are short and unambiguous", () => {
  const code = makeLobbyCode();
  assert.match(code, /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
});

test("CPU difficulty controls answer accuracy", () => {
  assert.equal(chooseCpuAnswer(answers, [], "hard", () => 0), "Toilet paper");
  assert.equal(chooseCpuAnswer(answers, [], "easy", () => 0.99), "wildly impossible answer");
  assert.equal(chooseCpuAnswer(answers, [0], "hard", () => 0), "Remote control");
});
