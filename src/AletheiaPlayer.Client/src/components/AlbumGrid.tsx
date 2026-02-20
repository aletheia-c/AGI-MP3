import { useState, useRef, useEffect, useCallback } from 'react';
import type { TrackInfo } from '../api/playerApi';
import { playerApi } from '../api/playerApi';
import './AlbumGrid.css';

interface Album {
  name: string;
  albumArtist: string;
  tracks: TrackInfo[];
  coverPath: string | null;
}

interface AlbumGridProps {
  tracks: TrackInfo[];
  currentFilePath: string | null;
  onTrackSelect: (filePath: string) => void;
}

function groupTracksByAlbum(tracks: TrackInfo[]): Album[] {
  const albumMap = new Map<string, Album>();

  tracks.forEach((track) => {
    const albumKey = `${track.album}-${track.albumArtist}`;

    if (!albumMap.has(albumKey)) {
      albumMap.set(albumKey, {
        name: track.album,
        albumArtist: track.albumArtist,
        tracks: [],
        coverPath: track.hasCoverArt ? track.filePath : null,
      });
    }

    albumMap.get(albumKey)!.tracks.push(track);
  });

  return Array.from(albumMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AlbumGrid({ tracks, currentFilePath, onTrackSelect }: AlbumGridProps) {
  const albums = groupTracksByAlbum(tracks);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePanelPosition = useCallback(() => {
    if (selectedIndex === null) {
      setPanelPos(null);
      return;
    }
    const card = cardRefs.current.get(selectedIndex);
    if (!card) {
      setPanelPos(null);
      return;
    }
    const rect = card.getBoundingClientRect();
    setPanelPos({ top: rect.top, left: rect.left, width: rect.width });
  }, [selectedIndex]);

  useEffect(() => {
    updatePanelPosition();
    const container = containerRef.current;
    container?.addEventListener('scroll', updatePanelPosition, { passive: true });
    window.addEventListener('resize', updatePanelPosition);
    return () => {
      container?.removeEventListener('scroll', updatePanelPosition);
      window.removeEventListener('resize', updatePanelPosition);
    };
  }, [updatePanelPosition]);

  const handleAlbumClick = (album: Album, index: number) => {
    if (selectedIndex === index) {
      setSelectedAlbum(null);
      setSelectedIndex(null);
      setPanelPos(null);
    } else {
      // Compute position synchronously so it's correct in the same render batch.
      const card = cardRefs.current.get(index);
      if (card) {
        const rect = card.getBoundingClientRect();
        setPanelPos({ top: rect.top, left: rect.left, width: rect.width });
      }
      setSelectedAlbum(album);
      setSelectedIndex(index);
    }
  };

  if (albums.length === 0) {
    return (
      <div className="album-grid-empty">
        <p>No albums in library</p>
        <p className="album-grid-empty-hint">
          Click "Open Folder" to load music files
        </p>
      </div>
    );
  }

  return (
    <div className="album-grid-wrapper">
      <div className="album-grid-container" ref={containerRef}>
        <div className="album-grid">
          {albums.map((album, index) => {
            const isSelected = selectedIndex === index;
            return (
              <div
                key={`${album.name}-${album.albumArtist}-${index}`}
                className={`album-card ${isSelected ? 'selected' : ''}`}
                ref={(el) => {
                  if (el) cardRefs.current.set(index, el);
                  else cardRefs.current.delete(index);
                }}
              >
                <div
                  className="album-card-header"
                  onClick={() => handleAlbumClick(album, index)}
                >
                  <div className="album-cover">
                    {album.coverPath ? (
                      <img
                        src={playerApi.getCoverArtUrl(album.coverPath)}
                        alt={album.name}
                        className="album-cover-image"
                      />
                    ) : (
                      <div className="album-cover-placeholder">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                          <rect width="80" height="80" fill="#e0e0e0" />
                          <path
                            d="M40 25L48 35H32L40 25Z M40 45C42 45 44 43 44 41C44 39 42 37 40 37C38 37 36 39 36 41C36 43 38 45 40 45Z"
                            fill="#b0b0b0"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="album-info">
                    <div className="album-name">{album.name}</div>
                    <div className="album-artist">{album.albumArtist}</div>
                    <div className="album-track-count">
                      {album.tracks.length} {album.tracks.length === 1 ? 'song' : 'songs'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedAlbum && panelPos && (() => {
        const coverSize = panelPos.width;

        // Width so the longest title fits in 1–2 lines.
        const longestTitle = Math.max(0, ...selectedAlbum.tracks.map(t => t.title.length));
        const minWidth = Math.min(Math.ceil(longestTitle / 2) * 7 + 160, 420);
        const bodyWidth = Math.max(coverSize, minWidth);

        // Body centered under the cover, clamped to viewport.
        const bodyTop = panelPos.top + coverSize;
        const bodyLeft = Math.max(
          8,
          Math.min(
            panelPos.left + coverSize / 2 - bodyWidth / 2,
            window.innerWidth - bodyWidth - 8,
          ),
        );

        return (
          <>
            {/* Cover — always exactly over the grid card, pointer-events:none so clicks reach the card */}
            <div
              className="album-overlay-cover-full"
              style={{ top: panelPos.top, left: panelPos.left, width: coverSize, height: coverSize }}
            >
              {selectedAlbum.coverPath ? (
                <img
                  src={playerApi.getCoverArtUrl(selectedAlbum.coverPath)}
                  alt={selectedAlbum.name}
                  className="album-cover-image"
                />
              ) : (
                <div className="album-cover-placeholder">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" fill="#e0e0e0" />
                    <path
                      d="M40 25L48 35H32L40 25Z M40 45C42 45 44 43 44 41C44 39 42 37 40 37C38 37 36 39 36 41C36 43 38 45 40 45Z"
                      fill="#b0b0b0"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Body — white card centered below the cover */}
            <div
              className="album-overlay-body"
              style={{
                top: bodyTop,
                left: bodyLeft,
                width: bodyWidth,
                maxHeight: `calc(100vh - ${bodyTop}px - 16px)`,
              }}
            >
              <div className="album-overlay-meta">
                <div className="album-overlay-name">{selectedAlbum.name}</div>
                <div className="album-overlay-artist">{selectedAlbum.albumArtist}</div>
                <div className="album-overlay-count">{selectedAlbum.tracks.length} songs</div>
              </div>

              <div className="album-overlay-tracks">
                <table className="album-detail-tracklist">
                  <tbody>
                    {selectedAlbum.tracks.map((track, idx) => {
                      const isPlaying = track.filePath === currentFilePath;
                      return (
                        <tr
                          key={track.filePath}
                          className={isPlaying ? 'playing' : ''}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTrackSelect(track.filePath);
                          }}
                        >
                          <td className="track-number">{idx + 1}</td>
                          <td className="track-title">{track.title}</td>
                          <td className="track-duration">
                            {formatDuration(track.durationSeconds)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
