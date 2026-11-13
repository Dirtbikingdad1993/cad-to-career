import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function Checkpoint({ check, onResult }) {
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const correct = picked === check.a;

  const confirm = () => {
    setRevealed(true);
    if (onResult) onResult(correct);
  };

  return (
    <div className="border border-hairline bg-card p-5">
      <p className="mono-label">Automatic checkpoint</p>
      <p className="mt-3 font-heading text-[15px] font-medium leading-snug">{check.q}</p>
      <div className="mt-4 space-y-2">
        {check.o.map((option, i) => {
          const isPicked = picked === i;
          const isRight = revealed && i === check.a;
          const isWrong = revealed && isPicked && !isRight;
          return (
            <button
              key={option}
              type="button"
              disabled={revealed}
              onClick={() => setPicked(i)}
              className={`flex w-full items-start gap-3 border px-3 py-2.5 text-left text-[13px] transition-colors ${
                isRight
                  ? 'border-emerald-600/40 bg-emerald-50 text-emerald-900'
                  : isWrong
                    ? 'border-destructive/40 bg-destructive/5 text-destructive'
                    : isPicked
                      ? 'border-ink bg-paper'
                      : 'border-hairline hover:border-ink/40'
              }`}
            >
              <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button
          type="button"
          disabled={picked === null}
          onClick={confirm}
          className="mt-4 w-full border border-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
        >
          Check answer
        </button>
      ) : (
        <div
          className={`mt-4 flex items-start gap-2 border px-3 py-2.5 text-[12px] leading-relaxed ${
            correct ? 'border-emerald-600/30 bg-emerald-50 text-emerald-900' : 'border-destructive/30 bg-destructive/5 text-destructive'
          }`}
        >
          {correct ? <Check size={14} className="mt-0.5 shrink-0" /> : <X size={14} className="mt-0.5 shrink-0" />}
          <span>{check.why}</span>
        </div>
      )}
    </div>
  );
}