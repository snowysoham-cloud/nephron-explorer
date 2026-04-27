import { NEPHRON_STAGES } from "@/data/nephronStages";
import type {
  NephronExplorerActions,
  NephronExplorerState,
} from "@/hooks/useNephronGame";
import type { AnimationType, NephronStage } from "@/types/nephron";
import { useEffect, useRef, useState } from "react";

interface AdventureMapPageProps {
  game: NephronExplorerState & NephronExplorerActions;
}

// ─── Stage color palette ─────────────────────────────────────────────────────
const STAGE_COLORS: Record<
  string,
  { bg: string; border: string; text: string; glow: string }
> = {
  "stage-1": {
    bg: "rgba(120,90,240,0.12)",
    border: "rgba(120,90,240,0.45)",
    text: "#7857e8",
    glow: "rgba(120,90,240,0.35)",
  },
  "stage-2": {
    bg: "rgba(40,180,100,0.12)",
    border: "rgba(40,180,100,0.45)",
    text: "#28b464",
    glow: "rgba(40,180,100,0.35)",
  },
  "stage-3": {
    bg: "rgba(240,130,30,0.12)",
    border: "rgba(240,130,30,0.45)",
    text: "#e07820",
    glow: "rgba(240,130,30,0.35)",
  },
  "stage-4": {
    bg: "rgba(160,60,230,0.12)",
    border: "rgba(160,60,230,0.45)",
    text: "#9e3ce6",
    glow: "rgba(160,60,230,0.35)",
  },
  "stage-5": {
    bg: "rgba(230,60,50,0.12)",
    border: "rgba(230,60,50,0.45)",
    text: "#e03c32",
    glow: "rgba(230,60,50,0.35)",
  },
};

// ─── Nephron Map node positions (within 500×620 viewBox) ────────────────────
const NODE_POSITIONS = [
  { x: 120, y: 80 }, // 0: Renal Corpuscle
  { x: 280, y: 120 }, // 1: Proximal Tubule
  { x: 280, y: 400 }, // 2: Loop of Henle
  { x: 130, y: 280 }, // 3: Distal Tubule
  { x: 260, y: 540 }, // 4: Collecting Duct
];

const PATHWAY_D =
  "M 120,80 C 200,80 280,60 280,120 C 280,200 340,300 280,400 C 220,500 160,420 130,280 C 100,160 180,100 200,200 C 220,300 260,440 260,540";

// ─── Animation data (used to generate keys instead of array index) ───────────
const CAPILLARY_LOOPS = [
  { key: "loop-a", rx: 18, ry: 12, rotate: 0 },
  { key: "loop-b", rx: 22, ry: 15, rotate: 55 },
  { key: "loop-c", rx: 26, ry: 18, rotate: 110 },
];

const REABSORPTION_ROWS = [
  { key: "row-50", y: 50, dur: "1.8s", begin: "0s" },
  { key: "row-80", y: 80, dur: "2.1s", begin: "0.3s" },
  { key: "row-110", y: 110, dur: "2.4s", begin: "0.6s" },
];

const LOOP_WATER = [
  { key: "water-50", cy: 50, dur: "1.8s", begin: "0s" },
  { key: "water-75", cy: 75, dur: "1.8s", begin: "0.6s" },
];

const LOOP_SALT = [
  { key: "salt-70", cy: 70, dur: "1.9s", begin: "0s" },
  { key: "salt-95", cy: 95, dur: "1.9s", begin: "0.5s" },
];

const COLLECTION_DROPS = [
  { key: "drop-35", cy: 35, dur: "1.6s", begin: "0s" },
  { key: "drop-60", cy: 60, dur: "1.85s", begin: "0.45s" },
  { key: "drop-85", cy: 85, dur: "2.1s", begin: "0.9s" },
];

// ─── Stage animations ────────────────────────────────────────────────────────

function FiltrationAnimation() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      role="img"
      aria-labelledby="filtr-title"
    >
      <title id="filtr-title">
        Filtration: blood enters glomerulus, filtrate passes into tubule
      </title>
      <defs>
        <radialGradient id="glomGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a070f0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7040c0" stopOpacity="0.1" />
        </radialGradient>
        <marker
          id="arrowBlue"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#5555ee" />
        </marker>
      </defs>
      <ellipse
        cx="100"
        cy="80"
        rx="55"
        ry="50"
        fill="none"
        stroke="#c0a0f0"
        strokeWidth="3"
        strokeDasharray="6,3"
      />
      <circle
        cx="100"
        cy="80"
        r="30"
        fill="url(#glomGrad)"
        stroke="#9060d0"
        strokeWidth="2"
      />
      {CAPILLARY_LOOPS.map(({ key, rx, ry, rotate }) => (
        <ellipse
          key={key}
          cx={100}
          cy={80}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="#b080e8"
          strokeWidth="1.5"
          transform={`rotate(${rotate} 100 80)`}
        />
      ))}
      <path
        d="M 30,60 Q 55,65 70,72"
        fill="none"
        stroke="#e05050"
        strokeWidth="3"
        markerEnd="url(#arrowBlue)"
      />
      <text x="8" y="55" fontSize="9" fill="#e05050" fontWeight="700">
        Blood in
      </text>
      <path
        d="M 70,88 Q 48,95 32,100"
        fill="none"
        stroke="#c03030"
        strokeWidth="2.5"
        markerEnd="url(#arrowBlue)"
      />
      <text x="4" y="115" fontSize="9" fill="#c03030" fontWeight="700">
        Blood out
      </text>
      <path
        d="M 100,132 L 100,150"
        fill="none"
        stroke="#6090e8"
        strokeWidth="2.5"
        markerEnd="url(#arrowBlue)"
      />
      <text x="62" y="160" fontSize="9" fill="#6090e8" fontWeight="700">
        Filtrate →
      </text>
      <circle cx="100" cy="80" r="3" fill="#88ccff" opacity="0.9">
        <animateMotion dur="2s" repeatCount="indefinite" path="M0,0 L0,50" />
      </circle>
      <circle cx="96" cy="76" r="2.5" fill="#aaddff" opacity="0.8">
        <animateMotion
          dur="2.3s"
          repeatCount="indefinite"
          begin="0.4s"
          path="M0,0 L0,50"
        />
      </circle>
      <text
        x="100"
        y="20"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#7040c0"
      >
        Ultrafiltration
      </text>
    </svg>
  );
}

function ReabsorptionAnimation() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      role="img"
      aria-labelledby="reabs-title"
    >
      <title id="reabs-title">
        Reabsorption: molecules leave tubule and enter bloodstream capillary
      </title>
      <defs>
        <marker
          id="arrowGreen"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#28b464" />
        </marker>
      </defs>
      <rect
        x="60"
        y="20"
        width="80"
        height="120"
        rx="12"
        fill="rgba(40,180,100,0.08)"
        stroke="#28b464"
        strokeWidth="2.5"
      />
      {["mv-0", "mv-1", "mv-2", "mv-3", "mv-4", "mv-5", "mv-6"].map(
        (key, i) => (
          <rect
            key={key}
            x={65 + i * 10}
            y="18"
            width="4"
            height="14"
            rx="2"
            fill="#28b464"
            opacity="0.6"
          />
        ),
      )}
      <rect
        x="148"
        y="35"
        width="30"
        height="90"
        rx="8"
        fill="rgba(230,70,70,0.1)"
        stroke="#e04444"
        strokeWidth="2"
      />
      <text
        x="163"
        y="84"
        textAnchor="middle"
        fontSize="8"
        fill="#e04444"
        fontWeight="700"
        transform="rotate(-90 163 84)"
      >
        capillary
      </text>
      {REABSORPTION_ROWS.map(({ key, y, dur, begin }) => (
        <g key={key}>
          <circle cx="100" cy={y} r="4" fill="#60cc88" opacity="0.9">
            <animateMotion
              dur={dur}
              repeatCount="indefinite"
              begin={begin}
              path="M0,0 L48,0"
            />
          </circle>
          <path
            d={`M 140,${y} L 148,${y}`}
            stroke="#28b464"
            strokeWidth="1.5"
            markerEnd="url(#arrowGreen)"
          />
        </g>
      ))}
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#1a8840"
      >
        Glucose, Na⁺ → Blood
      </text>
    </svg>
  );
}

function LoopAnimation() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      role="img"
      aria-labelledby="loop-title"
    >
      <title id="loop-title">
        Loop of Henle: water exits descending limb, salts exit ascending limb
      </title>
      <defs>
        <marker
          id="arrowOrange"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#e07820" />
        </marker>
      </defs>
      <path
        d="M 60,10 L 60,120 Q 60,145 100,145 Q 140,145 140,120 L 140,10"
        fill="none"
        stroke="#f0a040"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 68,10 L 68,118 Q 68,136 100,136 Q 132,136 132,118 L 132,10"
        fill="none"
        stroke="rgba(255,200,100,0.35)"
        strokeWidth="3"
      />
      <text x="20" y="55" fontSize="8" fill="#4488dd" fontWeight="700">
        H₂O
      </text>
      <text x="20" y="75" fontSize="8" fill="#4488dd" fontWeight="700">
        H₂O
      </text>
      {LOOP_WATER.map(({ key, cy, dur, begin }) => (
        <circle key={key} cx="60" cy={cy} r="3" fill="#88aaff" opacity="0.9">
          <animateMotion
            dur={dur}
            repeatCount="indefinite"
            begin={begin}
            path="M0,0 L-28,0"
          />
        </circle>
      ))}
      <text x="148" y="75" fontSize="8" fill="#e07820" fontWeight="700">
        Na⁺
      </text>
      <text x="148" y="100" fontSize="8" fill="#e07820" fontWeight="700">
        Cl⁻
      </text>
      {LOOP_SALT.map(({ key, cy, dur, begin }) => (
        <circle key={key} cx="140" cy={cy} r="3" fill="#ffcc66" opacity="0.9">
          <animateMotion
            dur={dur}
            repeatCount="indefinite"
            begin={begin}
            path="M0,0 L28,0"
          />
        </circle>
      ))}
      <text
        x="42"
        y="8"
        textAnchor="middle"
        fontSize="9"
        fill="#e07820"
        fontWeight="700"
      >
        ↓ descend
      </text>
      <text
        x="155"
        y="8"
        textAnchor="middle"
        fontSize="9"
        fill="#e07820"
        fontWeight="700"
      >
        ascend ↑
      </text>
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#b05010"
      >
        Countercurrent Multiplier
      </text>
    </svg>
  );
}

function SecretionAnimation() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      role="img"
      aria-labelledby="secr-title"
    >
      <title id="secr-title">
        Secretion: aldosterone triggers Na+ reabsorption and K+ secretion
      </title>
      <defs>
        <marker
          id="arrowPurple"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#9e3ce6" />
        </marker>
      </defs>
      <rect
        x="65"
        y="25"
        width="70"
        height="110"
        rx="10"
        fill="rgba(160,60,230,0.08)"
        stroke="#9e3ce6"
        strokeWidth="2.5"
      />
      <circle
        cx="24"
        cy="60"
        r="14"
        fill="rgba(220,140,40,0.15)"
        stroke="#e09020"
        strokeWidth="2"
      />
      <text
        x="24"
        y="57"
        textAnchor="middle"
        fontSize="7"
        fill="#b06010"
        fontWeight="700"
      >
        Aldo-
      </text>
      <text
        x="24"
        y="67"
        textAnchor="middle"
        fontSize="7"
        fill="#b06010"
        fontWeight="700"
      >
        sterone
      </text>
      <path
        d="M 38,68 L 65,80"
        stroke="#e09020"
        strokeWidth="1.5"
        strokeDasharray="3,2"
        markerEnd="url(#arrowPurple)"
      />
      <circle cx="100" cy="60" r="4" fill="#cc66ee" opacity="0.9">
        <animateMotion dur="2s" repeatCount="indefinite" path="M0,0 L-50,0" />
      </circle>
      <text x="2" y="98" fontSize="8" fill="#9e3ce6" fontWeight="700">
        K⁺ → lumen
      </text>
      <circle cx="165" cy="100" r="4" fill="#aa44dd" opacity="0.9">
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          begin="0.5s"
          path="M0,0 L-50,20"
        />
      </circle>
      <text x="148" y="95" fontSize="8" fill="#7030b0" fontWeight="700">
        Na⁺
      </text>
      <text x="148" y="106" fontSize="8" fill="#7030b0" fontWeight="700">
        ↓ in
      </text>
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#7030b0"
      >
        Hormone-Controlled Tuning
      </text>
    </svg>
  );
}

function CollectionAnimation() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      role="img"
      aria-labelledby="coll-title"
    >
      <title id="coll-title">
        Collection: ADH opens aquaporins, water exits, urine concentrates
      </title>
      <defs>
        <marker
          id="arrowRed"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#e03c32" />
        </marker>
      </defs>
      <rect
        x="80"
        y="10"
        width="40"
        height="115"
        rx="8"
        fill="rgba(230,60,50,0.08)"
        stroke="#e03c32"
        strokeWidth="2.5"
      />
      <ellipse
        cx="32"
        cy="45"
        rx="26"
        ry="18"
        fill="rgba(60,120,230,0.12)"
        stroke="#3060e0"
        strokeWidth="1.5"
        strokeDasharray="4,2"
      />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="8"
        fill="#2040b0"
        fontWeight="700"
      >
        ADH
      </text>
      <text
        x="32"
        y="53"
        textAnchor="middle"
        fontSize="8"
        fill="#2040b0"
        fontWeight="700"
      >
        signal
      </text>
      <path
        d="M 58,52 L 80,60"
        stroke="#3060e0"
        strokeWidth="1.5"
        strokeDasharray="3,2"
        markerEnd="url(#arrowRed)"
      />
      {COLLECTION_DROPS.map(({ key, cy, dur, begin }) => (
        <circle key={key} cx="80" cy={cy} r="3.5" fill="#88bbff" opacity="0.85">
          <animateMotion
            dur={dur}
            repeatCount="indefinite"
            begin={begin}
            path="M0,0 L-38,0"
          />
        </circle>
      ))}
      <text x="12" y="108" fontSize="8" fill="#3060e0" fontWeight="700">
        ← H₂O reabsorbed
      </text>
      <path
        d="M 100,125 L 100,148"
        stroke="#e03c32"
        strokeWidth="2"
        markerEnd="url(#arrowRed)"
      />
      <circle cx="100" cy="152" r="5" fill="#ff8866" opacity="0.8">
        <animate
          attributeName="r"
          values="4;6;4"
          dur="1.4s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="100"
        y="160"
        textAnchor="middle"
        fontSize="8"
        fill="#b02010"
        fontWeight="700"
      >
        Concentrated urine
      </text>
    </svg>
  );
}

function StageAnimation({ type }: { type: AnimationType }) {
  switch (type) {
    case "filtration":
      return <FiltrationAnimation />;
    case "reabsorption":
      return <ReabsorptionAnimation />;
    case "loop":
      return <LoopAnimation />;
    case "secretion":
      return <SecretionAnimation />;
    case "collection":
      return <CollectionAnimation />;
  }
}

// ─── Reabsorption bar ────────────────────────────────────────────────────────
function ReabsorptionBar({
  substance,
  percentage,
  color,
}: { substance: string; percentage: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-36 shrink-0 text-muted-foreground truncate">
        {substance}
      </span>
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs" style={{ color }}>
        {percentage}%
      </span>
    </div>
  );
}

// ─── Stage Detail Panel ──────────────────────────────────────────────────────
interface StageDetailProps {
  stage: NephronStage;
  stageIndex: number;
  totalStages: number;
  onNext: () => void;
  onBack: () => void;
}

function StageDetail({
  stage,
  stageIndex,
  totalStages,
  onNext,
  onBack,
}: StageDetailProps) {
  const colors = STAGE_COLORS[stage.colorVar];
  const isLast = stageIndex === totalStages - 1;

  return (
    <div
      className="fade-in flex flex-col gap-5 max-w-2xl mx-auto w-full"
      data-ocid="stage_detail.panel"
    >
      {/* Header */}
      <div
        className="rounded-2xl p-5 border"
        style={{ background: colors.bg, borderColor: colors.border }}
      >
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
            style={{
              background: colors.glow,
              border: `2px solid ${colors.border}`,
            }}
          >
            {stage.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: colors.glow, color: colors.text }}
              >
                Stage {stageIndex + 1} of {totalStages}
              </span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
              {stage.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {stage.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Animation + Substances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-4 border flex flex-col gap-2"
          style={{ background: colors.bg, borderColor: colors.border }}
        >
          <h3
            className="font-display font-semibold text-sm"
            style={{ color: colors.text }}
          >
            What happens here
          </h3>
          <div
            className="flex-1 flex items-center justify-center"
            style={{ minHeight: 160 }}
          >
            <div
              className="w-full"
              style={{ maxWidth: 200, aspectRatio: "200/160" }}
            >
              <StageAnimation type={stage.animationType} />
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl p-4 border flex flex-col gap-3"
          style={{ background: colors.bg, borderColor: colors.border }}
        >
          <h3
            className="font-display font-semibold text-sm"
            style={{ color: colors.text }}
          >
            Substances involved
          </h3>
          <ul className="flex flex-col gap-1.5">
            {stage.substances.map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 text-xs text-foreground"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: colors.text }}
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full description */}
      <div
        className="rounded-2xl p-5 border bg-card"
        style={{ borderColor: colors.border }}
      >
        <h3
          className="font-display font-semibold text-sm mb-2"
          style={{ color: colors.text }}
        >
          Deep dive
        </h3>
        <p className="text-sm text-foreground leading-relaxed">
          {stage.fullDesc}
        </p>
      </div>

      {/* Fun fact */}
      <div
        className="rounded-2xl p-4 border flex gap-3 items-start"
        style={{ background: colors.glow, borderColor: colors.border }}
      >
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <p
            className="font-display text-xs font-bold mb-1"
            style={{ color: colors.text }}
          >
            Fun Fact
          </p>
          <p className="text-xs text-foreground leading-relaxed">
            {stage.funFact}
          </p>
        </div>
      </div>

      {/* Reabsorption bars */}
      <div
        className="rounded-2xl p-5 border bg-card"
        style={{ borderColor: colors.border }}
      >
        <h3
          className="font-display font-semibold text-sm mb-3"
          style={{ color: colors.text }}
        >
          Processing rates
        </h3>
        <div className="flex flex-col gap-2.5">
          {stage.reabsorptionData.map((d) => (
            <ReabsorptionBar
              key={d.substance}
              substance={d.substance}
              percentage={d.percentage}
              color={colors.text}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between pt-1 pb-4">
        <button
          type="button"
          onClick={onBack}
          data-ocid="stage_detail.back_button"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-display font-semibold
            border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60
            transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Map
        </button>
        <button
          type="button"
          onClick={onNext}
          data-ocid="stage_detail.next_button"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-display font-bold
            text-white transition-smooth shadow-md hover:scale-105 active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            background: `linear-gradient(135deg, ${colors.text}, ${colors.border})`,
          }}
        >
          {isLast ? "🎉 Complete Journey" : "Next Stage"}
          {!isLast && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 2L10 7L5 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Nephron Map SVG ─────────────────────────────────────────────────────────
interface NephronMapSVGProps {
  visitedStages: Set<number>;
  currentStageIndex: number;
  explorationPhase: string;
  onNodeClick: (index: number) => void;
}

function NephronMapSVG({
  visitedStages,
  currentStageIndex,
  explorationPhase,
  onNodeClick,
}: NephronMapSVGProps) {
  return (
    <svg
      viewBox="0 0 500 620"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-labelledby="nephron-map-title"
      style={{ maxHeight: 560 }}
    >
      <title id="nephron-map-title">
        Interactive nephron pathway map inside kidney cross-section
      </title>
      <defs>
        <radialGradient id="kidneyGrad" cx="45%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#f5e8d0" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#e8c49a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c8a070" stopOpacity="0.2" />
        </radialGradient>
        <filter id="nodeShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Kidney silhouette */}
      <ellipse
        cx="230"
        cy="300"
        rx="200"
        ry="260"
        fill="url(#kidneyGrad)"
        stroke="#c8a070"
        strokeWidth="2"
        opacity="0.7"
      />
      <ellipse
        cx="230"
        cy="300"
        rx="185"
        ry="245"
        fill="none"
        stroke="#d4a878"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.5"
      />
      <ellipse
        cx="260"
        cy="300"
        rx="130"
        ry="170"
        fill="rgba(200,140,100,0.12)"
        stroke="#c09060"
        strokeWidth="1"
        opacity="0.6"
      />
      <ellipse
        cx="270"
        cy="530"
        rx="55"
        ry="38"
        fill="rgba(240,200,120,0.3)"
        stroke="#c8a040"
        strokeWidth="1.5"
      />
      <text
        x="270"
        y="534"
        textAnchor="middle"
        fontSize="9"
        fill="#8a6020"
        fontWeight="600"
      >
        Renal Pelvis
      </text>
      <text
        x="70"
        y="100"
        fontSize="10"
        fill="#8a6030"
        fontWeight="600"
        opacity="0.8"
      >
        Cortex
      </text>
      <text
        x="175"
        y="200"
        fontSize="9"
        fill="#7a5025"
        fontWeight="600"
        opacity="0.6"
      >
        Medulla
      </text>

      {/* Nephron pathway tube */}
      <path
        d={PATHWAY_D}
        fill="none"
        stroke="rgba(180,150,220,0.22)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={PATHWAY_D}
        fill="none"
        stroke="rgba(160,120,200,0.45)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={PATHWAY_D}
        fill="none"
        stroke="rgba(130,180,255,0.7)"
        strokeWidth="2"
        strokeLinecap="round"
        className="pathway-flow"
      />

      {/* Stage nodes */}
      {NEPHRON_STAGES.map((stage, i) => {
        const pos = NODE_POSITIONS[i];
        const colors = STAGE_COLORS[stage.colorVar];
        const visited = visitedStages.has(i);
        const isCurrentOrNext = i === currentStageIndex;
        const isDone = explorationPhase === "done";

        return (
          <g
            key={stage.id}
            transform={`translate(${pos.x}, ${pos.y})`}
            onClick={() => onNodeClick(i)}
            className="cursor-pointer"
            tabIndex={0}
            aria-label={`Stage ${i + 1}: ${stage.name}`}
            data-ocid={`map.node.${i + 1}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onNodeClick(i);
            }}
            style={{ outline: "none" }}
          >
            {(visited || isCurrentOrNext || isDone) && (
              <circle
                r={visited || isDone ? 30 : 26}
                fill={colors.glow}
                opacity={isDone ? 0.5 : visited ? 0.35 : 0.55}
                className={
                  isCurrentOrNext && !isDone ? "stage-pulse" : undefined
                }
              />
            )}
            <circle
              r="24"
              fill="transparent"
              stroke={colors.border}
              strokeWidth="1.5"
              opacity="0.5"
            />
            <circle
              r="18"
              fill={visited || isDone ? colors.text : "white"}
              stroke={colors.border}
              strokeWidth="2.5"
              filter="url(#nodeShadow)"
              opacity={visited || isCurrentOrNext || isDone ? 1 : 0.7}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="14"
              style={{ userSelect: "none" }}
            >
              {stage.emoji}
            </text>
            <g transform="translate(0, 26)">
              <rect
                x="-38"
                y="-8"
                width="76"
                height="18"
                rx="6"
                fill="rgba(255,255,255,0.88)"
                stroke={colors.border}
                strokeWidth="1"
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7.5"
                fontWeight="700"
                fill={colors.text}
                style={{ userSelect: "none" }}
              >
                {stage.name}
              </text>
            </g>
            {(visited || isDone) && (
              <g transform="translate(12, -12)">
                <circle r="7" fill={colors.text} />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="8"
                  fill="white"
                  style={{ userSelect: "none" }}
                >
                  ✓
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Floating droplet on current stage */}
      {explorationPhase !== "done" && (
        <g
          transform={`translate(${NODE_POSITIONS[currentStageIndex].x - 4}, ${NODE_POSITIONS[currentStageIndex].y - 38})`}
          className="float-droplet"
        >
          <text fontSize="18" style={{ userSelect: "none" }}>
            💧
          </text>
        </g>
      )}

      {/* Legend */}
      <g transform="translate(340, 30)">
        <rect
          x="0"
          y="0"
          width="145"
          height="80"
          rx="8"
          fill="rgba(255,255,255,0.82)"
          stroke="#d0c0a0"
          strokeWidth="1"
        />
        <text x="8" y="16" fontSize="8" fontWeight="700" fill="#604020">
          MAP LEGEND
        </text>
        <circle
          cx="16"
          cy="30"
          r="7"
          fill="white"
          stroke="#aaa"
          strokeWidth="1.5"
        />
        <text x="28" y="34" fontSize="7.5" fill="#605040">
          Unvisited stage
        </text>
        <circle cx="16" cy="47" r="7" fill="#7857e8" />
        <text
          x="16"
          y="51"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="7"
          fill="white"
        >
          ✓
        </text>
        <text x="28" y="51" fontSize="7.5" fill="#605040">
          Visited stage
        </text>
        <circle
          cx="16"
          cy="64"
          r="7"
          fill="rgba(120,90,240,0.3)"
          stroke="rgba(120,90,240,0.7)"
          strokeWidth="1.5"
        />
        <text x="28" y="68" fontSize="7.5" fill="#605040">
          💧 Your position
        </text>
      </g>
    </svg>
  );
}

// ─── Completion Overlay ──────────────────────────────────────────────────────
const CONFETTI_ITEMS = Array.from({ length: 30 }, (_, i) => ({
  key: `confetti-${i}`,
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  color: ["#7857e8", "#28b464", "#e07820", "#9e3ce6", "#e03c32"][i % 5],
  animDur: `${1.2 + (i % 5) * 0.3}s`,
  animDelay: `${(i % 8) * 0.1}s`,
}));

function CompletionOverlay({ onRestart }: { onRestart: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(10,5,30,0.82)", backdropFilter: "blur(6px)" }}
      data-ocid="completion.overlay"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {CONFETTI_ITEMS.map(({ key, left, top, color, animDur, animDelay }) => (
          <div
            key={key}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left,
              top,
              background: color,
              animation: `bounceGentle ${animDur} ease-in-out ${animDelay} infinite`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 rounded-3xl p-8 max-w-md w-full text-center fade-in"
        style={{
          background: "linear-gradient(145deg, #1a0840, #0d1a40)",
          border: "2px solid rgba(130,90,240,0.5)",
        }}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-display text-3xl font-bold text-white mb-2">
          Journey Complete!
        </h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          You&rsquo;ve explored the full nephron — from ultrafiltration in the
          glomerulus all the way to concentrated urine leaving the collecting
          duct.
        </p>
        <div className="flex gap-3 flex-wrap justify-center mb-6">
          {NEPHRON_STAGES.map((s) => (
            <span
              key={s.id}
              className="text-xs px-3 py-1.5 rounded-full font-bold"
              style={{
                background: STAGE_COLORS[s.colorVar].glow,
                color: STAGE_COLORS[s.colorVar].text,
                border: `1px solid ${STAGE_COLORS[s.colorVar].border}`,
              }}
            >
              {s.emoji} {s.name}
            </span>
          ))}
        </div>
        <div
          className="rounded-xl p-4 mb-6 text-left text-xs leading-relaxed"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p className="font-bold text-white mb-1">🧠 Quick recap:</p>
          <p className="text-muted-foreground">
            Filtration → Reabsorption (bulk) → Concentration loop → Fine-tuning
            → Final water control. The kidney filters your entire blood volume
            ~60× per day!
          </p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          data-ocid="completion.restart_button"
          className="w-full py-3 rounded-xl font-display font-bold text-white transition-smooth hover:scale-105 active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-lg"
          style={{ background: "linear-gradient(135deg, #7857e8, #e07820)" }}
        >
          Explore Again 🔄
        </button>
      </div>
    </div>
  );
}

// ─── Stage quick-access list (on map screen) ─────────────────────────────────
function StageList({
  visitedStages,
  onStageClick,
}: { visitedStages: Set<number>; onStageClick: (i: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground mb-1">
        Or jump to any stage:
      </p>
      {NEPHRON_STAGES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onStageClick(i)}
          data-ocid={`adventure_map.stage_link.${i + 1}`}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-display font-semibold
            border transition-smooth hover:scale-[1.02] active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left"
          style={{
            background: STAGE_COLORS[s.colorVar].bg,
            borderColor: STAGE_COLORS[s.colorVar].border,
            color: STAGE_COLORS[s.colorVar].text,
          }}
        >
          <span>{s.emoji}</span>
          <span className="flex-1">{s.name}</span>
          {visitedStages.has(i) && <span className="text-xs">✓</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Progress dots ───────────────────────────────────────────────────────────
function ProgressDots({
  visitedStages,
  currentStageIndex,
  explorationPhase,
}: {
  visitedStages: Set<number>;
  currentStageIndex: number;
  explorationPhase: string;
}) {
  return (
    <div className="flex gap-1.5">
      {NEPHRON_STAGES.map((s, i) => (
        <div
          key={s.id}
          className="w-2.5 h-2.5 rounded-full transition-smooth"
          style={{
            background: visitedStages.has(i)
              ? STAGE_COLORS[s.colorVar].text
              : "var(--color-muted-foreground, #888)",
            opacity: visitedStages.has(i) ? 1 : 0.3,
            transform:
              i === currentStageIndex && explorationPhase !== "done"
                ? "scale(1.5)"
                : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export function AdventureMapPage({ game }: AdventureMapPageProps) {
  const {
    explorationPhase,
    currentStageIndex,
    visitedStages,
    goToStage,
    returnToMap,
    goToWelcome,
    completeJourney,
  } = game;
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const [detailKey, setDetailKey] = useState(0);

  const currentStage = NEPHRON_STAGES[currentStageIndex];
  const allVisited = NEPHRON_STAGES.every((_, i) => visitedStages.has(i));

  function handleNodeClick(index: number) {
    setDetailKey((k) => k + 1);
    goToStage(index);
  }

  function handleNext() {
    const nextIndex = currentStageIndex + 1;
    if (nextIndex >= NEPHRON_STAGES.length) {
      completeJourney();
    } else {
      setDetailKey((k) => k + 1);
      goToStage(nextIndex);
    }
  }

  function handleBack() {
    returnToMap();
  }

  useEffect(() => {
    if (explorationPhase === "exploring" && detailScrollRef.current) {
      detailScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [explorationPhase]);

  return (
    <div
      className="flex-1 flex flex-col relative"
      data-ocid="adventure_map.page"
    >
      {explorationPhase === "done" && (
        <CompletionOverlay onRestart={goToWelcome} />
      )}

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* ── MAP PANEL ── */}
        <div
          className={`lg:w-2/5 xl:w-[42%] flex flex-col bg-muted/30 border-b lg:border-b-0 lg:border-r border-border
            ${explorationPhase === "exploring" ? "hidden lg:flex" : "flex"}`}
          data-ocid="adventure_map.map_panel"
        >
          <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Nephron Journey
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {allVisited
                  ? "All stages explored! 🌟"
                  : `${visitedStages.size} of ${NEPHRON_STAGES.length} stages visited`}
              </p>
            </div>
            <ProgressDots
              visitedStages={visitedStages}
              currentStageIndex={currentStageIndex}
              explorationPhase={explorationPhase}
            />
          </div>

          <div className="flex-1 px-4 pb-4 flex items-center justify-center overflow-hidden">
            <NephronMapSVG
              visitedStages={visitedStages}
              currentStageIndex={currentStageIndex}
              explorationPhase={explorationPhase}
              onNodeClick={handleNodeClick}
            />
          </div>

          <div className="px-5 pb-4 flex-shrink-0">
            <p className="text-xs text-muted-foreground text-center italic">
              Click any node to explore that stage
            </p>
          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        <div
          ref={detailScrollRef}
          className="flex-1 overflow-y-auto"
          data-ocid="adventure_map.detail_panel"
        >
          {explorationPhase === "map" && (
            <div className="h-full flex flex-col items-center justify-center px-6 py-12 fade-in">
              <div className="max-w-sm text-center">
                <div className="text-6xl mb-5">🫘</div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                  Ready to explore?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Your journey starts at the <strong>Renal Corpuscle</strong> —
                  click a node on the map to dive into any stage of the nephron,
                  or start from the beginning.
                </p>
                <button
                  type="button"
                  onClick={() => handleNodeClick(0)}
                  data-ocid="adventure_map.start_explore_button"
                  className="px-6 py-3 rounded-xl font-display font-bold text-white
                    transition-smooth hover:scale-105 active:scale-95 shadow-lg
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{
                    background: `linear-gradient(135deg, ${STAGE_COLORS["stage-1"].text}, ${STAGE_COLORS["stage-2"].text})`,
                  }}
                >
                  Start the Journey 🚀
                </button>
                <div className="mt-8">
                  <StageList
                    visitedStages={visitedStages}
                    onStageClick={handleNodeClick}
                  />
                </div>
              </div>
            </div>
          )}

          {explorationPhase === "exploring" && (
            <div className="px-4 sm:px-6 py-6" key={detailKey}>
              <button
                type="button"
                onClick={handleBack}
                data-ocid="adventure_map.mobile_back_button"
                className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground
                  transition-colors lg:hidden focus-visible:outline-none"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 2L4 7L9 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Map
              </button>
              <StageDetail
                stage={currentStage}
                stageIndex={currentStageIndex}
                totalStages={NEPHRON_STAGES.length}
                onNext={handleNext}
                onBack={handleBack}
              />
            </div>
          )}

          {explorationPhase === "done" && (
            <div className="h-full flex items-center justify-center p-8 fade-in">
              <div className="text-center">
                <p className="text-4xl mb-3">🌟</p>
                <p className="font-display text-lg font-bold text-foreground">
                  All stages explored!
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Check the completion panel
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
