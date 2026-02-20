import { useState, useEffect } from 'react';
import { usePlayerState } from '../hooks/usePlayerState';
import { playerApi } from '../api/playerApi';
import type { TrackInfo } from '../api/playerApi';
import { Sidebar } from './Sidebar';
import { AlbumGrid } from './AlbumGrid';
import { Playlist } from './Playlist';
import { Controls } from './Controls';
import { SeekBar } from './SeekBar';
import { VolumeControl } from './VolumeControl';
import './Player.css';

type ViewType = 'albums' | 'songs' | 'artists' | 'genres';

export function Player() {
  const { state, pausePolling, resumePolling } = usePlayerState();
  const [tracks, setTracks] = useState<TrackInfo[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('albums');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const settings = await playerApi.getSettings();
      if (settings.lastFolder) {
        setIsLoading(true);
        try {
          const loadedTracks = await playerApi.getLibraryFiles(settings.lastFolder);
          setTracks(loadedTracks);
        } catch (error) {
          console.error('Failed to load last folder:', error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const handleMessage = async (event: any) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data.type === 'LOAD_FOLDER' && data.folder) {
          setIsLoading(true);
          const loadedTracks = await playerApi.getLibraryFiles(data.folder);
          setTracks(loadedTracks);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to handle message from host:', error);
        setIsLoading(false);
      }
    };

    const webview = window.chrome?.webview;
    if (webview) {
      webview.addEventListener('message', handleMessage);

      return () => {
        webview.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  const handlePlay = async () => {
    try {
      await playerApi.play();
    } catch (error) {
      console.error('Failed to play:', error);
    }
  };

  const handlePause = async () => {
    try {
      await playerApi.pause();
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  };

  const handleStop = async () => {
    try {
      await playerApi.stop();
    } catch (error) {
      console.error('Failed to stop:', error);
    }
  };

  const handleTrackSelect = async (filePath: string) => {
    try {
      await playerApi.play(filePath);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  return (
    <div className="player">
      <div className="player-toolbar">
        <div className="player-toolbar-left">
          <Controls
            status={state.status}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
          />
        </div>
        <div className="player-toolbar-center">
          {isLoading ? (
            <div className="toolbar-loading">
              <div className="toolbar-loading-spinner"></div>
              <span className="toolbar-loading-text">Loading library...</span>
            </div>
          ) : (
            <div className="now-playing-info">
              {state.title && (
                <>
                  <span className="now-playing-title">{state.title}</span>
                  <span className="now-playing-artist">{state.artist}</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className="player-toolbar-right">
        </div>
      </div>

      <div className="player-body">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        <div className="player-content">
          {currentView === 'albums' && (
            <AlbumGrid
              tracks={tracks}
              currentFilePath={state.currentFilePath}
              onTrackSelect={handleTrackSelect}
            />
          )}
          {currentView === 'songs' && (
            <Playlist
              tracks={tracks}
              currentFilePath={state.currentFilePath}
              onTrackSelect={handleTrackSelect}
            />
          )}
          {(currentView === 'artists' || currentView === 'genres') && (
            <div className="view-placeholder">
              <p>{currentView.charAt(0).toUpperCase() + currentView.slice(1)} view</p>
              <p className="view-placeholder-hint">Coming soon...</p>
            </div>
          )}
        </div>
      </div>

      <div className="player-footer">
        <SeekBar
          positionSeconds={state.positionSeconds}
          durationSeconds={state.durationSeconds}
          onSeekStart={pausePolling}
          onSeekEnd={resumePolling}
        />
        <div className="player-footer-controls">
          <div className="player-footer-left"></div>
          <div className="player-footer-center"></div>
          <div className="player-footer-right">
            <VolumeControl volume={state.volume} />
          </div>
        </div>
      </div>
    </div>
  );
}
