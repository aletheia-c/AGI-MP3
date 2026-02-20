export interface PlayerState {
  status: 'playing' | 'paused' | 'stopped';
  currentFilePath: string | null;
  title: string | null;
  artist: string | null;
  album: string | null;
  positionSeconds: number;
  durationSeconds: number;
  volume: number;
}

export interface TrackInfo {
  filePath: string;
  title: string;
  artist: string;
  albumArtist: string;
  album: string;
  durationSeconds: number;
  hasCoverArt: boolean;
}

export interface AppSettings {
  lastFolder: string | null;
}

const API_BASE = '/api';

export const playerApi = {
  async getState(): Promise<PlayerState> {
    const response = await fetch(`${API_BASE}/player/state`);
    if (!response.ok) throw new Error('Failed to fetch player state');
    return response.json();
  },

  async play(filePath?: string): Promise<void> {
    const response = await fetch(`${API_BASE}/player/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: filePath || null }),
    });
    if (!response.ok) throw new Error('Failed to play');
  },

  async pause(): Promise<void> {
    const response = await fetch(`${API_BASE}/player/pause`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to pause');
  },

  async stop(): Promise<void> {
    const response = await fetch(`${API_BASE}/player/stop`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to stop');
  },

  async seek(positionSeconds: number): Promise<void> {
    const response = await fetch(`${API_BASE}/player/seek`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ positionSeconds }),
    });
    if (!response.ok) throw new Error('Failed to seek');
  },

  async setVolume(volume: number): Promise<void> {
    const response = await fetch(`${API_BASE}/player/volume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volume }),
    });
    if (!response.ok) throw new Error('Failed to set volume');
  },

  async getLibraryFiles(folder: string): Promise<TrackInfo[]> {
    const response = await fetch(
      `${API_BASE}/library/files?folder=${encodeURIComponent(folder)}`
    );
    if (!response.ok) throw new Error('Failed to fetch library files');
    return response.json();
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const r = await fetch(`${API_BASE}/settings`);
      if (!r.ok) return { lastFolder: null };
      return r.json();
    } catch {
      return { lastFolder: null };
    }
  },

  getCoverArtUrl(filePath: string): string {
    return `${API_BASE}/metadata/cover?filePath=${encodeURIComponent(filePath)}`;
  },
};
