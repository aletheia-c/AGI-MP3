import { useState, useEffect } from 'react';
import { playerApi } from '../api/playerApi';
import type { PlayerState } from '../api/playerApi';

const POLL_INTERVAL = 250;

export function usePlayerState() {
  const [state, setState] = useState<PlayerState>({
    status: 'stopped',
    currentFilePath: null,
    title: null,
    artist: null,
    album: null,
    positionSeconds: 0,
    durationSeconds: 0,
    volume: 1,
  });

  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPolling) return;

    let mounted = true;
    let timeoutId: number;

    const poll = async () => {
      try {
        const newState = await playerApi.getState();
        if (mounted) {
          setState(newState);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (mounted) {
          timeoutId = window.setTimeout(poll, POLL_INTERVAL);
        }
      }
    };

    poll();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPolling]);

  return {
    state,
    error,
    pausePolling: () => setIsPolling(false),
    resumePolling: () => setIsPolling(true),
  };
}
