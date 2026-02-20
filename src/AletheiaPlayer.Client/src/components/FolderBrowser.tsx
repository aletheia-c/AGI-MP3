import { useState } from 'react';
import { playerApi } from '../api/playerApi';
import type { TrackInfo } from '../api/playerApi';
import './FolderBrowser.css';

interface FolderBrowserProps {
  onTracksLoaded: (tracks: TrackInfo[]) => void;
}

export function FolderBrowser({ onTracksLoaded }: FolderBrowserProps) {
  const [folderPath, setFolderPath] = useState('C:\\Music');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadFolder = async () => {
    if (!folderPath.trim()) {
      setError('Please enter a folder path');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tracks = await playerApi.getLibraryFiles(folderPath);
      onTracksLoaded(tracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadFolder();
    }
  };

  return (
    <div className="folder-browser">
      <div className="folder-input-group">
        <input
          type="text"
          className="folder-input"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="C:\Music"
          disabled={isLoading}
        />
        <button
          className="folder-button"
          onClick={handleLoadFolder}
          disabled={isLoading}
        >
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2 3C2 2.44772 2.44772 2 3 2H6L7 4H13C13.5523 4 14 4.44772 14 5V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3Z" />
              </svg>
              Open Folder
            </>
          )}
        </button>
      </div>
      {error && <div className="folder-error">{error}</div>}
    </div>
  );
}
