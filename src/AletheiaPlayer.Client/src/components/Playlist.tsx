import type { TrackInfo } from '../api/playerApi';
import './Playlist.css';

interface PlaylistProps {
  tracks: TrackInfo[];
  currentFilePath: string | null;
  onTrackSelect: (filePath: string) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function Playlist({
  tracks,
  currentFilePath,
  onTrackSelect,
}: PlaylistProps) {
  if (tracks.length === 0) {
    return (
      <div className="playlist-empty">
        <p>No tracks loaded</p>
        <p className="playlist-empty-hint">
          Click "Open Folder" to load music files
        </p>
      </div>
    );
  }

  return (
    <div className="playlist">
      <table className="playlist-table">
        <thead>
          <tr>
            <th className="col-number">#</th>
            <th className="col-title">Title</th>
            <th className="col-artist">Artist</th>
            <th className="col-album">Album</th>
            <th className="col-duration">Time</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => {
            const isPlaying = track.filePath === currentFilePath;
            return (
              <tr
                key={track.filePath}
                className={isPlaying ? 'playing' : ''}
                onClick={() => onTrackSelect(track.filePath)}
              >
                <td className="col-number">{index + 1}</td>
                <td className="col-title">{track.title}</td>
                <td className="col-artist">{track.artist}</td>
                <td className="col-album">{track.album}</td>
                <td className="col-duration">
                  {formatDuration(track.durationSeconds)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
