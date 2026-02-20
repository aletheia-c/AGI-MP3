import './Controls.css';

interface ControlsProps {
  status: 'playing' | 'paused' | 'stopped';
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export function Controls({ status, onPlay, onPause, onStop }: ControlsProps) {
  const handlePlayPause = () => {
    if (status === 'playing') {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="controls">
      <button
        className="control-button play-pause"
        onClick={handlePlayPause}
        aria-label={status === 'playing' ? 'Pause' : 'Play'}
      >
        {status === 'playing' ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="5" y="4" width="3" height="12" />
            <rect x="12" y="4" width="3" height="12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 4L16 10L6 16V4Z" />
          </svg>
        )}
      </button>
      <button
        className="control-button stop"
        onClick={onStop}
        disabled={status === 'stopped'}
        aria-label="Stop"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="5" y="5" width="10" height="10" />
        </svg>
      </button>
    </div>
  );
}
