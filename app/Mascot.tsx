// Pip — Close the Distance's lovebird mascot. Lovebirds pair-bond for life and pine
// when apart, which is the whole brief. Pip reacts to the couple's verdict.

export type Mood = "wave" | "happy" | "think" | "worry";

const BODY = "#e89aa6";
const WING = "#d2748a";
const BELLY = "#fbeee6";
const BEAK = "#e9a23f";
const CHEEK = "#f4adb8";
const INK = "#2b2329";

export default function Mascot({
  mood = "wave",
  size = 96,
  animate = true,
  className = "",
}: {
  mood?: Mood;
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 134"
      width={size}
      height={(size * 134) / 120}
      role="img"
      aria-label="Pip the lovebird"
      className={`${animate ? "mascot" : ""} ${className}`}
    >
      {/* feet */}
      <g stroke={BEAK} strokeWidth="3.5" strokeLinecap="round">
        <path d="M50 118 v8 M46 128 h8" fill="none" />
        <path d="M70 118 v8 M66 128 h8" fill="none" />
      </g>

      {/* tail */}
      <path d="M96 92 q18 6 20 22 q-16 0 -26 -12 Z" fill={WING} />

      {/* body */}
      <path
        d="M60 12 C86 12 102 36 102 66 C102 98 84 120 60 120 C36 120 18 98 18 66 C18 36 34 12 60 12 Z"
        fill={BODY}
      />
      {/* belly */}
      <ellipse cx="58" cy="84" rx="24" ry="28" fill={BELLY} />

      {/* wing (waves on the wave mood) */}
      <g className={mood === "wave" && animate ? "mascot-wave" : ""} style={{ transformOrigin: "32px 70px" }}>
        <ellipse cx="30" cy="74" rx="13" ry="22" fill={WING} transform="rotate(-16 30 74)" />
      </g>

      {/* head tuft */}
      <path d="M58 12 q-3 -10 4 -12 q5 5 0 12" fill={WING} />

      {/* cheeks */}
      <circle cx="40" cy="74" r="7.5" fill={CHEEK} opacity="0.85" />
      <circle cx="80" cy="74" r="7.5" fill={CHEEK} opacity="0.85" />

      {/* beak */}
      <path d="M53 64 L67 64 L60 76 Z" fill={BEAK} />

      {/* eyes + expression */}
      <Eyes mood={mood} animate={animate} />

      {/* mood extras */}
      {mood === "happy" && (
        <g fill={BEAK}>
          <Sparkle x={14} y={30} />
          <Sparkle x={100} y={26} r={0.8} />
          <Sparkle x={104} y={56} r={0.6} />
        </g>
      )}
      {mood === "worry" && (
        <path d="M96 40 q4 6 0 9 q-4 -3 0 -9 Z" fill="#8fb6c9" />
      )}
    </svg>
  );
}

function Eyes({ mood, animate }: { mood: Mood; animate: boolean }) {
  if (mood === "happy") {
    return (
      <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M42 60 q6 -7 12 0" />
        <path d="M66 60 q6 -7 12 0" />
      </g>
    );
  }
  if (mood === "worry") {
    return (
      <g>
        <g stroke={INK} strokeWidth="3" strokeLinecap="round">
          <path d="M42 52 l11 4" />
          <path d="M78 52 l-11 4" />
        </g>
        <circle cx="48" cy="62" r="4.5" fill={INK} />
        <circle cx="72" cy="62" r="4.5" fill={INK} />
      </g>
    );
  }
  // wave + think: round eyes; think raises one brow
  return (
    <g className={animate ? "mascot-blink" : ""} style={{ transformOrigin: "60px 60px" }}>
      {mood === "think" && (
        <path d="M42 50 q6 -3 12 -1" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      <circle cx="48" cy="60" r="6.5" fill={INK} />
      <circle cx="72" cy="60" r="6.5" fill={INK} />
      <circle cx="50.5" cy="57.5" r="2.2" fill="#fff" />
      <circle cx="74.5" cy="57.5" r="2.2" fill="#fff" />
    </g>
  );
}

function Sparkle({ x, y, r = 1 }: { x: number; y: number; r?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${r})`} d="M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6 Z" />;
}
