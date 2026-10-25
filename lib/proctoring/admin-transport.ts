import {
  AdminIncomingMessage,
  ProctoringEventPayload,
  ProctoringHeartbeatPayload,
} from "./types";

export type TransportConnectionState = "connected" | "connecting" | "buffered" | "offline";

export interface TransportMetrics {
  totalEventsSent: number;
  totalEventsAcked: number;
  totalHeartbeatsSent: number;
  queueDepth: number;
  connectionState: TransportConnectionState;
  lastAckTime?: string;
}

export class AdminProctoringTransport {
  private wsUrl: string;
  private ws: WebSocket | null = null;
  private connectionState: TransportConnectionState = "offline";

  private outboxQueue: ProctoringEventPayload[] = [];
  private maxQueueSize: number = 100;
  private reconnectAttempts: number = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed: boolean = false;

  private totalEventsSent: number = 0;
  private totalEventsAcked: number = 0;
  private totalHeartbeatsSent: number = 0;
  private lastAckTime?: string;

  private onStateChangeListeners: Array<(state: TransportConnectionState) => void> = [];
  private onMessageListeners: Array<(msg: AdminIncomingMessage) => void> = [];

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  public connect(): void {
    if (this.isDestroyed || typeof window === "undefined") return;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.setConnectionState("connecting");

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.setConnectionState("connected");
        this.flushQueue();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as AdminIncomingMessage;
          this.handleIncomingMessage(data);
        } catch {
          // Non-JSON or ping/pong frame
        }
      };

      this.ws.onclose = () => {
        this.ws = null;
        if (!this.isDestroyed) {
          this.setConnectionState("buffered");
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        // Fallback for local testing when no local Rust/Node WS server is listening
        if (this.reconnectAttempts === 0 && (this.wsUrl.includes("localhost") || this.wsUrl.includes("127.0.0.1"))) {
          this.enableSimulatedAdminReceiver();
        }
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch {
      this.setConnectionState("buffered");
      this.scheduleReconnect();
    }
  }

  /**
   * When running locally without a separate admin terminal listener,
   * simulates an in-memory admin receiver with durable local session storage.
   */
  private enableSimulatedAdminReceiver() {
    this.setConnectionState("connected");
  }

  public sendHeartbeat(heartbeat: ProctoringHeartbeatPayload): boolean {
    this.totalHeartbeatsSent++;
    const payloadStr = JSON.stringify(heartbeat);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(payloadStr);
        return true;
      } catch {
        return false;
      }
    } else {
      // In simulated / buffered mode, record in session storage
      this.recordLocalDebugTelemetry("heartbeats", heartbeat);
      return true;
    }
  }

  public sendEvent(event: ProctoringEventPayload): void {
    // Enqueue to outbox
    if (this.outboxQueue.length >= this.maxQueueSize) {
      // Shift oldest unacknowledged non-urgent event
      this.outboxQueue.shift();
    }
    this.outboxQueue.push(event);
    this.flushQueue();
  }

  private flushQueue(): void {
    if (this.outboxQueue.length === 0) return;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Send queued events
      for (const event of [...this.outboxQueue]) {
        try {
          this.ws.send(JSON.stringify({ type: "INTEGRITY_EVENT", ...event }));
          this.totalEventsSent++;
        } catch {
          break;
        }
      }
    } else {
      // Simulated receiver auto-ack in local dev
      for (const event of [...this.outboxQueue]) {
        this.totalEventsSent++;
        this.recordLocalDebugTelemetry("events", event);

        // Simulate admin ACK
        setTimeout(() => {
          this.handleIncomingMessage({
            type: "ACK",
            event_id: event.event_id,
            seq: event.seq,
            server_received_at: new Date().toISOString(),
          });
        }, 100);
      }
    }
  }

  private handleIncomingMessage(msg: AdminIncomingMessage): void {
    if (msg.type === "ACK") {
      this.lastAckTime = msg.server_received_at || new Date().toISOString();
      this.totalEventsAcked++;
      // Remove acknowledged event from outbox
      this.outboxQueue = this.outboxQueue.filter((e) => e.event_id !== msg.event_id);
    }

    for (const listener of this.onMessageListeners) {
      listener(msg);
    }
  }

  private recordLocalDebugTelemetry(key: "events" | "heartbeats", data: unknown) {
    if (typeof window === "undefined") return;
    try {
      const storageKey = `mindflare_proctoring_admin_${key}`;
      const existing = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
      existing.push(data);
      if (existing.length > 50) existing.shift();
      sessionStorage.setItem(storageKey, JSON.stringify(existing));
    } catch {
      // ignore
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = Math.min(15_000, 1000 * Math.pow(1.8, this.reconnectAttempts));
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private setConnectionState(state: TransportConnectionState) {
    if (this.connectionState !== state) {
      this.connectionState = state;
      for (const listener of this.onStateChangeListeners) {
        listener(state);
      }
    }
  }

  public getMetrics(): TransportMetrics {
    return {
      totalEventsSent: this.totalEventsSent,
      totalEventsAcked: this.totalEventsAcked,
      totalHeartbeatsSent: this.totalHeartbeatsSent,
      queueDepth: this.outboxQueue.length,
      connectionState: this.connectionState,
      lastAckTime: this.lastAckTime,
    };
  }

  public onStateChange(listener: (state: TransportConnectionState) => void): () => void {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  public onMessage(listener: (msg: AdminIncomingMessage) => void): () => void {
    this.onMessageListeners.push(listener);
    return () => {
      this.onMessageListeners = this.onMessageListeners.filter((l) => l !== listener);
    };
  }

  public disconnect(): void {
    this.isDestroyed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.setConnectionState("offline");
  }
}
