import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ArenaPreview } from "./arena-preview";
import styles from "./deadlock.module.css";

export const metadata: Metadata = {
  title: "Deadlock Arena | Mindflare",
  description: "A 2D preview of the DEADLOCK '26 autonomous agent arena.",
};

export default function DeadlockArenaPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              DEADLOCK ’26 <span className={styles.eyebrowDivider}>/</span> AGENT ARENA
            </p>
            <h1 className={styles.title}>
              Deadlock <span>Arena</span>
            </h1>
            <p className={styles.description}>
              Five autonomous teams. Two alien units each. One Warden inside a failing containment facility.
            </p>
          </div>

          <div className={styles.facts} aria-label="Arena format">
            <div className={styles.fact}>
              <span className={styles.factValue}>20 × 20</span>
              <span className={styles.factLabel}>TACTICAL GRID</span>
            </div>
            <div className={styles.factDivider} aria-hidden="true" />
            <div className={styles.fact}>
              <span className={styles.factValue}>5</span>
              <span className={styles.factLabel}>PER MATCH</span>
            </div>
            <div className={styles.factDivider} aria-hidden="true" />
            <div className={styles.fact}>
              <span className={styles.factValue}>160</span>
              <span className={styles.factLabel}>TURNS</span>
            </div>
          </div>
        </header>

        <section className={styles.arenaPanel} aria-labelledby="arena-preview-title">
          <div className={styles.panelHeader}>
            <div className={styles.panelHeading}>
              <span className={styles.panelIndex}>01</span>
              <div>
                <h2 id="arena-preview-title" className={styles.panelTitle}>Containment field</h2>
                <p className={styles.panelSubtitle}>A schematic look inside the arena</p>
              </div>
            </div>
            <span className={styles.previewTag}>
              <span aria-hidden="true" />
              VISUAL PREVIEW
            </span>
          </div>

          <ArenaPreview />

          <div className={styles.panelFooter}>
            <p className={styles.legendTitle}>FIELD KEY</p>
            <ul className={styles.legend} aria-label="Arena field key">
              <li><span className={`${styles.legendMark} ${styles.relayMark}`} aria-hidden="true" /> Relay</li>
              <li><span className={`${styles.legendMark} ${styles.fluxMark}`} aria-hidden="true" /> Flux well</li>
              <li><span className={`${styles.legendMark} ${styles.wardenMark}`} aria-hidden="true" /> Warden</li>
              <li><span className={`${styles.legendMark} ${styles.agentMark}`} aria-hidden="true" /> Agent unit</li>
            </ul>
            <p className={styles.previewNote}>SCHEMATIC · NOT A LIVE MATCH</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
