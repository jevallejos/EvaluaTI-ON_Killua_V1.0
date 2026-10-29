import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  ActionClassification,
  InfrastructureState,
  PlatformLayerId,
  SystemImpactLevel,
  TelemetryEvent,
  TelemetryInteractionSource,
} from '@evaluati-on/shared-types';

/**
 * Métricas ejecutivas consolidadas en tiempo real para el Executive Scorecard.
 */
export interface ExecutiveTelemetryMetrics {
  timeToResolutionSeconds: number;
  errorRatePct: number;
  diagnosticToActionRatio: number;
  destructiveActionsCount: number;
  operationalCertaintyScore: number;
  totalEventsCount: number;
  averageTypingCadenceWpm: number;
  clipboardPasteEventsCount: number;
}

/**
 * Fotograma forense para reproducción en el reproductor Time-Machine.
 */
export interface ForensicTimelineFrame {
  frameIndex: number;
  elapsedSecondsFromStart: number;
  event: TelemetryEvent;
  cumulativeMetrics: ExecutiveTelemetryMetrics;
  stateSnapshot?: InfrastructureState;
}

export interface RecordTelemetryInput {
  platformId: PlatformLayerId;
  interactionSource: TelemetryInteractionSource;
  commandOrAction: string;
  exitCode: number;
  actionClassification: ActionClassification;
  systemImpact: SystemImpactLevel;
  latencyMs: number;
  stateSnapshot?: InfrastructureState;
  timestampIso?: string;
}

/**
 * Colector Forense Institucional de Telemetría (Clase + Motor Time-Machine).
 */
export class TelemetryCollector {
  private readonly sessionId: string;
  private readonly candidateToken: string;
  private readonly sessionStartEpochMs: number;
  private readonly events: TelemetryEvent[] = [];
  private readonly frames: ForensicTimelineFrame[] = [];
  private keystrokeTimestampsMs: number[] = [];
  private pendingClipboardPasteFlag = false;
  private resolutionTimestampMs: number | null = null;

  constructor(sessionId: string, candidateToken: string, sessionStartEpochMs: number = Date.now()) {
    this.sessionId = sessionId;
    this.candidateToken = candidateToken;
    this.sessionStartEpochMs = sessionStartEpochMs;
  }

  /**
   * Registra pulsaciones de teclado individuales para calcular cadencia WPM real.
   */
  public recordKeystroke(timestampMs: number = Date.now()): void {
    this.keystrokeTimestampsMs.push(timestampMs);
  }

  /**
   * Marca que el comando o acción actual provino de un evento de pegado del portapapeles.
   */
  public notifyClipboardPaste(): void {
    this.pendingClipboardPasteFlag = true;
  }

  /**
   * Marca la sesión o misión como resuelta para fijar timeToResolutionSeconds.
   */
  public markChallengeResolved(timestampMs: number = Date.now()): void {
    if (this.resolutionTimestampMs === null) {
      this.resolutionTimestampMs = timestampMs;
    }
  }

  /**
   * Calcula la cadencia de tipeo en palabras por minuto (estándar 5 caracteres = 1 palabra)
   * usando la ventana de pulsaciones previas al envío del comando.
   */
  public computeCurrentTypingCadenceWpm(commandLength: number): number {
    if (this.keystrokeTimestampsMs.length < 2) {
      return commandLength > 0 ? 45 : 0;
    }
    const firstKeyMs = this.keystrokeTimestampsMs[0] ?? 0;
    const lastKeyMs = this.keystrokeTimestampsMs[this.keystrokeTimestampsMs.length - 1] ?? firstKeyMs;
    const durationMinutes = (lastKeyMs - firstKeyMs) / 60000;

    if (durationMinutes <= 0.001) {
      return 120;
    }
    const effectiveChars = Math.max(this.keystrokeTimestampsMs.length, commandLength);
    const standardWords = effectiveChars / 5;
    return Number(Math.min(240, Math.max(1, standardWords / durationMinutes)).toFixed(2));
  }

  /**
   * Registra un nuevo TelemetryEvent, limpia el buffer de tipeo actual y genera un fotograma Time-Machine.
   */
  public recordEvent(input: RecordTelemetryInput): TelemetryEvent {
    const nowIso = input.timestampIso ?? new Date().toISOString();
    const nowMs = Date.parse(nowIso);
    const typingCadenceWpm =
      input.interactionSource === 'CLI_TERMINAL'
        ? this.computeCurrentTypingCadenceWpm(input.commandOrAction.length)
        : undefined;

    const event: TelemetryEvent = {
      eventId: `evt_${this.sessionId}_${this.events.length + 1}_${nowMs}`,
      sessionId: this.sessionId,
      candidateToken: this.candidateToken,
      timestampIso: nowIso,
      platformId: input.platformId,
      interactionSource: input.interactionSource,
      commandOrAction: input.commandOrAction,
      exitCode: input.exitCode,
      actionClassification: input.actionClassification,
      systemImpact: input.systemImpact,
      latencyMs: input.latencyMs,
      typingCadenceWpm,
      clipboardPasteDetected: this.pendingClipboardPasteFlag,
    };

    this.events.push(event);
    this.keystrokeTimestampsMs = [];
    this.pendingClipboardPasteFlag = false;

    const cumulativeMetrics = this.computeExecutiveMetrics(nowMs);
    const elapsedSecondsFromStart = Math.max(
      0,
      Number(((nowMs - this.sessionStartEpochMs) / 1000).toFixed(2))
    );

    this.frames.push({
      frameIndex: this.frames.length,
      elapsedSecondsFromStart,
      event,
      cumulativeMetrics,
      stateSnapshot: input.stateSnapshot,
    });

    return event;
  }

  /**
   * Calcula en tiempo real las métricas ejecutivas de desempeño y certeza operativa.
   */
  public computeExecutiveMetrics(referenceEpochMs: number = Date.now()): ExecutiveTelemetryMetrics {
    const totalEventsCount = this.events.length;
    const effectiveEndMs = this.resolutionTimestampMs ?? referenceEpochMs;
    const timeToResolutionSeconds = Math.max(
      0,
      Number(((effectiveEndMs - this.sessionStartEpochMs) / 1000).toFixed(2))
    );

    if (totalEventsCount === 0) {
      return {
        timeToResolutionSeconds,
        errorRatePct: 0,
        diagnosticToActionRatio: 1,
        destructiveActionsCount: 0,
        operationalCertaintyScore: 100,
        totalEventsCount: 0,
        averageTypingCadenceWpm: 0,
        clipboardPasteEventsCount: 0,
      };
    }

    const failedEventsCount = this.events.filter(
      (e) => e.exitCode !== 0 || e.actionClassification === 'INVALID_SYNTAX'
    ).length;

    const diagnosticCount = this.events.filter(
      (e) => e.actionClassification === 'DIAGNOSTIC'
    ).length;

    const configurationOrDestructiveCount = this.events.filter(
      (e) =>
        e.actionClassification === 'CONFIGURATION' || e.actionClassification === 'DESTRUCTIVE'
    ).length;

    const destructiveActionsCount = this.events.filter(
      (e) =>
        e.actionClassification === 'DESTRUCTIVE' || e.systemImpact === 'CRITICAL_OUTAGE'
    ).length;

    const clipboardPasteEventsCount = this.events.filter(
      (e) => e.clipboardPasteDetected
    ).length;

    const wpmSamples = this.events
      .map((e) => e.typingCadenceWpm)
      .filter((wpm): wpm is number => typeof wpm === 'number');

    const averageTypingCadenceWpm =
      wpmSamples.length > 0
        ? Number(
            (wpmSamples.reduce((acc, val) => acc + val, 0) / wpmSamples.length).toFixed(2)
          )
        : 0;

    const errorRatePct = Number(((failedEventsCount / totalEventsCount) * 100).toFixed(2));
    const diagnosticToActionRatio = Number(
      (diagnosticCount / Math.max(1, configurationOrDestructiveCount)).toFixed(2)
    );

    // Cálculo ponderado del Operational Certainty Score (0..100)
    const errorPenalty = errorRatePct * 0.35;
    const destructivePenalty = destructiveActionsCount * 18;
    const pastePenalty = clipboardPasteEventsCount * 6;
    const diagnosticBonus = diagnosticToActionRatio >= 1.5 ? 8 : diagnosticToActionRatio >= 0.8 ? 4 : 0;

    const rawCertainty =
      100 - errorPenalty - destructivePenalty - pastePenalty + diagnosticBonus;
    const operationalCertaintyScore = Number(
      Math.max(0, Math.min(100, rawCertainty)).toFixed(2)
    );

    return {
      timeToResolutionSeconds,
      errorRatePct,
      diagnosticToActionRatio,
      destructiveActionsCount,
      operationalCertaintyScore,
      totalEventsCount,
      averageTypingCadenceWpm,
      clipboardPasteEventsCount,
    };
  }

  /**
   * Expone el historial de eventos crudos de telemetría.
   */
  public getEventsHistory(): readonly TelemetryEvent[] {
    return [...this.events];
  }

  /**
   * Expone la línea de tiempo completa para el reproductor Time-Machine Forense.
   */
  public getForensicTimeline(): readonly ForensicTimelineFrame[] {
    return [...this.frames];
  }

  /**
   * Obtiene el fotograma forense activo en un segundo específico de la reproducción Time-Machine.
   */
  public getFrameAtElapsedSecond(elapsedSeconds: number): ForensicTimelineFrame | null {
    if (this.frames.length === 0) {
      return null;
    }
    let candidateFrame: ForensicTimelineFrame | null = this.frames[0] ?? null;
    for (const frame of this.frames) {
      if (frame.elapsedSecondsFromStart <= elapsedSeconds) {
        candidateFrame = frame;
      } else {
        break;
      }
    }
    return candidateFrame;
  }
}

export interface UseTelemetryCollectorResult {
  events: readonly TelemetryEvent[];
  timeline: readonly ForensicTimelineFrame[];
  metrics: ExecutiveTelemetryMetrics;
  recordKeystroke: () => void;
  notifyClipboardPaste: () => void;
  recordEvent: (input: RecordTelemetryInput) => TelemetryEvent;
  markChallengeResolved: () => void;
  getFrameAtElapsedSecond: (elapsedSeconds: number) => ForensicTimelineFrame | null;
}

/**
 * Hook Reactivo envolvente de TelemetryCollector para consumo en consolas y Executive Scorecard.
 */
export function useTelemetryCollector(
  sessionId: string,
  candidateToken: string
): UseTelemetryCollectorResult {
  const collectorRef = useRef<TelemetryCollector>(
    new TelemetryCollector(sessionId, candidateToken)
  );
  const [versionTick, setVersionTick] = useState<number>(0);

  const recordKeystroke = useCallback((): void => {
    collectorRef.current.recordKeystroke();
  }, []);

  const notifyClipboardPaste = useCallback((): void => {
    collectorRef.current.notifyClipboardPaste();
  }, []);

  const recordEvent = useCallback((input: RecordTelemetryInput): TelemetryEvent => {
    const evt = collectorRef.current.recordEvent(input);
    setVersionTick((prev) => prev + 1);
    return evt;
  }, []);

  const markChallengeResolved = useCallback((): void => {
    collectorRef.current.markChallengeResolved();
    setVersionTick((prev) => prev + 1);
  }, []);

  const getFrameAtElapsedSecond = useCallback(
    (elapsedSeconds: number): ForensicTimelineFrame | null => {
      return collectorRef.current.getFrameAtElapsedSecond(elapsedSeconds);
    },
    []
  );

  const snapshot = useMemo(() => {
    // versionTick garantiza el recálculo inmutable tras cada evento registrado
    void versionTick;
    return {
      events: collectorRef.current.getEventsHistory(),
      timeline: collectorRef.current.getForensicTimeline(),
      metrics: collectorRef.current.computeExecutiveMetrics(),
    };
  }, [versionTick]);

  return {
    events: snapshot.events,
    timeline: snapshot.timeline,
    metrics: snapshot.metrics,
    recordKeystroke,
    notifyClipboardPaste,
    recordEvent,
    markChallengeResolved,
    getFrameAtElapsedSecond,
  };
}
