import { useState, useEffect, useCallback } from 'react';

const WORDS = [
  'JAVASCRIPT',
  'ELEPHANT',
  'MOUNTAIN',
  'BUTTERFLY',
  'CHOCOLATE',
  'DINOSAUR',
  'GALAXY',
  'PINEAPPLE',
  'TREASURE',
  'UNIVERSE',
];

const MAX_WRONG = 6;

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function HangmanFigure({ wrongGuesses }: { wrongGuesses: number }) {
  return (
    <svg
      viewBox="0 0 200 250"
      className="w-48 h-60 md:w-64 md:h-80"
      aria-label={`Hangman figure: ${wrongGuesses} of ${MAX_WRONG} wrong guesses`}
    >
      {/* Base */}
      <line x1="20" y1="230" x2="180" y2="230" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Pole */}
      <line x1="60" y1="230" x2="60" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Top beam */}
      <line x1="60" y1="20" x2="140" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Rope */}
      <line x1="140" y1="20" x2="140" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      {/* Head */}
      {wrongGuesses >= 1 && (
        <circle cx="140" cy="70" r="20" stroke="currentColor" strokeWidth="3" fill="none" className="animate-fade-in" />
      )}
      {/* Body */}
      {wrongGuesses >= 2 && (
        <line x1="140" y1="90" x2="140" y2="150" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-fade-in" />
      )}
      {/* Left arm */}
      {wrongGuesses >= 3 && (
        <line x1="140" y1="110" x2="110" y2="135" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-fade-in" />
      )}
      {/* Right arm */}
      {wrongGuesses >= 4 && (
        <line x1="140" y1="110" x2="170" y2="135" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-fade-in" />
      )}
      {/* Left leg */}
      {wrongGuesses >= 5 && (
        <line x1="140" y1="150" x2="110" y2="185" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-fade-in" />
      )}
      {/* Right leg */}
      {wrongGuesses >= 6 && (
        <line x1="140" y1="150" x2="170" y2="185" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-fade-in" />
      )}

      {/* Face when dead */}
      {wrongGuesses >= 6 && (
        <>
          <line x1="132" y1="63" x2="138" y2="69" stroke="currentColor" strokeWidth="2" />
          <line x1="138" y1="63" x2="132" y2="69" stroke="currentColor" strokeWidth="2" />
          <line x1="142" y1="63" x2="148" y2="69" stroke="currentColor" strokeWidth="2" />
          <line x1="148" y1="63" x2="142" y2="69" stroke="currentColor" strokeWidth="2" />
          <path d="M 130 80 Q 140 75 150 80" stroke="currentColor" strokeWidth="2" fill="none" />
        </>
      )}
    </svg>
  );
}

function App() {
  const [word, setWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const wrongGuesses = Array.from(guessedLetters).filter(
    (letter) => !word.includes(letter)
  ).length;

  const correctGuesses = Array.from(guessedLetters).filter((letter) =>
    word.includes(letter)
  );

  const isWordComplete = word.split('').every((letter) => guessedLetters.has(letter));

  useEffect(() => {
    if (wrongGuesses >= MAX_WRONG) {
      setGameStatus('lost');
    } else if (isWordComplete) {
      setGameStatus('won');
    }
  }, [wrongGuesses, isWordComplete]);

  const handleGuess = useCallback(
    (letter: string) => {
      if (gameStatus !== 'playing') return;
      if (guessedLetters.has(letter)) return;
      setGuessedLetters((prev) => new Set([...prev, letter]));
    },
    [gameStatus, guessedLetters]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        handleGuess(letter);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGuess]);

  const resetGame = () => {
    setWord(getRandomWord());
    setGuessedLetters(new Set());
    setGameStatus('playing');
  };

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Hangman
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base">Guess the word before the hangman is complete!</p>
      </div>

      {/* Game Status */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2">
          <span className="text-red-400 font-semibold">{wrongGuesses}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-300">{MAX_WRONG}</span>
          <span className="text-slate-500 text-sm">wrong</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2">
          <span className="text-green-400 font-semibold">{correctGuesses.length}</span>
          <span className="text-slate-500 text-sm">correct</span>
        </div>
      </div>

      {/* Hangman Figure */}
      <div className="mb-6 text-slate-200">
        <HangmanFigure wrongGuesses={wrongGuesses} />
      </div>

      {/* Word Display */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
        {word.split('').map((letter, index) => (
          <div
            key={index}
            className={`w-10 h-12 md:w-12 md:h-14 flex items-center justify-center border-b-4 text-xl md:text-2xl font-bold transition-all duration-300 ${
              guessedLetters.has(letter)
                ? 'border-purple-400 text-white scale-100'
                : 'border-slate-600 text-transparent'
            } ${gameStatus === 'lost' && !guessedLetters.has(letter) ? 'border-red-500 text-red-400' : ''}`}
          >
            {guessedLetters.has(letter) || gameStatus === 'lost' ? letter : '_'}
          </div>
        ))}
      </div>

      {/* Win/Lose Message */}
      {gameStatus !== 'playing' && (
        <div
          className={`mb-6 text-center p-4 rounded-xl ${
            gameStatus === 'won'
              ? 'bg-green-500/20 border border-green-500/50'
              : 'bg-red-500/20 border border-red-500/50'
          }`}
        >
          <p className="text-2xl font-bold mb-1">
            {gameStatus === 'won' ? '🎉 You Won!' : '💀 Game Over!'}
          </p>
          <p className="text-slate-300">
            {gameStatus === 'won'
              ? 'Great job guessing the word!'
              : `The word was: ${word}`}
          </p>
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 max-w-lg mb-6">
        {ALPHABET.map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isCorrect = isGuessed && word.includes(letter);
          const isWrong = isGuessed && !word.includes(letter);

          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed || gameStatus !== 'playing'}
              className={`w-9 h-10 md:w-11 md:h-12 rounded-lg font-bold text-sm md:text-base transition-all duration-200 ${
                isCorrect
                  ? 'bg-green-500/30 text-green-300 border border-green-500/50 scale-95'
                  : isWrong
                  ? 'bg-red-500/20 text-red-400/60 border border-red-500/30 scale-95'
                  : 'bg-slate-700/60 text-slate-200 border border-slate-600/50 hover:bg-purple-600/40 hover:border-purple-500/50 hover:scale-105 active:scale-95'
              } disabled:cursor-not-allowed`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* New Game Button */}
      <button
        onClick={resetGame}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {gameStatus !== 'playing' ? '🔄 Play Again' : '🔄 New Word'}
      </button>

      {/* Hint */}
      <p className="mt-6 text-slate-500 text-xs text-center">
        💡 Tip: You can also use your keyboard to guess letters!
      </p>
    </div>
  );
}

export default App;
