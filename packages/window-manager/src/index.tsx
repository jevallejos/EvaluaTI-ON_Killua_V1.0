import { useCallback, useMemo, useState } from 'react';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Estado tipado de una ventana gestionada dentro del espacio de trabajo mutante.
 */
export interface ManagedWindowState {
  id: string;
  title: string;
  iconName: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
}

export const ACTIVE_WINDOW_Z_INDEX = 50;
export const MIN_INACTIVE_WINDOW_Z_INDEX = 10;
export const MAX_INACTIVE_WINDOW_Z_INDEX = 49;

/**
 * Reordena determinísticamente las capas zIndex garantizando que la ventana enfocada
 * reciba exactamente zIndex = 50 y todas las ventanas inactivas se distribuyan
 * secuencialmente entre 10 y 49 preservando su orden relativo previo.
 */
export function rebalanceWindowZIndices(
  windows: readonly ManagedWindowState[],
  focusedWindowId: string
): ManagedWindowState[] {
  const inactiveSorted = [...windows]
    .filter((w) => w.id !== focusedWindowId)
    .sort((a, b) => a.zIndex - b.zIndex);

  const inactiveZMap = new Map<string, number>();
  const totalInactive = inactiveSorted.length;

  inactiveSorted.forEach((win, idx) => {
    const computedZ = Math.min(
      MAX_INACTIVE_WINDOW_Z_INDEX,
      MIN_INACTIVE_WINDOW_Z_INDEX +
        Math.max(0, idx + (MAX_INACTIVE_WINDOW_Z_INDEX - MIN_INACTIVE_WINDOW_Z_INDEX + 1 - totalInactive))
    );
    const boundedZ = Math.max(
      MIN_INACTIVE_WINDOW_Z_INDEX,
      Math.min(MAX_INACTIVE_WINDOW_Z_INDEX, MIN_INACTIVE_WINDOW_Z_INDEX + idx)
    );
    inactiveZMap.set(
      win.id,
      totalInactive <= MAX_INACTIVE_WINDOW_Z_INDEX - MIN_INACTIVE_WINDOW_Z_INDEX + 1
        ? boundedZ
        : computedZ
    );
  });

  return windows.map((win) => {
    if (win.id === focusedWindowId) {
      return {
        ...win,
        zIndex: ACTIVE_WINDOW_Z_INDEX,
      };
    }
    return {
      ...win,
      zIndex: inactiveZMap.get(win.id) ?? MIN_INACTIVE_WINDOW_Z_INDEX,
    };
  });
}

export interface UseWindowManagementResult {
  windows: ManagedWindowState[];
  activeWindowId: string | null;
  openWindow: (windowId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  toggleMaximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: WindowPosition) => void;
  updateWindowSize: (windowId: string, size: WindowSize) => void;
}

/**
 * Hook institucional para gestionar ventanas flotantes en los cascarones de EvaluaTI-ON_Killua.
 */
export function useWindowManagement(
  initialWindows: readonly ManagedWindowState[]
): UseWindowManagementResult {
  const [windows, setWindows] = useState<ManagedWindowState[]>(() => [...initialWindows]);

  const focusWindow = useCallback((windowId: string): void => {
    setWindows((prev) => {
      const targetExists = prev.some((w) => w.id === windowId);
      if (!targetExists) {
        return prev;
      }
      return rebalanceWindowZIndices(prev, windowId);
    });
  }, []);

  const openWindow = useCallback((windowId: string): void => {
    setWindows((prev) => {
      const targetExists = prev.some((w) => w.id === windowId);
      if (!targetExists) {
        return prev;
      }
      const opened = prev.map((w) =>
        w.id === windowId ? { ...w, isOpen: true, isMinimized: false } : w
      );
      return rebalanceWindowZIndices(opened, windowId);
    });
  }, []);

  const closeWindow = useCallback((windowId: string): void => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              isOpen: false,
              isMinimized: false,
              isMaximized: false,
              zIndex: MIN_INACTIVE_WINDOW_Z_INDEX,
            }
          : w
      )
    );
  }, []);

  const minimizeWindow = useCallback((windowId: string): void => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              isMinimized: true,
              zIndex: MIN_INACTIVE_WINDOW_Z_INDEX,
            }
          : w
      )
    );
  }, []);

  const toggleMaximizeWindow = useCallback((windowId: string): void => {
    setWindows((prev) => {
      const toggled = prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              isOpen: true,
              isMinimized: false,
              isMaximized: !w.isMaximized,
            }
          : w
      );
      return rebalanceWindowZIndices(toggled, windowId);
    });
  }, []);

  const updateWindowPosition = useCallback(
    (windowId: string, position: WindowPosition): void => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? {
                ...w,
                position: {
                  x: Math.round(position.x),
                  y: Math.round(position.y),
                },
              }
            : w
        )
      );
    },
    []
  );

  const updateWindowSize = useCallback((windowId: string, size: WindowSize): void => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              size: {
                width: Math.max(240, Math.round(size.width)),
                height: Math.max(160, Math.round(size.height)),
              },
            }
          : w
      )
    );
  }, []);

  const activeWindowId = useMemo<string | null>(() => {
    const visibleWindows = windows.filter((w) => w.isOpen && !w.isMinimized);
    if (visibleWindows.length === 0) {
      return null;
    }
    const sortedByZ = [...visibleWindows].sort((a, b) => b.zIndex - a.zIndex);
    return sortedByZ[0]?.id ?? null;
  }, [windows]);

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  };
}
