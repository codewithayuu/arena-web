import { ContestSubmissionError, type ContestAdmissionLease } from "@/lib/contest-submissions";

/** Retry the existing lease only. This never creates admission, changes its
 * expiry locally, or treats the browser clock as the contest authority. */
export function watchContestHeartbeat(callbacks: {
  renew: () => Promise<ContestAdmissionLease>;
  onRenewed: (lease: ContestAdmissionLease) => void;
  onUnavailable: () => void;
  onRejected: () => void;
  onCompleted: () => void;
}, schedule: (tick: () => void) => () => void = (tick) => {
  const timer = setInterval(tick, 20_000);
  return () => clearInterval(timer);
}): () => void {
  let stopped = false;
  let pending = false;
  let cancelTimer = () => {};
  async function tick() {
    if (stopped || pending) return;
    pending = true;
    let renewed: ContestAdmissionLease;
    try {
      renewed = await callbacks.renew();
    } catch (error) {
      if (!stopped) {
        if (error instanceof ContestSubmissionError && error.status === 410 && error.code === "CONTEST_COMPLETED") {
          stopped = true;
          cancelTimer();
          callbacks.onCompleted();
        } else if (error instanceof ContestSubmissionError && error.status >= 400 && error.status < 500 && error.status !== 429) {
          stopped = true;
          cancelTimer();
          callbacks.onRejected();
        } else {
          callbacks.onUnavailable();
        }
      }
      pending = false;
      return;
    }
    pending = false;
    if (!stopped) callbacks.onRenewed(renewed);
  }
  cancelTimer = schedule(() => { void tick(); });
  return () => { stopped = true; cancelTimer(); };
}
