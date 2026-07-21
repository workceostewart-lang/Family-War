# Family War — Product Requirements Document

**Status:** Draft v1 — Menu & Lobby priority
**Concept:** A Family Feud-style survey/trivia game with an AI host. Core gameplay mirrors the official Family Feud rules as closely as possible. The one deliberately custom layer is the front-end menu and lobby system, which is the priority for this build phase.

---

## 1. Overview

Two "families" (1–5 players each) compete to guess the most popular answers to survey-style questions, hosted by an AI. The AI host reads questions pulled from a blended question bank (real historical Family Feud questions + originally generated ones), judges typed answers for closeness rather than requiring an exact match, and runs the show through face-offs, strikes, steals, and a final two-person Sudden Death round — all modeled on the real game.

Before any of that, the player needs a menu that lets them configure a match: difficulty, opponent type, family size, and — for playing with others — a private lobby with a shareable code.

---

## 2. Build Priority

1. **Phase 1 (this PRD's focus): Menu, difficulty selection, CPU/Player mode selection, family size, private lobby + code system.**
2. Phase 2: Core round engine (face-off, strikes, steal, scoring, Sudden Death), AI host logic, question bank.

Phase 2 rules are documented below in full since they define what the menu is configuring, but the menu is what gets built first.

---

## 3. Menu Flow

```
Launch → Main Menu
 ├─ Play
 │   ├─ Select Difficulty: Easy / Medium / Hard
 │   ├─ Select Opponent: vs CPU  /  vs Player
 │   │    ├─ vs CPU
 │   │    │    └─ Select Family Size (1–5) → Name Your Family → Start Match
 │   │    └─ vs Player
 │   │         ├─ Create Private Lobby → generate shareable Lobby Code → Waiting Room → Host Starts Match
 │   │         └─ Join Private Lobby → Enter Code → Waiting Room → Match starts when host starts
 ├─ How to Play (rules reference)
 └─ Settings
```

---

## 4. Menu Spec

### 4.1 Difficulty — Easy / Medium / Hard
Difficulty should govern several dials at once, not just one. Proposed mapping (flagged as an assumption to confirm — see Section 8):

| Dial | Easy | Medium | Hard |
|---|---|---|---|
| Answer matching leniency | Very forgiving (broad synonyms/misspellings accepted) | Standard fuzzy match | Tighter match, closer to the survey's actual wording |
| CPU opponent | Slower to buzz, misses lower-ranked answers | Standard reaction and accuracy | Fast buzzer reaction, strong answer recall |
| Question pool | Classic/well-known survey questions | Mixed | Includes obscure real-show questions and harder AI-generated ones |
| Timers (face-off / answer / Sudden Death) | Longer | Standard | Shortest |

### 4.2 Opponent Mode
- **vs CPU:** The human-controlled family (1–5 players) competes against an AI-controlled family. The CPU plays every role on its side — face-off responses, board answers, and the steal decision — scaled by the difficulty dials above.
- **vs Player:** Human families on both sides. Either same-device pass-and-play, or a Private Lobby for playing across devices.

### 4.3 Family Size
- Selectable from 1 to 5 players per family, matching the real show's five-member roster as the max.
- Both families should be the same size for a fair match.

### 4.4 Private Lobby
- **Create Lobby:** generates a short, shareable alphanumeric code and opens a waiting room showing who's joined and which family/slot they're in. The host starts the match once both families are filled.
- **Join Lobby:** enter the code to drop into an open slot.
- **Open technical question:** does the lobby need real cross-device networking (players joining from separate phones/devices via the shared code), or is it a local session-anchor like the pass-and-play approach used for lobby codes in your other project? Given "share the code with others," this reads as cross-device — worth confirming before scoping the backend.

---

## 5. Core Gameplay (Official Family Feud Rules)

This section documents the real rules the game should mirror, condensed to fit the three-round-plus-Sudden-Death structure you described.

### 5.1 Match Structure
- 2 families, up to 5 members each.
- 3 main rounds, each worth increasing points: Round 1 = single points, Round 2 = double points, Round 3 = triple points — the same escalating-multiplier pattern the real show uses across its rounds, compressed into three.
- A Sudden Death round follows for the family with the higher score after Round 3.

### 5.2 Face-Off
- Each round opens with one player from each family facing off on the same question.
- Whoever buzzes in first must answer immediately. If their answer is the single best (top) answer, their family may choose to **Play** (keep control and try to fill the board) or **Pass** (send control to the other family). If it isn't the top answer, the opposing player gets a chance to answer instead and win control.

### 5.3 Strikes and the Steal
- The family in control answers to reveal the remaining spots on the board. An answer that isn't on the board is a strike.
- Three strikes and control passes to the other family, who get one shot to steal all the points banked that round by naming any one of the remaining hidden answers correctly.

### 5.4 Answer Input
- Players type their answer into a text field, capped at **32 characters**.
- The AI host judges the typed answer against the board's answers using a closeness/fuzzy match rather than requiring exact text — consistent with how the real show accepts equivalent phrasings of the same answer.

### 5.5 Sudden Death Round
Modeled directly on the real show's Fast Money round:
- The higher-scoring family after Round 3 sends **two members** in, one at a time — the second player is out of earshot while the first plays.
- Player 1 gets 20 seconds to answer 5 questions.
- Player 2 then gets the same 5 questions with 25 seconds, and must give different answers than Player 1 — a repeated answer scores nothing for that question.
- Points per answer come from the real survey-style distribution (top answer worth the most, tapering down).
- **Target: a combined 200 points to win** — the real show's win threshold, pulled directly from the actual game.

### 5.6 Scoring Ceiling
All point values and the 200-point Sudden Death target are pulled directly from the real Family Feud structure rather than invented, per your instruction.

---

## 6. AI Host & Question Bank
- The AI host reads each question, narrates strikes and steals, and reveals answers and point values — the "Survey says!" moment.
- The question bank blends two sources:
  1. **Real questions** pulled from actual Family Feud episodes (world-knowledge / researched).
  2. **Originally generated questions**, written by the AI host itself with its own plausible answer distribution.
- Recommend tagging each question by source internally (real vs. generated) for quality control and for balancing difficulty tiers.

---

## 7. Open Questions / Assumptions Made

These are calls made to keep this draft complete — flag any you want changed:

1. **Difficulty effects** (matching leniency, CPU skill, timers, question pool) — proposed mapping in 4.1, not explicitly specified by you.
2. **Round compression** — real Family Feud runs 4–5 rounds; this PRD compresses that escalating-multiplier pattern into your requested 3 rounds + Sudden Death.
3. **Private Lobby networking model** — cross-device real-time vs. a local session-anchor approach. Needs a decision before backend scoping.
4. **Family size max = 5** — taken directly from the real show's roster size.
5. **Sudden Death eligibility** — only the higher-scoring family plays it, matching the real show. Confirm if you'd rather both families get a shot.
