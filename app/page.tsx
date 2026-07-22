"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chooseCpuAnswer, findMatchingAnswer, makeLobbyCode } from "../lib/game-engine.mjs";
import { BONUS_QUESTIONS, pickQuestionCycleIds, pickQuestionIds, QUESTIONS } from "../lib/questions.mjs";

type Difficulty = "easy" | "medium" | "hard";
type Opponent = "cpu" | "local" | "online";
type TeamIndex = 0 | 1;
type Screen = "menu" | "setup" | "lobby" | "game";
type GamePhase = "round" | "bonus-intro" | "bonus-playing" | "bonus-end";
type Modal = "rules" | "settings" | null;
type OnlineRole = "host" | "guest" | null;

type LobbyInfo = {
  code: string;
  status: "waiting" | "started";
  hostFamilyName: string;
  guestFamilyName: string | null;
  familySize: number;
  difficulty: Difficulty;
  gameState?: SharedGameState | null;
  pendingAnswer?: string | null;
  pendingBy?: OnlineRole;
};
type SharedGameState = {
  roundIndex: number;
  round: ReturnType<typeof defaultRound>;
  scores: [number, number];
  status: string;
  phase: GamePhase;
  champion: TeamIndex;
  bonusIndex: number;
  bonusScore: number;
  bonusSeconds: number;
  roundSeconds?: number;
  roundQuestionIds?: number[];
  bonusQuestionIds?: number[];
  usedBonusQuestionIds?: number[];
  transitioning: boolean;
  paused: boolean;
};

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

const ROUND_COUNT = 3;
const BONUS_QUESTION_COUNT = 5;
const ROUND_TIME_LIMIT = 60;
const BONUS_TIME_LIMIT = 40;

const hasValidQuestionDeck = (ids: number[] | undefined, poolSize: number, count: number) => (
  Array.isArray(ids)
  && ids.length === count
  && new Set(ids).size === count
  && ids.every((id) => Number.isInteger(id) && id >= 0 && id < poolSize)
);

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
  const [roundSeconds, setRoundSeconds] = useState(ROUND_TIME_LIMIT);
  const [bonusSeconds, setBonusSeconds] = useState(BONUS_TIME_LIMIT);
  const [roundQuestionIds, setRoundQuestionIds] = useState(() => pickQuestionIds(QUESTIONS.length, ROUND_COUNT));
  const [bonusQuestionIds, setBonusQuestionIds] = useState(() => pickQuestionIds(BONUS_QUESTIONS.length, BONUS_QUESTION_COUNT));
  const [usedBonusQuestionIds, setUsedBonusQuestionIds] = useState<number[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [onlineRole, setOnlineRole] = useState<OnlineRole>(null);
  const [onlineToken, setOnlineToken] = useState("");
  const [lobbyInfo, setLobbyInfo] = useState<LobbyInfo | null>(null);
  const [lobbyBusy, setLobbyBusy] = useState(false);
  const [lobbyError, setLobbyError] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const question = QUESTIONS[roundQuestionIds[roundIndex] ?? roundQuestionIds[0] ?? 0];
  const bonusQuestion = BONUS_QUESTIONS[bonusQuestionIds[bonusIndex] ?? bonusQuestionIds[0] ?? 0];
  const multiplier = roundIndex + 1;
  const activeTeam = round.control;
  const cpuTurn = screen === "game" && phase === "round" && opponent === "cpu" && activeTeam === 1;
  const onlineInputLocked = onlineRole === "host"
    ? (phase === "round" ? activeTeam !== 0 : champion !== 0)
    : onlineRole === "guest"
      ? (phase === "round" ? activeTeam !== 1 : champion !== 1)
      : false;
  const activeLobbyCode = lobbyInfo?.code;

  useEffect(() => {
    const timer = window.setTimeout(() => {
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
    }, 0);
    return () => window.clearTimeout(timer);
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
    const currentPrompt = phase === "bonus-playing" ? bonusQuestion?.prompt : phase === "round" ? question?.prompt : "";
    if (!currentPrompt) return;
    const timer = window.setTimeout(() => speak(currentPrompt), 350);
    return () => window.clearTimeout(timer);
  }, [bonusIndex, bonusQuestion, paused, phase, question, screen, speak]);

  useEffect(() => {
    if (phase !== "bonus-playing" || paused || bonusSeconds <= 0 || onlineRole === "guest") return;
    const timer = window.setInterval(() => {
      setBonusSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [bonusSeconds, onlineRole, paused, phase]);

  useEffect(() => {
    if (onlineRole === "guest") return;
    if (phase === "bonus-playing" && bonusSeconds === 0) {
      const timer = window.setTimeout(() => {
        setPhase("bonus-end");
        setStatus("Time! The final board is locked.");
        playSound(bonusScore >= 200 ? "win" : "strike");
      }, 0);
      return () => window.clearTimeout(timer);
    }
    if (phase === "bonus-playing" && bonusSeconds > 0 && bonusSeconds <= 5) playSound("tick");
  }, [bonusScore, bonusSeconds, onlineRole, phase, playSound]);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const cleanTeamNames = useMemo<[string, string]>(() => [
    teamNames[0].trim() || "The Home Team",
    opponent === "cpu" ? "The Rivals" : teamNames[1].trim() || "The Challengers",
  ], [opponent, teamNames]);

  const beginOnlineGame = useCallback((lobby: LobbyInfo) => {
    const names: [string, string] = [lobby.hostFamilyName, lobby.guestFamilyName || "The Challengers"];
    const remoteRoundIds = lobby.gameState?.roundQuestionIds;
    const remoteBonusIds = lobby.gameState?.bonusQuestionIds;
    const remoteUsedBonusIds = lobby.gameState?.usedBonusQuestionIds;
    const nextBonusCycle = pickQuestionCycleIds(
      BONUS_QUESTIONS.length,
      BONUS_QUESTION_COUNT,
      usedBonusQuestionIds,
      bonusQuestionIds,
    );
    const nextRoundIds = hasValidQuestionDeck(remoteRoundIds, QUESTIONS.length, ROUND_COUNT)
      ? remoteRoundIds!
      : pickQuestionIds(QUESTIONS.length, ROUND_COUNT, roundQuestionIds);
    const nextBonusIds = hasValidQuestionDeck(remoteBonusIds, BONUS_QUESTIONS.length, BONUS_QUESTION_COUNT)
      ? remoteBonusIds!
      : nextBonusCycle.ids;
    const nextUsedBonusIds = Array.isArray(remoteUsedBonusIds)
      ? [...new Set(remoteUsedBonusIds.filter((id) => Number.isInteger(id) && id >= 0 && id < BONUS_QUESTIONS.length))]
      : nextBonusCycle.usedIds;
    setOpponent("online");
    setTeamNames(names);
    setDifficulty(lobby.difficulty);
    setFamilySize(lobby.familySize);
    setRoundIndex(0);
    setRound(defaultRound(0));
    setScores([0, 0]);
    setPhase("round");
    setStatus(`${names[0]} has control. Name an answer!`);
    setChampion(0);
    setBonusIndex(0);
    setBonusScore(0);
    setRoundSeconds(lobby.gameState?.roundSeconds ?? ROUND_TIME_LIMIT);
    setBonusSeconds(lobby.gameState?.bonusSeconds ?? BONUS_TIME_LIMIT);
    setRoundQuestionIds(nextRoundIds);
    setBonusQuestionIds(nextBonusIds);
    setUsedBonusQuestionIds(nextUsedBonusIds);
    setTransitioning(false);
    setPaused(false);
    setScreen("game");
    window.setTimeout(() => inputRef.current?.focus(), 350);
  }, [bonusQuestionIds, roundQuestionIds, usedBonusQuestionIds]);

  const openSetup = () => {
    playSound("select");
    setRoomCode(makeLobbyCode());
    setOnlineRole(null);
    setOnlineToken("");
    setLobbyInfo(null);
    setLobbyError("");
    setScreen("setup");
  };

  const startGame = () => {
    const nextRoundIds = pickQuestionIds(QUESTIONS.length, ROUND_COUNT, roundQuestionIds);
    const nextBonusCycle = pickQuestionCycleIds(
      BONUS_QUESTIONS.length,
      BONUS_QUESTION_COUNT,
      usedBonusQuestionIds,
      bonusQuestionIds,
    );
    playSound("correct");
    setOnlineRole(null);
    setOnlineToken("");
    setLobbyInfo(null);
    setTeamNames(cleanTeamNames);
    setRoundIndex(0);
    setRound(defaultRound(0));
    setScores([0, 0]);
    setPhase("round");
    setStatus(`${cleanTeamNames[0]} has control. Name an answer!`);
    setBonusIndex(0);
    setBonusScore(0);
    setRoundSeconds(ROUND_TIME_LIMIT);
    setBonusSeconds(BONUS_TIME_LIMIT);
    setRoundQuestionIds(nextRoundIds);
    setBonusQuestionIds(nextBonusCycle.ids);
    setUsedBonusQuestionIds(nextBonusCycle.usedIds);
    setTransitioning(false);
    setPaused(false);
    setScreen("game");
    window.setTimeout(() => inputRef.current?.focus(), 450);
  };

  const leaveGame = () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    window.speechSynthesis?.cancel();
    setPaused(false);
    setOnlineRole(null);
    setOnlineToken("");
    setLobbyInfo(null);
    setScreen("menu");
    setStatus("Ready for another Family War?");
  };

  const createPrivateLobby = async () => {
    setLobbyBusy(true);
    setLobbyError("");
    try {
      const response = await fetch("/api/lobbies", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ familyName: teamNames[0], familySize, difficulty }),
      });
      const data = await response.json() as { token?: string; role?: OnlineRole; lobby?: LobbyInfo; error?: string };
      if (!response.ok || !data.token || !data.lobby) throw new Error(data.error || "Could not create the lobby.");
      setOnlineRole("host");
      setOnlineToken(data.token);
      setLobbyInfo(data.lobby);
      setScreen("lobby");
      playSound("correct");
    } catch (error) {
      setLobbyError(error instanceof Error ? error.message : "Could not create the lobby.");
      playSound("strike");
    } finally {
      setLobbyBusy(false);
    }
  };

  const joinPrivateLobby = async () => {
    const code = joinCode.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    if (code.length !== 6) {
      setLobbyError("Enter the six-character lobby code.");
      return;
    }
    setLobbyBusy(true);
    setLobbyError("");
    try {
      const response = await fetch(`/api/lobbies/${code}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "join", familyName: teamNames[0] }),
      });
      const data = await response.json() as { token?: string; role?: OnlineRole; lobby?: LobbyInfo; error?: string };
      if (!response.ok || !data.token || !data.lobby) throw new Error(data.error || "Could not join the lobby.");
      setOnlineRole("guest");
      setOnlineToken(data.token);
      setLobbyInfo(data.lobby);
      setScreen("lobby");
      playSound("correct");
    } catch (error) {
      setLobbyError(error instanceof Error ? error.message : "Could not join the lobby.");
      playSound("strike");
    } finally {
      setLobbyBusy(false);
    }
  };

  const startPrivateLobby = async () => {
    if (!lobbyInfo || onlineRole !== "host") return;
    setLobbyBusy(true);
    setLobbyError("");
    try {
      const response = await fetch(`/api/lobbies/${lobbyInfo.code}`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${onlineToken}` },
        body: JSON.stringify({ action: "start" }),
      });
      const data = await response.json() as { lobby?: LobbyInfo; error?: string };
      if (!response.ok || !data.lobby) throw new Error(data.error || "Could not start the match.");
      setLobbyInfo(data.lobby);
      beginOnlineGame(data.lobby);
      playSound("win");
    } catch (error) {
      setLobbyError(error instanceof Error ? error.message : "Could not start the match.");
      playSound("strike");
    } finally {
      setLobbyBusy(false);
    }
  };

  useEffect(() => {
    if (screen !== "lobby" || !activeLobbyCode || !onlineToken) return;
    let cancelled = false;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const response = await fetch(`/api/lobbies/${activeLobbyCode}`, {
          headers: { authorization: `Bearer ${onlineToken}` },
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json() as { lobby?: LobbyInfo };
        if (cancelled || !data.lobby) return;
        setLobbyInfo(data.lobby);
        if (data.lobby.status === "started" && onlineRole === "guest") beginOnlineGame(data.lobby);
      } catch {
        // A later poll will recover from a brief connection interruption.
      } finally {
        if (!cancelled) timer = window.setTimeout(() => void poll(), 1000);
      }
    };
    void poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [activeLobbyCode, beginOnlineGame, onlineRole, onlineToken, screen]);

  const awardRound = useCallback((team: TeamIndex, points: number, message: string) => {
    const nextScores: [number, number] = [...scores];
    nextScores[team] += points;
    setScores(nextScores);
    setStatus(message);
    setTransitioning(true);
    playSound("win");
    transitionTimer.current = setTimeout(() => {
      if (roundIndex >= ROUND_COUNT - 1) {
        const winner: TeamIndex = nextScores[1] > nextScores[0] ? 1 : 0;
        setChampion(winner);
        setPhase("bonus-intro");
        setStatus(`${cleanTeamNames[winner]} wins the main game!`);
      } else {
        const nextRoundIndex = roundIndex + 1;
        setRoundIndex(nextRoundIndex);
        setRound(defaultRound(nextRoundIndex));
        setRoundSeconds(ROUND_TIME_LIMIT);
        setStatus(`${cleanTeamNames[nextRoundIndex % 2]} starts Round ${nextRoundIndex + 1}.`);
      }
      setAnswer("");
      setTransitioning(false);
      window.setTimeout(() => inputRef.current?.focus(), 100);
    }, 950);
  }, [cleanTeamNames, playSound, roundIndex, scores]);

  const processRoundAnswer = useCallback((guess: string, timedOut = false) => {
    if (transitioning || (!timedOut && !guess.trim())) return;
    const match = timedOut ? -1 : findMatchingAnswer(guess, question.answers, round.revealed, difficulty);
    setAnswer("");
    setRoundSeconds(ROUND_TIME_LIMIT);

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
      awardRound(defendingTeam, round.bank, `${timedOut ? "Time! " : ""}No steal! ${cleanTeamNames[defendingTeam]} keeps ${round.bank} points.`);
      return;
    }

    const strikes = round.strikes + 1;
    if (strikes >= 3) {
      const stealingTeam = (round.control === 0 ? 1 : 0) as TeamIndex;
      setRound({ ...round, strikes: 3, control: stealingTeam, stealing: true });
      setStatus(`${timedOut ? "Time! " : ""}Three strikes! ${cleanTeamNames[stealingTeam]} gets one answer to steal.`);
    } else {
      setRound({ ...round, strikes });
      setStatus(`${timedOut ? "Time! " : ""}Strike ${strikes}! ${cleanTeamNames[round.control]} still has control.`);
    }
  }, [awardRound, cleanTeamNames, difficulty, multiplier, playSound, question, round, transitioning]);

  useEffect(() => {
    if (screen !== "game" || phase !== "round" || paused || transitioning || roundSeconds <= 0 || onlineRole === "guest") return;
    const timer = window.setInterval(() => {
      setRoundSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [onlineRole, paused, phase, roundSeconds, screen, transitioning]);

  useEffect(() => {
    if (onlineRole === "guest" || phase !== "round") return;
    if (roundSeconds === 0) {
      const timer = window.setTimeout(() => processRoundAnswer("", true), 0);
      return () => window.clearTimeout(timer);
    }
    if (roundSeconds <= 5) playSound("tick");
  }, [onlineRole, phase, playSound, processRoundAnswer, roundSeconds]);

  const sendOnlineAnswer = useCallback(async (guess: string) => {
    if (!lobbyInfo || !onlineToken) return;
    const response = await fetch(`/api/lobbies/${lobbyInfo.code}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${onlineToken}` },
      body: JSON.stringify({ action: "answer", answer: guess }),
    });
    const data = await response.json() as { accepted?: boolean; error?: string };
    if (!response.ok) throw new Error(data.error || "The answer could not be sent.");
  }, [lobbyInfo, onlineToken]);

  const submitRoundAnswer = async (event: FormEvent) => {
    event.preventDefault();
    if (onlineRole === "guest") {
      if (onlineInputLocked || !answer.trim()) return;
      const guess = answer;
      setAnswer("");
      setStatus("Answer sent to the host board…");
      try {
        await sendOnlineAnswer(guess);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "The answer could not be sent.");
        playSound("strike");
      }
      return;
    }
    processRoundAnswer(answer);
  };

  useEffect(() => {
    if (!cpuTurn || transitioning || paused) return;
    const delay = { easy: 1500, medium: 1050, hard: 700 }[difficulty];
    const thinkingTimer = window.setTimeout(() => setStatus(`${cleanTeamNames[1]} is thinking…`), 0);
    const timer = window.setTimeout(() => {
      const cpuAnswer = chooseCpuAnswer(question.answers, round.revealed, difficulty);
      processRoundAnswer(cpuAnswer);
    }, delay);
    return () => {
      window.clearTimeout(thinkingTimer);
      window.clearTimeout(timer);
    };
  }, [cleanTeamNames, cpuTurn, difficulty, paused, processRoundAnswer, question.answers, round.revealed, transitioning]);

  const startBonus = () => {
    playSound("select");
    setPhase("bonus-playing");
    setBonusIndex(0);
    setBonusScore(0);
    setBonusSeconds(BONUS_TIME_LIMIT);
    setStatus("Five questions. Forty seconds. Reach 200 points!");
    window.setTimeout(() => inputRef.current?.focus(), 200);
  };

  const processBonusAnswer = useCallback((guess: string) => {
    if (!guess.trim() || phase !== "bonus-playing") return;
    const match = findMatchingAnswer(guess, bonusQuestion.answers, [], difficulty);
    const points = match >= 0 ? bonusQuestion.answers[match].points : 0;
    const nextScore = bonusScore + points;
    setBonusScore(nextScore);
    setAnswer("");
    playSound(points > 0 ? "correct" : "strike");
    if (bonusIndex >= bonusQuestionIds.length - 1) {
      setPhase("bonus-end");
      setStatus(points > 0 ? `Final answer scores ${points}!` : "Final answer scores zero.");
      window.setTimeout(() => playSound(nextScore >= 200 ? "win" : "strike"), 250);
    } else {
      setStatus(points > 0 ? `That scores ${points}! Next question.` : "No points. Shake it off—next question!");
      setBonusIndex((value) => value + 1);
      window.setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [bonusIndex, bonusQuestion, bonusQuestionIds.length, bonusScore, difficulty, phase, playSound]);

  const submitBonusAnswer = async (event: FormEvent) => {
    event.preventDefault();
    if (onlineRole === "guest") {
      if (onlineInputLocked || !answer.trim()) return;
      const guess = answer;
      setAnswer("");
      setStatus("Bonus answer sent to the host board…");
      try {
        await sendOnlineAnswer(guess);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "The answer could not be sent.");
        playSound("strike");
      }
      return;
    }
    processBonusAnswer(answer);
  };

  useEffect(() => {
    if (screen !== "game" || onlineRole !== "host" || !lobbyInfo || !onlineToken) return;
    const gameState: SharedGameState = {
      roundIndex,
      round,
      scores,
      status,
      phase,
      champion,
      bonusIndex,
      bonusScore,
      bonusSeconds,
      roundSeconds,
      roundQuestionIds,
      bonusQuestionIds,
      usedBonusQuestionIds,
      transitioning,
      paused,
    };
    const timer = window.setTimeout(() => {
      void fetch(`/api/lobbies/${lobbyInfo.code}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", authorization: `Bearer ${onlineToken}` },
        body: JSON.stringify({ gameState }),
      });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [bonusIndex, bonusQuestionIds, bonusScore, bonusSeconds, champion, lobbyInfo, onlineRole, onlineToken, paused, phase, round, roundIndex, roundQuestionIds, roundSeconds, scores, screen, status, transitioning, usedBonusQuestionIds]);

  useEffect(() => {
    if (screen !== "game" || onlineRole !== "guest" || !activeLobbyCode || !onlineToken) return;
    let cancelled = false;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const response = await fetch(`/api/lobbies/${activeLobbyCode}`, {
          headers: { authorization: `Bearer ${onlineToken}` },
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json() as { lobby?: LobbyInfo };
        const remote = data.lobby?.gameState;
        if (cancelled || !remote) return;
        setLobbyInfo(data.lobby!);
        setRoundIndex(remote.roundIndex);
        setRound(remote.round);
        setScores(remote.scores);
        setStatus(remote.status);
        setPhase(remote.phase);
        setChampion(remote.champion);
        setBonusIndex(remote.bonusIndex);
        setBonusScore(remote.bonusScore);
        setBonusSeconds(remote.bonusSeconds);
        setRoundSeconds(remote.roundSeconds ?? ROUND_TIME_LIMIT);
        if (hasValidQuestionDeck(remote.roundQuestionIds, QUESTIONS.length, ROUND_COUNT)) setRoundQuestionIds(remote.roundQuestionIds!);
        if (hasValidQuestionDeck(remote.bonusQuestionIds, BONUS_QUESTIONS.length, BONUS_QUESTION_COUNT)) setBonusQuestionIds(remote.bonusQuestionIds!);
        if (Array.isArray(remote.usedBonusQuestionIds)) setUsedBonusQuestionIds(remote.usedBonusQuestionIds);
        setTransitioning(remote.transitioning);
        setPaused(remote.paused);
      } catch {
        // The shared board catches up on the next poll.
      } finally {
        if (!cancelled) timer = window.setTimeout(() => void poll(), 700);
      }
    };
    void poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [activeLobbyCode, onlineRole, onlineToken, screen]);

  useEffect(() => {
    if (screen !== "game" || onlineRole !== "host" || !activeLobbyCode || !onlineToken) return;
    let cancelled = false;
    let judging = false;
    let timer: number | undefined;
    const poll = async () => {
      if (judging || transitioning || paused) {
        if (!cancelled) timer = window.setTimeout(() => void poll(), 650);
        return;
      }
      try {
        const response = await fetch(`/api/lobbies/${activeLobbyCode}`, {
          headers: { authorization: `Bearer ${onlineToken}` },
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json() as { lobby?: LobbyInfo };
        const pending = data.lobby?.pendingAnswer;
        if (cancelled || !pending) return;
        judging = true;
        if (phase === "round") processRoundAnswer(pending);
        else if (phase === "bonus-playing") processBonusAnswer(pending);
        await fetch(`/api/lobbies/${activeLobbyCode}`, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${onlineToken}` },
          body: JSON.stringify({ action: "consume" }),
        });
        judging = false;
      } catch {
        judging = false;
      } finally {
        if (!cancelled) timer = window.setTimeout(() => void poll(), 650);
      }
    };
    void poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [activeLobbyCode, onlineRole, onlineToken, paused, phase, processBonusAnswer, processRoundAnswer, screen, transitioning]);

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
                <li><b>Find the board.</b><span>Type a popular survey answer before the 60-second answer clock expires. Close matches and common synonyms count.</span></li>
                <li><b>Protect control.</b><span>Three misses means the other family gets one chance to steal the bank.</span></li>
                <li><b>Build the score.</b><span>Rounds are worth 1×, 2×, then 3× points.</span></li>
                <li><b>Finish the war.</b><span>The winner gets a 40-second Sudden Death Championship Rush to reach 200 bonus points.</span></li>
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

            <fieldset className="setup-group opponent-group">
              <legend><i>02</i><span><b>Opponent</b><small>Choose who stands across the board</small></span></legend>
              <div className="choice-grid three opponent-grid">
                <button className={opponent === "cpu" ? "selected" : ""} onClick={() => setOpponent("cpu")} aria-pressed={opponent === "cpu"}><span>CPU</span><b>Vs. Rivals</b><small>Smart computer family</small></button>
                <button className={opponent === "local" ? "selected" : ""} onClick={() => setOpponent("local")} aria-pressed={opponent === "local"}><span>2P</span><b>Same Screen</b><small>Pass-and-play family</small></button>
                <button className={opponent === "online" ? "selected" : ""} onClick={() => setOpponent("online")} aria-pressed={opponent === "online"}><span>LIVE</span><b>Private Lobby</b><small>Join from another device</small></button>
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

          {opponent === "online" ? (
            <section className="online-lobby-setup" aria-label="Private lobby options">
              <button className="primary-button" data-testid="create-lobby" onClick={createPrivateLobby} disabled={lobbyBusy}><span>{lobbyBusy ? "Opening lobby…" : "Create private lobby"}</span><b>＋</b></button>
              <div className="join-lobby-row">
                <label htmlFor="join-code">OR JOIN WITH A CODE</label>
                <input id="join-code" data-testid="join-code" value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} maxLength={6} placeholder="ABC123" autoCapitalize="characters" />
                <button className="secondary-button" data-testid="join-lobby" onClick={joinPrivateLobby} disabled={lobbyBusy || joinCode.length !== 6}>Join lobby</button>
              </div>
              <p>One family hosts the board; the second family joins from any phone, tablet, or PC.</p>
              {lobbyError && <div className="lobby-error" role="alert">{lobbyError}</div>}
            </section>
          ) : (
            <>
              <div className="room-ticket">
                <div><span>MATCH BADGE</span><b>{roomCode}</b></div>
                <p>A quick identifier for this same-screen game-night setup.</p>
              </div>
              <button className="primary-button start-button" data-testid="start-game" onClick={startGame}><span>Start the war</span><b>→</b></button>
            </>
          )}
        </section>
        {renderModal()}
      </main>
    );
  }

  if (screen === "lobby" && lobbyInfo) {
    const filled = Boolean(lobbyInfo.guestFamilyName);
    return (
      <main className="setup-shell lobby-shell">
        <header className="compact-header">
          <button className="back-button" onClick={() => { setScreen("setup"); setLobbyInfo(null); setOnlineRole(null); setOnlineToken(""); }}>← <span>Leave lobby</span></button>
          <div className="mini-brand"><span>FW</span> FAMILY WAR</div>
          <button className="icon-button" onClick={() => setModal("settings")} aria-label="Open settings">♫</button>
        </header>
        <section className="lobby-card" data-testid="waiting-room">
          <div className="lobby-heading">
            <span className="live-pill"><i /> PRIVATE LOBBY</span>
            <h1>Bring in the challengers</h1>
            <p>Share this code. The waiting room updates automatically on every device.</p>
          </div>
          <div className="lobby-code-panel">
            <span>LOBBY CODE</span>
            <strong data-testid="lobby-code">{lobbyInfo.code}</strong>
            <button className="secondary-button" onClick={() => navigator.clipboard?.writeText(lobbyInfo.code)}>Copy code</button>
          </div>
          <div className="lobby-families">
            <article className="family-seat ready">
              <span>HOST FAMILY</span><h2>{lobbyInfo.hostFamilyName}</h2><p>{lobbyInfo.familySize} {lobbyInfo.familySize === 1 ? "player" : "players"} · Ready</p>
            </article>
            <div className="versus-badge">VS</div>
            <article className={`family-seat ${filled ? "ready" : "waiting"}`}>
              <span>CHALLENGER FAMILY</span><h2>{lobbyInfo.guestFamilyName || "Waiting to join…"}</h2><p>{filled ? `${lobbyInfo.familySize} ${lobbyInfo.familySize === 1 ? "player" : "players"} · Ready` : "Share the lobby code"}</p>
            </article>
          </div>
          <div className="lobby-status-line" aria-live="polite"><i className={filled ? "ready" : ""} />{filled ? "Both families are connected." : "Looking for the challenger family…"}</div>
          {onlineRole === "host" ? (
            <button className="primary-button start-button" data-testid="start-online-game" onClick={startPrivateLobby} disabled={!filled || lobbyBusy}><span>{lobbyBusy ? "Starting…" : filled ? "Start the war" : "Waiting for family"}</span><b>→</b></button>
          ) : (
            <div className="guest-waiting">The host will start the match when both families are ready.</div>
          )}
          {lobbyError && <div className="lobby-error" role="alert">{lobbyError}</div>}
        </section>
        {renderModal()}
      </main>
    );
  }

  const isBonus = phase !== "round";
  const gamePrompt = phase === "bonus-playing" ? bonusQuestion.prompt : question.prompt;

  return (
    <main className={`game-shell ${isBonus ? "bonus-mode" : ""}`}>
      <header className="game-header">
        <div className="mini-brand"><span>FW</span><b>FAMILY WAR</b></div>
        <div className="round-chip">{isBonus ? "SUDDEN DEATH · CHAMPIONSHIP RUSH" : `ROUND ${roundIndex + 1} · ${multiplier}× POINTS`}</div>
        {onlineRole !== "guest" ? <button className="icon-button" data-testid="pause-game" onClick={() => setPaused(true)} aria-label="Pause game">Ⅱ</button> : <div className="online-badge">LIVE · {lobbyInfo?.code}</div>}
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
        {phase === "round" && <time data-testid="round-timer" className={roundSeconds <= 10 ? "danger" : ""} aria-label={`${roundSeconds} seconds left`}>{roundSeconds}</time>}
        {phase === "bonus-playing" && <time data-testid="bonus-timer" className={bonusSeconds <= 5 ? "danger" : ""} aria-label={`${bonusSeconds} seconds left`}>{bonusSeconds}</time>}
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
          <div><span>SUDDEN DEATH</span><h2>5 questions · 40 seconds · 200 points</h2><p>The winning family gets one rapid-fire answer for each question. The host reads every prompt aloud.</p></div>
          {onlineRole !== "guest" ? <button className="primary-button" onClick={startBonus}><span>Start the rush</span><b>→</b></button> : <div className="guest-waiting">The host is opening the bonus board…</div>}
        </section>
      )}

      {phase === "bonus-playing" && (
        <section className="bonus-progress" aria-label="Bonus round progress">
          {bonusQuestionIds.map((questionId, index) => <i key={questionId} className={index < bonusIndex ? "done" : index === bonusIndex ? "active" : ""}>{index < bonusIndex ? "✓" : index + 1}</i>)}
        </section>
      )}

      {phase === "bonus-end" && (
        <section className="bonus-result">
          <div className="result-burst"><span>{bonusScore}</span><small>/ 200</small></div>
          <div><span className="eyebrow">FINAL SCORE</span><h2>{bonusScore >= 200 ? `${cleanTeamNames[champion]} are Family War champions!` : `${cleanTeamNames[champion]} won the war!`}</h2><p>{bonusScore >= 200 ? "You conquered the Championship Rush." : "The main-game trophy is yours. The bonus board awaits a rematch."}</p></div>
          {onlineRole !== "guest" ? <button className="primary-button" onClick={() => onlineRole && lobbyInfo ? beginOnlineGame(lobbyInfo) : startGame()}><span>Play again</span><b>↻</b></button> : <div className="guest-waiting">Waiting for the host to choose the next match.</div>}
          <button className="secondary-button" onClick={leaveGame}>Main menu</button>
        </section>
      )}

      {(phase === "round" || phase === "bonus-playing") && (
        <div className="answer-console">
          <div className="status-line" aria-live="polite"><i />{status}</div>
          <form onSubmit={phase === "round" ? submitRoundAnswer : submitBonusAnswer} aria-busy={cpuTurn || onlineInputLocked}>
            <label htmlFor="answer-input">YOUR ANSWER</label>
            <input ref={inputRef} id="answer-input" data-testid="answer-input" value={answer} onChange={(event) => setAnswer(event.target.value)} maxLength={32} autoComplete="off" enterKeyHint="send" placeholder={cpuTurn ? "The Rivals are thinking…" : onlineInputLocked ? "Waiting for the other family…" : "Type what the survey said…"} disabled={transitioning || cpuTurn || onlineInputLocked} />
            <span>{answer.length}/32</span>
            <button type="submit" data-testid="submit-answer" disabled={!answer.trim() || transitioning || cpuTurn || onlineInputLocked}>Submit <b>↵</b></button>
          </form>
        </div>
      )}

      {paused && (
        <div className="modal-backdrop pause-backdrop">
          <section className="modal-card pause-card" role="dialog" aria-modal="true" aria-label="Game paused">
            <span className="eyebrow">TIME OUT</span><h2>Game paused</h2><p>The board will be right where you left it.</p>
            {onlineRole !== "guest" ? <button className="primary-button" onClick={() => setPaused(false)}><span>Resume game</span><b>▶</b></button> : <div className="guest-waiting">Waiting for the host to resume…</div>}
            <button className="secondary-button" onClick={leaveGame}>Exit to menu</button>
          </section>
        </div>
      )}
    </main>
  );
}
