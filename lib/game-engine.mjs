const THRESHOLDS = { easy: 0.48, medium: 0.61, hard: 0.76 };

export function normalizeAnswer(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(the|a|an|some|my|their)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(left, right) {
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const above = previous[j];
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + (left[i - 1] === right[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return previous[right.length];
}

export function similarity(leftValue, rightValue) {
  const left = normalizeAnswer(leftValue);
  const right = normalizeAnswer(rightValue);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if ((left.length >= 4 && right.includes(left)) || (right.length >= 4 && left.includes(right))) return 0.92;
  const leftTokens = new Set(left.split(" "));
  const rightTokens = new Set(right.split(" "));
  const shared = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const tokenScore = shared / Math.max(leftTokens.size, rightTokens.size);
  const editScore = 1 - levenshtein(left, right) / Math.max(left.length, right.length);
  return Math.max(tokenScore * 0.94, editScore);
}

export function findMatchingAnswer(input, answers, revealedIndexes = [], difficulty = "medium") {
  const revealed = new Set(revealedIndexes);
  const threshold = THRESHOLDS[difficulty] ?? THRESHOLDS.medium;
  let bestIndex = -1;
  let bestScore = 0;

  answers.forEach((answer, index) => {
    if (revealed.has(index)) return;
    const candidates = [answer.text, ...(answer.aliases ?? [])];
    const candidateScore = Math.max(...candidates.map((candidate) => similarity(input, candidate)));
    if (candidateScore > bestScore) {
      bestScore = candidateScore;
      bestIndex = index;
    }
  });

  return bestScore >= threshold ? bestIndex : -1;
}

export function getUnrevealedAnswerIndexes(answerCount, revealedIndexes = []) {
  const revealed = new Set(revealedIndexes);
  return Array.from({ length: Math.max(0, answerCount) }, (_, index) => index)
    .filter((index) => !revealed.has(index));
}

export function chooseCpuAnswer(answers, revealedIndexes = [], difficulty = "medium", random = Math.random) {
  const accuracy = { easy: 0.56, medium: 0.72, hard: 0.88 }[difficulty] ?? 0.72;
  const available = answers
    .map((answer, index) => ({ answer, index }))
    .filter(({ index }) => !revealedIndexes.includes(index));

  if (!available.length || random() > accuracy) return "wildly impossible answer";
  const poolBias = Math.pow(random(), difficulty === "hard" ? 1.8 : difficulty === "easy" ? 0.7 : 1.15);
  const choiceIndex = Math.min(available.length - 1, Math.floor(poolBias * available.length));
  return available[choiceIndex].answer.text;
}

export function makeLobbyCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const values = new Uint32Array(length);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(values);
  else values.forEach((_, index) => { values[index] = Math.floor(Math.random() * alphabet.length); });
  for (const value of values) code += alphabet[value % alphabet.length];
  return code;
}
