"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chooseCpuAnswer, findMatchingAnswer, makeLobbyCode } from "../lib/game-engine.mjs";

type Difficulty = "easy" | "medium" | "hard";
type Opponent = "cpu" | "local";
type TeamIndex = 0 | 1;
type Screen = "menu" | "setup" | "game";
type GamePhase = "round" | "bonus-intro" | "bonus-playing" | "bonus-end";
type Modal = "rules" | "settings" | null;

type Answer = { text: string; points: number; aliases?: string[] };
type Question = { prompt: string; answers: Answer[] };

const QUESTIONS: Question[] = [
  {
    prompt: "Name something families always seem to run out of.",
    answers: [
      { text: "Toilet paper", points: 34, aliases: ["bathroom tissue", "tp"] },
      { text: "Milk", points: 22 },
      { text: "Money", points: 16, aliases: ["cash"] },
      { text: "Patience", points: 12 },
      { text: "Snacks", points: 9, aliases: ["food"] },
      { text: "Hot water", points: 7 },
    ],
  },
  {
    prompt: "Name something people do while waiting for food to arrive.",
    answers: [
      { text: "Check their phone", points: 38, aliases: ["use phone", "phone"] },
      { text: "Talk", points: 25, aliases: ["chat", "conversation"] },
      { text: "Drink", points: 14, aliases: ["have a drink"] },
      { text: "Look at the menu", points: 10, aliases: ["read menu"] },
      { text: "People-watch", points: 8, aliases: ["watch people"] },
      { text: "Complain", points: 5 },
    ],
  },
  {
    prompt: "Name a reason a kid tries to stay up past bedtime.",
    answers: [
      { text: "Watch TV", points: 32, aliases: ["television", "tv"] },
      { text: "Play games", points: 24, aliases: ["video games", "gaming"] },
      { text: "Not tired", points: 18, aliases: ["wide awake"] },
      { text: "Read", points: 11, aliases: ["read a book"] },
      { text: "Get a snack", points: 9, aliases: ["snack", "eat"] },
      { text: "Avoid tomorrow", points: 6, aliases: ["school tomorrow"] },
    ],
  },
  {
    prompt: "Name something you might find between couch cushions.",
    answers: [
      { text: "Coins", points: 36, aliases: ["money", "change"] },
      { text: "Food crumbs", points: 25, aliases: ["crumbs", "food"] },
      { text: "Remote control", points: 17, aliases: ["remote"] },
      { text: "Phone", points: 9, aliases: ["cell phone"] },
      { text: "Keys", points: 8 },
      { text: "Toy", points: 5, aliases: ["toys"] },
    ],
  },
  {
    prompt: "Name something that can turn a calm family trip into chaos.",
    answers: [
      { text: "Traffic", points: 31, aliases: ["traffic jam"] },
      { text: "Getting lost", points: 23, aliases: ["wrong directions", "lost"] },
      { text: "Car trouble", points: 18, aliases: ["flat tire", "breakdown"] },
      { text: "Hungry kids", points: 12, aliases: ["hunger", "hungry"] },
      { text: "Bad weather", points: 10, aliases: ["rain", "storm"] },
      { text: "Forgotten bags", points: 6, aliases: ["forgot luggage", "luggage"] },
    ],
  },
  {
    prompt: "Name something people celebrate with cake.",
    answers: [
      { text: "Birthday", points: 48, aliases: ["birthdays"] },
      { text: "Wedding", points: 19, aliases: ["marriage"] },
      { text: "Graduation", points: 12 },
      { text: "Anniversary", points: 9 },
      { text: "Retirement", points: 7 },
      { text: "New baby", points: 5, aliases: ["baby shower"] },
    ],
  },
];

const BONUS_QUESTIONS: Question[] = [
  {
    prompt: "Name something you do before leaving the house.",
    answers: [
      { text: "Lock the door", points: 46, aliases: ["lock door"] },
      { text: "Check pockets", points: 34, aliases: ["get keys", "grab phone"] },
      { text: "Turn off lights", points: 27, aliases: ["lights"] },
    ],
  },
  {
    prompt: "Name a food that is hard to eat neatly.",
    answers: [
      { text: "Spaghetti", points: 47, aliases: ["pasta", "noodles"] },
      { text: "Tacos", points: 38, aliases: ["taco"] },
      { text: "Ribs", points: 29, aliases: ["barbecue ribs"] },
    ],
  },
  {
    prompt: "Name something people lose at least once a week.",
    answers: [
      { text: "Keys", points: 44, aliases: ["car keys"] },
      { text: "Phone", points: 37, aliases: ["cell phone"] },
      { text: "Remote", points: 25, aliases: ["remote control"] },
    ],
  },
  {
    prompt: "Name a place where people whisper.",
    answers: [
      { text: "Library", points: 52 },
      { text: "Church", points: 33, aliases: ["place of worship"] },
      { text: "Movie theater", points: 24, aliases: ["cinema", "movies"] },
    ],
  },
  {
    prompt: "Name something that makes a weekend feel complete.",
    answers: [
      { text: "Sleeping in", points: 49, aliases: ["sleep", "rest"] },
      { text: "Family time", points: 36, aliases: ["family", "friends"] },
      { text: "Good food", points: 28, aliases: ["dinner", "meal"] },
    ],
  },
];

const DIFFICULTY_COPY: Record<Difficulty, string> = {
  easy: "Forgiving answers · relaxed CPU",
  medium: "Balanced matching · sharp CPU",
  hard: "Exact answers · fast CPU",
};

const defaultRound = (roundIndex = 0) => ({
  revealed: [] as number[],
  strikes: 0,
  control: (roundIndex % 2) as TeamIndex,
  stealing: false,
  bank: 0,
});

export default function Home() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [modal, setModal] = useState<Modal>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [opponent, setOpponent] = useState<Opponent>("cpu");
  const [familySize, setFamilySize] = useState(3);
  const [teamNames, setTeamNames] = useState<[string, string]>(["The Home Team", "The Rivals"]);
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState(() => defaultRound());
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("Choose Play Now to start the showdown.");
  const [phase, setPhase] = useState<GamePhase>("round");
  const [champion, setChampion] = useState<TeamIndex>(0);
  const [bonusIndex, setBonusIndex] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);
  const [bonusSeconds, setBonusSeconds] = useState(30);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const question = QUESTIONS[roundIndex];
  const multiplier = roundIndex + 1;
  const activeTeam = round.control;
  const cpuTurn = screen === "game" && phase === "round" && opponent === "cpu" && activeTeam === 1;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("family-war-preferences");
      if (!stored) return;
      const prefs = JSON.parse(stored) as { soundOn?: boolean; voiceOn?: boolean; difficulty?: Difficulty };
      if (typeof prefs.soundOn === "boolean") setSoundOn(prefs.soundOn);
      if (typeof prefs.voiceOn === "boolean") setVoiceOn(prefs.voiceOn);
      if (prefs.difficulty && ["easy", "medium", "hard"].includes(prefs.difficulty)) setDifficulty(prefs.difficulty);
    } catch {
      // Preferences are optional; an invalid value should never block the game.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "family-war-preferences",
        JSON.stringify({ soundOn, voiceOn, difficulty }),
      );
    } catch {
      // Private browsing may disable storage.
    }
  }, [difficulty, soundOn, voiceOn]);

  const playSound = useCallback((kind: "select" | "correct" | "strike" | "win" | "tick") => {
    if (!soundOn || typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const sounds = {
      select: { frequency: 520, end: 720, duration: 0.08, type: "sine" as OscillatorType },
      correct: { frequency: 620, end: 980, duration: 0.22, type: "triangle" as OscillatorType },
      strike: { frequency: 180, end: 90, duration: 0.3, type: "sawtooth" as OscillatorType },
      win: { frequency: 520, end: 1180, duration: 0.55, type: "triangle" as OscillatorType },
      tick: { frequency: 330, end: 300, duration: 0.05, type: "square" as OscillatorType },
    }[kind];
    oscillator.type = sounds.type;
    oscillator.frequency.setValueAtTime(sounds.frequency, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(sounds.end, context.currentTime + sounds.duration);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + sounds.duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + sounds.duration);
    oscillator.addEventListener("ended", () => void context.close(), { once: true });
  }, [soundOn]);

  const speak = useCallback((text: string) => {
    if (!voiceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.94;
    speech.pitch = 0.9;
    speech.volume = 0.95;
    window.speechSynthesis.speak(speech);
  }, [voiceOn]);

  useEffect(() => {
    if (screen !== "game" || paused) return;
    const currentPrompt = phase === "bonus-playing" ? BONUS_QUESTIONS[bonusIndex]?.prompt : phase === "round" ? question?.prompt : "";
    if (!currentPrompt) return;
    const timer = window.setTimeout(() => speak(currentPrompt), 350);
    return () => window.clearTimeout(timer);
  }, [bonusIndex, paused, phase, question, screen, speak]);

  useEffect(() => {
    if (phase !== "bonus-playing" || paused || bonusSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setBonusSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [bonusSeconds, paused, phase]);

  useEffect(() => {
    if (phase === "bonus-playing" && bonusSeconds === 0) {
      setPhase("bonus-end");
      setStatus("Time! The final board is locked.");
      playSound(bonusScore >= 200 ? "win" : "strike");
    }
    if (phase === "bonus-playing" && bonusSeconds > 0 && bonusSeconds <= 5) playSound("tick");
  }, [bonusScore, bonusSeconds, phase, playSound]);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const cleanTeamNames = useMemo<[string, string]>(() => [
    teamNames[0].trim() || "The Home Team",
    opponent === "cpu" ? "The Rivals" : teamNames[1].trim() || "The Challengers",
  ], [opponent, teamNames]);

  const openSetup = () => {
    playSound("select");
    setRoomCode(makeLobbyCode());
    setScreen("setup");
  };

  const startGame = () => {
    playSound("correct");
    setTeamNames(cleanTeamNames);
    setRoundIndex(0);
    setRound(defaultRound(0));
    setScores([0, 0]);
    setPhase("round");
    setStatus(`${cleanTeamNames[0]} has control. Name an answer!`);
    setBonusIndex(0);
    setBonusScore(0);
    setBonusSeconds(30);
    setTransitioning(false);
    setPaused(false);
    setScreen("game");
    window.setTimeout(() => inputRef.current?.focus(), 450);
  };

  const leaveGame = () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    window.speechSynthesis?.cancel();
    setPaused(false);
    setScreen("menu");
    setStatus("Ready for another Family War?");
  };

  const awardRound = useCallback((team: TeamIndex, points: number, message: string) => {
    const nextScores: [number, number] = [...scores];
    nextScores[team] += points;
    setScores(nextScores);
    setStatus(message);
    setTransitioning(true);
    playSound("win");
    transitionTimer.current = setTimeout(() => {
      if (roundIndex >= QUESTIONS.length - 1 || roundIndex >= 2) {
        const winner: TeamIndex = nextScores[1] > nextScores[0] ? 1 : 0;
        setChampion(winner);
        setPhase("bonus-intro");
        setStatus(`${cleanTeamNames[winner]} wins the main game!`);
      } else {
        const nextRoundIndex = roundIndex + 1;
        setRoundIndex(nextRoundIndex);
        setRound(defaultRound(nextRoundIndex));
        setStatus(`${cleanTeamNames[nextRoundIndex % 2]} starts Round ${nextRoundIndex + 1}.`);
      }
      setAnswer("");
      setTransitioning(false);
      window.setTimeout(() => inputRef.current?.focus(), 100);
    }, 950);
  }, [cleanTeamNames, playSound, roundIndex, scores]);

  const processRoundAnswer = useCallback((guess: string) => {
    if (transitioning || !guess.trim()) return;
    const match = findMatchingAnswer(guess, question.answers, round.revealed, difficulty);
    setAnswer("");

    if (match >= 0) {
      const points = question.answers[match].points * multiplier;
      const revealed = [...round.revealed, match];
      const bank = round.bank + points;
      playSound("correct");
      setRound({ ...round, revealed, bank });
      setStatus(`Survey says… ${question.answers[match].text}! +${points}`);
      if (round.stealing) {
        awardRound(round.control, bank, `${cleanTeamNames[round.control]} steals ${bank} points!`);
      } else if (revealed.length === question.answers.length) {
        awardRound(round.control, bank, `${cleanTeamNames[round.control]} cleared the board for ${bank}!`);
      }
      return;
    }

    playSound("strike");
    if (round.stealing) {
      const defendingTeam = (round.control === 0 ? 1 : 0) as TeamIndex;
      awardRound(defendingTeam, round.bank, `No steal! ${cleanTeamNames[defendingTeam]} keeps ${round.bank} points.`);
      return;
    }

    const strikes = round.strikes + 1;
    if (strikes >= 3) {
      const stealingTeam = (round.control === 0 ? 1 : 0) as TeamIndex;
      setRound({ ...round, strikes: 3, control: stealingTeam, stealing: true });
      setStatus(`Three strikes! ${cleanTeamNames[stealingTeam]} gets one answer to steal.`);
    } else {
      setRound({ ...round, strikes });
      setStatus(`Strike ${strikes}! ${cleanTeamNames[round.control]} still has control.`);
    }
  }, [awardRound, cleanTeamNames, difficulty, multiplier, playSound, question, round, transitioning]);

  const submitRoundAnswer = (event: FormEvent) => {
    event.preventDefault();
    processRoundAnswer(answer);
  };

  useEffect(() => {
    if (!cpuTurn || transitioning || paused) return;
    setStatus(`${cleanTeamNames[1]} is thinking…`);
    const delay = { easy: 1500, medium: 1050, hard: 700 }[difficulty];
    const timer = window.setTimeout(() => {
      const cpuAnswer = chooseCpuAnswer(question.answers, round.revealed, difficulty);
      processRoundAnswer(cpuAnswer);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [cleanTeamNames, cpuTurn, difficulty, paused, processRoundAnswer, question.answers, round.revealed, transitioning]);

  const startBonus = () => {
    playSound("select");
    setPhase("bonus-playing");
    setBonusIndex(0);
    setBonusScore(0);
    setBonusSeconds(30);
    setStatus("Five questions. Thirty seconds. Reach 200 points!");
    window.setTimeout(() => inputRef.current?.focus(), 200);
  };

  const submitBonusAnswer = (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim() || phase !== "bonus-playing") return;
    const bonusQuestion = BONUS_QUESTIONS[bonusIndex];
    const match = findMatchingAnswer(answer, bonusQuestion.answers, [], difficulty);
    const points = match >= 0 ? bonusQuestion.answers[match].points : 0;
    const nextScore = bonusScore + points;
    setBonusScore(nextScore);
    setAnswer("");
    playSound(points > 0 ? "correct" : "strike");
    if (bonusIndex >= BONUS_QUESTIONS.length - 1) {
      setPhase("bonus-end");
      setStatus(points > 0 ? `Final answer scores ${points}!` : "Final answer scores zero.");
      window.setTimeout(() => playSound(nextScore >= 200 ? "win" : "strike"), 250);
    } else {
      setStatus(points > 0 ? `That scores ${points}! Next question.` : "No points. Shake it off—next question!");
      setBonusIndex((value) => value + 1);
      window.setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const renderModal = () => {
    if (!modal) return null;
    return (
      <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}>
        <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="icon-button modal-close" onClick={() => setModal(null)} aria-label="Close dialog">×</button>
          {modal === "rules" ? (
            <>
              <span className="eyebrow">THE PLAYBOOK</span>
              <h2 id="modal-title">How to play</h2>
              <ol className="rules-list">
                <li><b>Find the board.</b><span>Type a popular survey answer. Close matches and common synonyms count.</span></li>
                <li><b>Protect control.</b><span>Three misses means the other family gets one chance to steal the bank.</span></li>
                <li><b>Build the score.</b><span>Rounds are worth 1×, 2×, then 3× points.</span></li>
                <li><b>Finish the war.</b><span>The winner gets a 30-second Championship Rush to reach 200 bonus points.</span></li>
              </ol>
            </>
          ) : (
            <>
              <span className="eyebrow">YOUR SHOW</span>
              <h2 id="modal-title">Sound & host</h2>
              <div className="setting-row">
                <div><b>Game sounds</b><span>Board reveals, strikes, and wins</span></div>
                <button className={`toggle ${soundOn ? "is-on" : ""}`} onClick={() => setSoundOn((value) => !value)} aria-pressed={soundOn}>{soundOn ? "On" : "Off"}</button>
              </div>
              <div className="setting-row">
                <div><b>Question voice</b><span>Reads each question while it stays on screen</span></div>
                <button className={`toggle ${voiceOn ? "is-on" : ""}`} onClick={() => setVoiceOn((value) => !value)} aria-pressed={voiceOn}>{voiceOn ? "On" : "Off"}</button>
              </div>
            </>
          )}
        </section>
      </div>
    );
  };

  if (screen === "menu") {
    return (
      <main className="menu-shell">
        <div className="menu-noise" aria-hidden="true" />
        <header className="menu-topbar">
          <div className="mini-brand"><span>FW</span> FAMILY WAR</div>
          <button className="icon-button" onClick={() => setModal("settings")} aria-label="Open settings">♫</button>
        </header>

        <section className="hero-card">
          <div className="hero-copy">
            <div className="live-pill"><i /> FAMILY GAME NIGHT, UPGRADED</div>
            <h1><span>Family</span> War</h1>
            <p>Call the answers. Dodge three strikes. Own the board.</p>
            <div className="hero-actions">
              <button className="primary-button" data-testid="play-now" onClick={openSetup}><span>Play now</span><b>→</b></button>
              <button className="secondary-button" onClick={() => setModal("rules")}><span className="play-icon">?</span> How to play</button>
            </div>
            <div className="feature-strip" aria-label="Game features">
              <span><i>1</i> 1–5 players</span>
              <span><i>✦</i> Smart matching</span>
              <span><i>♫</i> Voice host</span>
            </div>
          </div>

          <div className="showcase-board" aria-label="Family War game board preview">
            <div className="board-glow" />
            <div className="preview-score"><span>THE PARKERS <b>126</b></span><em>ROUND 2</em><span><b>98</b> THE RIVALS</span></div>
            <div className="preview-question">NAME SOMETHING FAMILIES ALWAYS RUN OUT OF</div>
            <div className="preview-answers">
              <div className="is-revealed"><i>1</i><span>TOILET PAPER</span><b>34</b></div>
              <div className="is-revealed"><i>2</i><span>MILK</span><b>22</b></div>
              <div><i>3</i><span>?</span><b>—</b></div>
              <div><i>4</i><span>?</span><b>—</b></div>
              <div><i>5</i><span>?</span><b>—</b></div>
              <div><i>6</i><span>?</span><b>—</b></div>
            </div>
            <div className="preview-footer"><span>SURVEY SAYS…</span><div><b>×</b><b>×</b><i>×</i></div></div>
          </div>
        </section>

        <footer className="menu-footer"><span>MADE FOR THE WHOLE CREW</span><span>PC · PHONE · TABLET</span></footer>
        {renderModal()}
      </main>
    );
  }

  if (screen === "setup") {
    return (
      <main className="setup-shell">
        <header className="compact-header">
          <button className="back-button" onClick={() => setScreen("menu")}>← <span>Back</span></button>
          <div className="mini-brand"><span>FW</span> FAMILY WAR</div>
          <button className="icon-button" onClick={() => setModal("settings")} aria-label="Open settings">♫</button>
        </header>
        <section className="setup-card">
          <div className="setup-heading">
            <span className="eyebrow">MATCH SETUP</span>
            <h1>Build your showdown</h1>
            <p>Choose the pace, name the teams, then take the board.</p>
          </div>

          <div className="setup-grid">
            <fieldset className="setup-group">
              <legend><i>01</i><span><b>Difficulty</b><small>{DIFFICULTY_COPY[difficulty]}</small></span></legend>
              <div className="choice-grid three">
                {(["easy", "medium", "hard"] as Difficulty[]).map((value) => (
                  <button key={value} className={difficulty === value ? "selected" : ""} onClick={() => { setDifficulty(value); playSound("select"); }} aria-pressed={difficulty === value}>
                    <span>{value === "easy" ? "🙂" : value === "medium" ? "⚡" : "🔥"}</span><b>{value}</b>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="setup-group">
              <legend><i>02</i><span><b>Opponent</b><small>Choose who stands across the board</small></span></legend>
              <div className="choice-grid two">
                <button className={opponent === "cpu" ? "selected" : ""} onClick={() => setOpponent("cpu")} aria-pressed={opponent === "cpu"}><span>CPU</span><b>Vs. Rivals</b><small>Smart computer family</small></button>
                <button className={opponent === "local" ? "selected" : ""} onClick={() => setOpponent("local")} aria-pressed={opponent === "local"}><span>2P</span><b>Same Screen</b><small>Pass-and-play family</small></button>
              </div>
            </fieldset>

            <fieldset className="setup-group">
              <legend><i>03</i><span><b>Family size</b><small>Players per team</small></span></legend>
              <div className="number-stepper" aria-label="Family size">
                <button onClick={() => setFamilySize((value) => Math.max(1, value - 1))} aria-label="Remove a player">−</button>
                <strong>{familySize}</strong><span>{familySize === 1 ? "player" : "players"}</span>
                <button onClick={() => setFamilySize((value) => Math.min(5, value + 1))} aria-label="Add a player">+</button>
              </div>
            </fieldset>

            <fieldset className="setup-group names-group">
              <legend><i>04</i><span><b>Name the families</b><small>Give the scoreboard some personality</small></span></legend>
              <label><span>Your family</span><input value={teamNames[0]} maxLength={18} onChange={(event) => setTeamNames([event.target.value, teamNames[1]])} /></label>
              {opponent === "local" && <label><span>Challenger family</span><input value={teamNames[1]} maxLength={18} onChange={(event) => setTeamNames([teamNames[0], event.target.value])} /></label>}
            </fieldset>
          </div>

          <div className="room-ticket">
            <div><span>PARTY CODE</span><b>{roomCode}</b></div>
            <p>Your local match badge for this setup. Live cross-device rooms are the next arena upgrade.</p>
          </div>

          <button className="primary-button start-button" data-testid="start-game" onClick={startGame}><span>Start the war</span><b>→</b></button>
        </section>
        {renderModal()}
      </main>
    );
  }

  const isBonus = phase !== "round";
  const gamePrompt = phase === "bonus-playing" ? BONUS_QUESTIONS[bonusIndex].prompt : question.prompt;

  return (
    <main className={`game-shell ${isBonus ? "bonus-mode" : ""}`}>
      <header className="game-header">
        <div className="mini-brand"><span>FW</span><b>FAMILY WAR</b></div>
        <div className="round-chip">{isBonus ? "CHAMPIONSHIP RUSH" : `ROUND ${roundIndex + 1} · ${multiplier}× POINTS`}</div>
        <button className="icon-button" data-testid="pause-game" onClick={() => setPaused(true)} aria-label="Pause game">Ⅱ</button>
      </header>

      <section className="score-ribbon" aria-label="Scoreboard">
        <div className={`team-score ${!isBonus && activeTeam === 0 ? "has-control" : ""}`}>
          <span>{cleanTeamNames[0]}</span><strong>{scores[0]}</strong><i>CONTROL</i>
        </div>
        <div className="round-bank"><span>{isBonus ? "BONUS" : "BANK"}</span><strong>{isBonus ? bonusScore : round.bank}</strong></div>
        <div className={`team-score right ${!isBonus && activeTeam === 1 ? "has-control" : ""}`}>
          <span>{cleanTeamNames[1]}</span><strong>{scores[1]}</strong><i>CONTROL</i>
        </div>
      </section>

      {phase === "round" && (
        <div className="strike-ribbon" data-testid="strikes" aria-label={`${round.strikes} strikes`}>
          <span>{round.stealing ? "STEAL ATTEMPT" : `${cleanTeamNames[activeTeam]} ANSWERS`}</span>
          <div>{[0, 1, 2].map((index) => <b key={index} className={round.strikes > index ? "lit" : ""}>×</b>)}</div>
        </div>
      )}

      <section className="question-card" data-testid="question">
        <div>
          <span>{phase === "bonus-playing" ? `QUESTION ${bonusIndex + 1} OF 5` : phase === "round" ? "WE ASKED 100 PEOPLE" : "THE MAIN GAME IS COMPLETE"}</span>
          <h1>{phase === "bonus-intro" ? `${cleanTeamNames[champion]} owns the board!` : phase === "bonus-end" ? (bonusScore >= 200 ? "Championship won!" : "A fierce finish!") : gamePrompt}</h1>
        </div>
        {(phase === "round" || phase === "bonus-playing") && <button onClick={() => speak(gamePrompt)} aria-label="Read question aloud">♫ <span>PLAY QUESTION</span></button>}
        {phase === "bonus-playing" && <time className={bonusSeconds <= 5 ? "danger" : ""}>{bonusSeconds}</time>}
      </section>

      {phase === "round" && (
        <section className="answer-board" data-testid="answer-board" aria-label="Survey answer board">
          {question.answers.map((item, index) => {
            const revealed = round.revealed.includes(index);
            return (
              <div key={item.text} className={`answer-tile ${revealed ? "revealed" : ""}`}>
                <i>{index + 1}</i>
                <span>{revealed ? item.text : "• • •"}</span>
                <b>{revealed ? item.points * multiplier : "—"}</b>
              </div>
            );
          })}
        </section>
      )}

      {phase === "bonus-intro" && (
        <section className="bonus-panel">
          <div className="trophy">★</div>
          <div><span>ONE LAST CHALLENGE</span><h2>5 questions · 30 seconds · 200 points</h2><p>The winning family gets one rapid-fire answer for each question. The host reads every prompt aloud.</p></div>
          <button className="primary-button" onClick={startBonus}><span>Start the rush</span><b>→</b></button>
        </section>
      )}

      {phase === "bonus-playing" && (
        <section className="bonus-progress" aria-label="Bonus round progress">
          {BONUS_QUESTIONS.map((_, index) => <i key={index} className={index < bonusIndex ? "done" : index === bonusIndex ? "active" : ""}>{index < bonusIndex ? "✓" : index + 1}</i>)}
        </section>
      )}

      {phase === "bonus-end" && (
        <section className="bonus-result">
          <div className="result-burst"><span>{bonusScore}</span><small>/ 200</small></div>
          <div><span className="eyebrow">FINAL SCORE</span><h2>{bonusScore >= 200 ? `${cleanTeamNames[champion]} are Family War champions!` : `${cleanTeamNames[champion]} won the war!`}</h2><p>{bonusScore >= 200 ? "You conquered the Championship Rush." : "The main-game trophy is yours. The bonus board awaits a rematch."}</p></div>
          <button className="primary-button" onClick={startGame}><span>Play again</span><b>↻</b></button>
          <button className="secondary-button" onClick={leaveGame}>Main menu</button>
        </section>
      )}

      {(phase === "round" || phase === "bonus-playing") && (
        <div className="answer-console">
          <div className="status-line" aria-live="polite"><i />{status}</div>
          <form onSubmit={phase === "round" ? submitRoundAnswer : submitBonusAnswer} aria-busy={cpuTurn}>
            <label htmlFor="answer-input">YOUR ANSWER</label>
            <input ref={inputRef} id="answer-input" data-testid="answer-input" value={answer} onChange={(event) => setAnswer(event.target.value)} maxLength={32} autoComplete="off" enterKeyHint="send" placeholder={cpuTurn ? "The Rivals are thinking…" : "Type what the survey said…"} disabled={transitioning || cpuTurn} />
            <span>{answer.length}/32</span>
            <button type="submit" data-testid="submit-answer" disabled={!answer.trim() || transitioning || cpuTurn}>Submit <b>↵</b></button>
          </form>
        </div>
      )}

      {paused && (
        <div className="modal-backdrop pause-backdrop">
          <section className="modal-card pause-card" role="dialog" aria-modal="true" aria-label="Game paused">
            <span className="eyebrow">TIME OUT</span><h2>Game paused</h2><p>The board will be right where you left it.</p>
            <button className="primary-button" onClick={() => setPaused(false)}><span>Resume game</span><b>▶</b></button>
            <button className="secondary-button" onClick={leaveGame}>Exit to menu</button>
          </section>
        </div>
      )}
    </main>
  );
}
