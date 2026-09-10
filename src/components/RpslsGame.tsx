"use client";
import { useState } from "react";
import Link from "next/link";
type Choice = "ROCK" | "PAPER" | "SCISSORS" | "LIZARD" | "SPOCK";
type Result = "VICTORY" | "DEFEAT" | "DRAW" | null;

const CHOICES: Choice[] = ["ROCK", "PAPER", "SCISSORS", "LIZARD", "SPOCK"];

const WIN_MATRIX: Record<Choice, Choice[]> = {
  ROCK: ["SCISSORS", "LIZARD"],
  PAPER: ["ROCK", "SPOCK"],
  SCISSORS: ["PAPER", "LIZARD"],
  LIZARD: ["SPOCK", "PAPER"],
  SPOCK: ["SCISSORS", "ROCK"],
};

const VERBS: Record<string, string> = {
  "ROCK-SCISSORS": "crushes",
  "ROCK-LIZARD": "crushes",
  "PAPER-ROCK": "covers",
  "PAPER-SPOCK": "disproves",
  "SCISSORS-PAPER": "cuts",
  "SCISSORS-LIZARD": "decapitates",
  "LIZARD-SPOCK": "poisons",
  "LIZARD-PAPER": "eats",
  "SPOCK-SCISSORS": "smashes",
  "SPOCK-ROCK": "vaporizes",
};

const ICONS: Record<Choice, React.ReactNode> = {
  ROCK: (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 25,80 L 70,80 L 85,45 L 60,20 L 30,25 L 15,50 Z" />
      <path d="M 15,50 L 50,50 L 85,45" />
      <path d="M 50,50 L 60,80" />
      <path d="M 50,50 L 60,20" />
      <path d="M 50,50 L 30,25" />
    </svg>
  ),
  PAPER: (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 30,15 L 60,15 L 80,35 L 80,85 L 30,85 Z" />
      <path d="M 60,15 L 60,35 L 80,35" />
      <line x1="45" y1="45" x2="65" y2="45" />
      <line x1="45" y1="55" x2="65" y2="55" />
      <line x1="45" y1="65" x2="55" y2="65" />
    </svg>
  ),
  SCISSORS: (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="35" cy="75" r="14" />
      <circle cx="65" cy="75" r="14" />
      <path d="M43 65 L80 20 L85 25 L50 50" />
      <path d="M57 65 L20 20 L15 25 L50 50" />
      <circle cx="50" cy="55" r="3" fill="currentColor" />
    </svg>
  ),
  LIZARD: (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 75,20 C 80,15 88,20 85,27 C 80,35 70,35 65,45 C 60,55 65,65 55,75 C 40,90 20,95 10,100 C 10,100 25,90 35,75 C 45,60 45,50 50,40 C 55,30 65,25 75,20 Z" />
      <path d="M 70,30 C 65,25 60,30 55,25" />
      <path d="M 55,35 C 45,33 40,40 35,35" />
      <path d="M 64,49 C 75,49 80,55 85,50" />
      <path d="M 52,57 C 40,60 35,50 25,55" />
      <circle cx="78" cy="23" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  SPOCK: (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 72,70 L 82,38 C 84,33 90,35 88,40 L 75,72" />
      <path d="M 65,65 L 72,25 C 74,20 80,22 78,27 L 68,68" />
      <path d="M 52,60 L 52,15 C 52,10 58,10 58,15 L 58,62" />
      <path d="M 44,55 L 42,18 C 41,13 47,12 48,17 L 52,60" />
      <path d="M 32,65 L 18,52 C 14,48 20,44 25,48 L 38,62" />
      <path d="M 75,72 C 75,90 60,95 45,95 C 30,95 28,85 32,65 Z" />
    </svg>
  ),
};

export default function RpslsGame() {
  const [round, setRound] = useState<{
    player: Choice;
    house: Choice;
    result: Result;
  } | null>(null);
  const [score, setScore] = useState({ player: 0, house: 0 });
  function handleChoose(player: Choice) {
    if (round) return;
    const sample = crypto.getRandomValues(new Uint32Array(1));
    const house = CHOICES[sample[0] % CHOICES.length];
    const result: Result =
      player === house
        ? "DRAW"
        : WIN_MATRIX[player].includes(house)
          ? "VICTORY"
          : "DEFEAT";
    setRound({ player, house, result });
    setScore((s) => ({
      player: s.player + (result === "VICTORY" ? 1 : 0),
      house: s.house + (result === "DEFEAT" ? 1 : 0),
    }));
  }
  return (
    <main className="shell section-space duel">
      <Link href="/playground" className="text-link">
        ← Playground
      </Link>
      <p className="eyebrow mt-6">A small experiment in decisions</p>
      <h1 className="section-heading mt-4">
        Rock. Paper. Scissors.
        <br />
        Lizard. Spock.
      </h1>
      <p className="body-copy mt-5">
        Choose a move. Each beats two others and loses to two.
      </p>
      <p className="duel-score">
        You <strong>{score.player}</strong>
        <span aria-hidden="true"> / </span>House <strong>{score.house}</strong>
      </p>
      <div className="duel-choices">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            disabled={!!round}
            onClick={() => handleChoose(choice)}
            className="duel-choice"
          >
            <span aria-hidden="true">{ICONS[choice]}</span>
            {choice.toLowerCase()}
          </button>
        ))}
      </div>
      <div className="duel-result" role="status" aria-live="polite">
        {round ? (
          <>
            <h2>
              {round.result === "DRAW"
                ? "A draw."
                : round.result === "VICTORY"
                  ? "You win."
                  : "The house wins."}
            </h2>
            <p>
              You chose {round.player.toLowerCase()}. The house chose{" "}
              {round.house.toLowerCase()}.
              {round.result !== "DRAW" &&
                ` ${round.result === "VICTORY" ? round.player.toLowerCase() : round.house.toLowerCase()} ${VERBS[round.result === "VICTORY" ? `${round.player}-${round.house}` : `${round.house}-${round.player}`]} ${round.result === "VICTORY" ? round.house.toLowerCase() : round.player.toLowerCase()}.`}
            </p>
          </>
        ) : (
          <p>Your move.</p>
        )}
      </div>
      {round && (
        <button
          className="button button-primary"
          onClick={() => setRound(null)}
        >
          Play another round ↗
        </button>
      )}
      <details className="technical-details mt-10">
        <summary>The rules</summary>
        <ul>
          {Object.entries(VERBS).map(([pair, verb]) => (
            <li key={pair}>
              {pair.split("-")[0].toLowerCase()} {verb}{" "}
              {pair.split("-")[1].toLowerCase()}
            </li>
          ))}
        </ul>
      </details>
    </main>
  );
}
