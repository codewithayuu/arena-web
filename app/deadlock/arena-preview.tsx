import styles from "./deadlock.module.css";

type Team = {
  label: string;
  color: string;
  marker: "circle" | "diamond" | "triangle" | "square" | "hex";
};

const TEAMS: Team[] = [
  { label: "A", color: "#f04452", marker: "hex" },
  { label: "B", color: "#53c8dc", marker: "diamond" },
  { label: "C", color: "#f3b84b", marker: "triangle" },
  { label: "D", color: "#a891ef", marker: "square" },
  { label: "E", color: "#71cf9d", marker: "circle" },
];

function Relay({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`} className={styles.relay}>
      <circle r="34" fill="#e83040" fillOpacity=".035" stroke="#e83040" strokeOpacity=".24" strokeDasharray="3 7" />
      <circle r="22" fill="#171014" stroke="#e83040" strokeOpacity=".55" />
      <circle r="14" fill="#e83040" fillOpacity=".11" />
      <path d="M0-10 9 0 0 10-9 0Z" fill="#e83040" />
      <circle r="3" fill="#fff1f2" />
      <text x="0" y="49" textAnchor="middle" className={styles.mapLabel}>{`RELAY ${label}`}</text>
    </g>
  );
}

function FluxWell({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className={styles.fluxWell}>
      <circle r="19" fill="#07232a" fillOpacity=".8" stroke="#53c8dc" strokeOpacity=".45" />
      <circle r="12" fill="none" stroke="#53c8dc" strokeOpacity=".7" strokeDasharray="2 3" />
      <path d="M0-8 3-2 8 0 3 2 0 8-3 2-8 0-3-2Z" fill="#8ae8f2" />
    </g>
  );
}

function AgentUnit({
  x,
  y,
  team,
  kind,
  delay,
}: {
  x: number;
  y: number;
  team: Team;
  kind: "strider" | "bulwark";
  delay: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <circle r="19" fill={team.color} fillOpacity=".09" stroke={team.color} strokeOpacity=".32" />
      <g className={styles.agentFloat} style={{ animationDelay: `${delay}ms` }}>
        {kind === "strider" ? (
          <>
            <path d="M-5-9-11-17-2-12M5-9l6-8 2 10" fill="none" stroke={team.color} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M0-12C8-12 11-5 9 2L15 9 5 7 0 13-5 7-15 9-9 2C-11-5-8-12 0-12Z" fill="#18191e" stroke={team.color} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M-6-4-1-2M6-4 1-2" stroke="#f4f3fc" strokeWidth="2" strokeLinecap="round" />
            <path d="M-4 4 0 6 4 4" fill="none" stroke={team.color} strokeWidth="1.4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M-11-10 0-15 11-10 13 4 0 14-13 4Z" fill="#17181d" stroke={team.color} strokeWidth="2" strokeLinejoin="round" />
            <path d="M-8-5 0-10 8-5 6 5 0 9-6 5Z" fill={team.color} fillOpacity=".26" stroke={team.color} strokeOpacity=".85" />
            <path d="M-4-2H-1M1-2H4" stroke="#f4f3fc" strokeWidth="2" strokeLinecap="round" />
            <path d="M-15-5-19-8M15-5 19-8M-11 10-14 14M11 10 14 14" stroke={team.color} strokeWidth="1.7" strokeLinecap="round" />
          </>
        )}
        <MarkerShape marker={team.marker} color={team.color} />
      </g>
    </g>
  );
}

function MarkerShape({ marker, color }: { marker: Team["marker"]; color: string }) {
  const common = { fill: "#08090b", stroke: color, strokeWidth: 1.2 };

  if (marker === "diamond") return <path d="M0 8 4 12 0 16-4 12Z" {...common} />;
  if (marker === "triangle") return <path d="M0 8 4 15H-4Z" {...common} />;
  if (marker === "square") return <rect x="-3.5" y="8.5" width="7" height="7" rx="1" {...common} />;
  if (marker === "hex") return <path d="M-4 10-2 8H2L4 10V14L2 16H-2L-4 14Z" {...common} />;
  return <circle cy="12" r="3.5" {...common} />;
}

function WardenHunter() {
  return (
    <g transform="translate(280 320)" aria-hidden="true">
      <circle className={styles.telegraphPulse} r="70" fill="#e83040" fillOpacity=".035" stroke="#f04452" strokeOpacity=".55" strokeDasharray="5 8" />
      <circle r="42" fill="#e83040" fillOpacity=".045" stroke="#e83040" strokeOpacity=".24" />
      <path d="M0-28 8-19 21-23 19-10 29-3 20 6 23 19 10 18 0 29-9 19-22 21-19 8-29-2-18-11-21-23-8-19Z" fill="#210d12" stroke="#ef3346" strokeWidth="2" strokeLinejoin="round" />
      <path d="M-9-3 0-12 9-3 6 9 0 14-6 9Z" fill="#e83040" fillOpacity=".75" />
      <circle cy="1" r="4" fill="#ffe9eb" />
      <path d="M-32 0h-10M32 0h10M0-32v-10M0 32v10" stroke="#f04452" strokeOpacity=".55" strokeWidth="1.5" />
      <text x="0" y="54" textAnchor="middle" className={styles.wardenLabel}>WARDEN</text>
    </g>
  );
}

function TeamKey({ team, y }: { team: Team; y: number }) {
  return (
    <g transform={`translate(944 ${y})`}>
      <g transform="translate(0 -12)">
        <MarkerShape marker={team.marker} color={team.color} />
      </g>
      <text x="18" y="4" className={styles.teamLabel}>{`TEAM ${team.label}`}</text>
      <circle cx="130" cy="0" r="4" fill={team.color} fillOpacity=".8" />
    </g>
  );
}

export function ArenaPreview() {
  return (
    <div className={styles.mapViewport}>
      <svg
        className={styles.arenaSvg}
        viewBox="0 0 1200 680"
        role="img"
        aria-labelledby="deadlock-map-title deadlock-map-description"
      >
        <title id="deadlock-map-title">Deadlock Arena field preview</title>
        <desc id="deadlock-map-description">
          A schematic top-down 20 by 20 containment arena with five teams, two alien units per team, three relays, flux wells and the Warden.
        </desc>
        <defs>
          <linearGradient id="arena-floor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#111216" />
            <stop offset=".52" stopColor="#0b0c10" />
            <stop offset="1" stopColor="#111014" />
          </linearGradient>
          <radialGradient id="arena-core">
            <stop offset="0" stopColor="#e83040" stopOpacity=".11" />
            <stop offset="1" stopColor="#e83040" stopOpacity="0" />
          </radialGradient>
          <pattern id="arena-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="#d8d9e0" strokeOpacity=".075" strokeWidth=".8" />
          </pattern>
          <pattern id="arena-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0V8" stroke="#e83040" strokeOpacity=".18" strokeWidth="2" />
          </pattern>
          <filter id="arena-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="1200" height="680" fill="#08090b" />
        <rect x="16" y="16" width="1168" height="648" rx="18" fill="url(#arena-floor)" stroke="#ffffff" strokeOpacity=".09" />
        <circle cx="600" cy="348" r="370" fill="url(#arena-core)" />

        <g className={styles.mapSideInfo}>
          <text x="62" y="108" className={styles.mapKicker}>DEADLOCK ’26</text>
          <path d="M62 124H236" stroke="#e83040" strokeOpacity=".7" />
          <text x="62" y="158" className={styles.mapHeading}>CONTAINMENT</text>
          <text x="62" y="181" className={styles.mapHeading}>FACILITY</text>
          <text x="62" y="222" className={styles.mapCopy}>SIMULTANEOUS-TURN</text>
          <text x="62" y="241" className={styles.mapCopy}>STRATEGY ARENA</text>
          <path d="M62 269H236" stroke="#ffffff" strokeOpacity=".1" />
          <text x="62" y="304" className={styles.mapMicro}>THE FIELD</text>
          <text x="62" y="332" className={styles.mapValue}>20 × 20</text>
          <text x="62" y="365" className={styles.mapCopy}>3 CONTROL RELAYS</text>
          <text x="62" y="387" className={styles.mapCopy}>SCARCE FLUX</text>
          <text x="62" y="409" className={styles.mapCopy}>ONE WARDEN</text>
          <path d="M62 441H236" stroke="#ffffff" strokeOpacity=".1" />
          <circle cx="68" cy="473" r="4" fill="#e83040" />
          <text x="82" y="477" className={styles.mapMicro}>SCHEMATIC PREVIEW</text>
        </g>

        <g className={styles.teamKey}>
          <text x="944" y="112" className={styles.mapMicro}>FIELD SIGNATURES</text>
          <path d="M944 128H1128" stroke="#ffffff" strokeOpacity=".1" />
          {TEAMS.map((team, index) => <TeamKey key={team.label} team={team} y={165 + index * 42} />)}
          <path d="M944 388H1128" stroke="#ffffff" strokeOpacity=".1" />
          <path d="M944 418 952 426 944 434 936 426Z" fill="#e83040" fillOpacity=".25" stroke="#f04452" />
          <text x="964" y="430" className={styles.teamLabel}>WARDEN HUNTER</text>
          <text x="944" y="481" className={styles.mapMicro}>TWO UNITS PER TEAM</text>
          <text x="944" y="501" className={styles.mapMicro}>PERSISTENT PROCESS</text>
        </g>

        <g transform="translate(320 64)">
          <rect width="560" height="560" rx="5" fill="#0a0b0e" stroke="#c8c9d0" strokeOpacity=".22" />
          <rect width="560" height="560" fill="url(#arena-grid)" />

          <path d="M28 280H168L196 252H364L392 280H532M280 28V140L308 168V364L280 392V532" fill="none" stroke="#9b2633" strokeOpacity=".19" strokeWidth="16" />
          <path d="M28 280H168L196 252H364L392 280H532M280 28V140L308 168V364L280 392V532" fill="none" stroke="#f04452" strokeOpacity=".13" strokeWidth="1.4" strokeDasharray="3 8" />

          <g className={styles.ruins}>
            <path d="M56 84h72v42H56zM432 70h70v56h-70zM84 420h58v70H84zM418 430h86v44h-86zM224 196h42v28h-42z" fill="#17191e" stroke="#555961" strokeOpacity=".38" />
            <path d="M56 84h72v42H56zM432 70h70v56h-70zM84 420h58v70H84zM418 430h86v44h-86z" fill="url(#arena-hatch)" opacity=".58" />
            <path d="M72 96h38M448 84h36M98 438h30M436 446h48" stroke="#858892" strokeOpacity=".42" strokeWidth="2" />
          </g>

          <g fill="none" stroke="#dfe0e7" strokeOpacity=".12">
            <circle cx="280" cy="280" r="212" strokeDasharray="2 12" />
            <circle cx="280" cy="280" r="150" strokeDasharray="1 9" />
            <path d="M280 0V560M0 280H560" strokeDasharray="2 11" />
          </g>

          <Relay x={140} y={224} label="A" />
          <Relay x={420} y={224} label="B" />
          <Relay x={280} y={420} label="C" />
          <FluxWell x={280} y={140} />
          <FluxWell x={140} y={392} />
          <FluxWell x={420} y={392} />

          <g className={styles.spawnMarks} fill="none" stroke="#dfe0e7" strokeOpacity=".18">
            <path d="M28 28h22M28 28v22M532 28h-22M532 28v22M28 532h22M28 532v-22M532 532h-22M532 532v-22" />
          </g>

          <g filter="url(#arena-glow)">
            <WardenHunter />
          </g>

          <AgentUnit x={72} y={60} team={TEAMS[0]} kind="strider" delay={0} />
          <AgentUnit x={165} y={150} team={TEAMS[0]} kind="bulwark" delay={240} />
          <AgentUnit x={488} y={50} team={TEAMS[1]} kind="strider" delay={400} />
          <AgentUnit x={400} y={150} team={TEAMS[1]} kind="bulwark" delay={100} />
          <AgentUnit x={72} y={510} team={TEAMS[2]} kind="strider" delay={320} />
          <AgentUnit x={170} y={510} team={TEAMS[2]} kind="bulwark" delay={40} />
          <AgentUnit x={488} y={510} team={TEAMS[3]} kind="strider" delay={520} />
          <AgentUnit x={390} y={510} team={TEAMS[3]} kind="bulwark" delay={180} />
          <AgentUnit x={238} y={74} team={TEAMS[4]} kind="strider" delay={460} />
          <AgentUnit x={322} y={74} team={TEAMS[4]} kind="bulwark" delay={280} />

          <g transform="translate(16 16)" className={styles.mapCornerLabel}>
            <rect width="44" height="22" rx="4" fill="#090a0d" stroke="#ffffff" strokeOpacity=".16" />
            <text x="22" y="15" textAnchor="middle">N ↑</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
