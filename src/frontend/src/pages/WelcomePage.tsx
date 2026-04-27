import { useEffect, useState } from "react";

interface WelcomePageProps {
  onEnter: () => void;
}

export function WelcomePage({ onEnter }: WelcomePageProps) {
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [zooming, setZooming] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBadgeVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  function handleStart() {
    setZooming(true);
    setTimeout(() => onEnter(), 1000);
  }

  return (
    <div className="fade-in relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{
            width: 700,
            height: 700,
            background: "radial-gradient(circle, #c8a882 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header text */}
      <div className="slide-up relative z-10 mb-8 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-foreground">
          Nephron Explorer
        </h1>
        <p className="mt-3 text-lg font-body text-muted-foreground">
          An interactive journey through the kidney&rsquo;s filtration system
        </p>
      </div>

      {/* Kidney SVG illustration */}
      <div
        className={`relative z-10 w-full transition-all duration-1000 ${zooming ? "zoom-in scale-150 opacity-0" : ""}`}
        style={{ maxWidth: 580 }}
        data-ocid="welcome.kidney_illustration"
      >
        <svg
          viewBox="0 0 560 480"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Cross-section of a kidney showing cortex, medulla, renal pyramids, and pelvis"
          className="h-auto w-full drop-shadow-xl"
          style={{ filter: "drop-shadow(0 12px 40px rgba(160,90,40,0.18))" }}
        >
          {/* ── Outer capsule / kidney silhouette ── */}
          <ellipse
            cx="280"
            cy="242"
            rx="230"
            ry="195"
            fill="#c8a882"
            stroke="#a07850"
            strokeWidth="2.5"
          />
          {/* Indent on medial side (hilum) */}
          <path
            d="M 440 200 Q 470 242 440 284"
            fill="none"
            stroke="#a07850"
            strokeWidth="2"
          />

          {/* ── Renal cortex band ── */}
          <ellipse cx="280" cy="242" rx="210" ry="175" fill="#e8c49a" />

          {/* ── Renal medulla (central region) ── */}
          <ellipse cx="280" cy="242" rx="155" ry="128" fill="#d4906a" />

          {/* ── Renal pyramids ── */}
          <polygon
            points="155,180  260,242  155,304"
            fill="#c06040"
            stroke="#a04828"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polygon
            points="230,120  280,220  330,120"
            fill="#c06040"
            stroke="#a04828"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polygon
            points="405,180  300,242  405,304"
            fill="#c06040"
            stroke="#a04828"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* ── Renal pelvis / collecting space ── */}
          <ellipse
            cx="360"
            cy="242"
            rx="68"
            ry="55"
            fill="#f0d090"
            stroke="#c8a040"
            strokeWidth="1.5"
          />

          {/* ── Ureter ── */}
          <path
            d="M 420 242 Q 470 242 490 260 Q 510 278 508 310"
            fill="none"
            stroke="#f0d090"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 420 242 Q 470 242 490 260 Q 510 278 508 310"
            fill="none"
            stroke="#c8a040"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* ── Labels ── */}
          <text
            x="112"
            y="130"
            fontSize="12"
            fill="#7a5030"
            fontFamily="DM Sans, sans-serif"
            fontWeight="600"
          >
            Renal Cortex
          </text>
          <line
            x1="148"
            y1="132"
            x2="175"
            y2="160"
            stroke="#a07850"
            strokeWidth="1"
          />
          <text
            x="60"
            y="368"
            fontSize="12"
            fill="#7a5030"
            fontFamily="DM Sans, sans-serif"
            fontWeight="600"
          >
            Renal Medulla
          </text>
          <line
            x1="148"
            y1="363"
            x2="180"
            y2="330"
            stroke="#a07850"
            strokeWidth="1"
          />
          <text
            x="360"
            y="368"
            textAnchor="middle"
            fontSize="12"
            fill="#7a5030"
            fontFamily="DM Sans, sans-serif"
            fontWeight="600"
          >
            Renal Pelvis
          </text>
          <line
            x1="360"
            y1="362"
            x2="360"
            y2="300"
            stroke="#a07850"
            strokeWidth="1"
          />
          <text
            x="500"
            y="320"
            textAnchor="middle"
            fontSize="11"
            fill="#7a5030"
            fontFamily="DM Sans, sans-serif"
            fontWeight="500"
          >
            Ureter
          </text>

          {/* ── Nephron indicator dots in cortex ── */}
          {[
            { id: "n1", cx: 200, cy: 155 },
            { id: "n2", cx: 240, cy: 140 },
            { id: "n3", cx: 280, cy: 135 },
            { id: "n4", cx: 320, cy: 140 },
            { id: "n5", cx: 360, cy: 155 },
            { id: "n6", cx: 185, cy: 195 },
            { id: "n7", cx: 175, cy: 240 },
            { id: "n8", cx: 185, cy: 285 },
            { id: "n9", cx: 200, cy: 320 },
            { id: "n10", cx: 360, cy: 320 },
            { id: "n11", cx: 375, cy: 285 },
            { id: "n12", cx: 375, cy: 195 },
          ].map(({ id, cx, cy }) => (
            <circle
              key={id}
              cx={cx}
              cy={cy}
              r="4.5"
              fill="#b07850"
              opacity="0.55"
            />
          ))}

          {/* ── "Start your journey" glow ring ── */}
          {badgeVisible && (
            <circle
              cx="280"
              cy="170"
              r="18"
              fill="none"
              stroke="#e05010"
              strokeWidth="2"
              opacity="0.5"
              className="animate-ping"
              style={{ transformOrigin: "280px 170px" }}
            />
          )}
        </svg>

        {/* ── Floating "Start your inner journey" badge ── */}
        {badgeVisible && (
          <button
            type="button"
            onClick={handleStart}
            data-ocid="welcome.start_button"
            aria-label="Start your inner journey through the nephron"
            className="journey-badge absolute"
            style={{
              top: "32%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="journey-badge__dot" aria-hidden="true" />
            Start your inner journey
          </button>
        )}
      </div>

      {/* Hint text below SVG */}
      <p className="relative z-10 mt-6 text-sm font-body text-muted-foreground">
        Click the badge on the renal pyramid to begin
      </p>
    </div>
  );
}
