import { playerApi } from '../api/playerApi';
import './TrackInfo.css';

interface TrackInfoProps {
  title: string | null;
  artist: string | null;
  album: string | null;
  filePath: string | null;
}

export function TrackInfo({ title, artist, album, filePath }: TrackInfoProps) {
  const hasCoverArt = filePath !== null;

  return (
    <div className="track-info">
      <div className="album-art">
        {hasCoverArt ? (
          <img
            src={playerApi.getCoverArtUrl(filePath)}
            alt="Album cover"
            className="cover-image"
          />
        ) : (
          <div className="cover-placeholder">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="80" height="80" fill="#444" />
              <path
                d="M40 20L50 35H30L40 20Z M40 45C42.7614 45 45 42.7614 45 40C45 37.2386 42.7614 35 40 35C37.2386 35 35 37.2386 35 40C35 42.7614 37.2386 45 40 45Z M25 60L35 45L45 55L55 45L55 60H25Z"
                fill="#666"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="track-details">
        <div className="track-title">{title || 'No track loaded'}</div>
        <div className="track-artist">{artist || '—'}</div>
        <div className="track-album">{album || '—'}</div>
      </div>
    </div>
  );
}
