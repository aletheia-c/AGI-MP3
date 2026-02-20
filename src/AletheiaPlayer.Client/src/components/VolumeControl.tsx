import { useState, useRef, useEffect } from 'react';
import { playerApi } from '../api/playerApi';
import './VolumeControl.css';

interface VolumeControlProps {
  volume: number;
}

export function VolumeControl({ volume }: VolumeControlProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragVolume, setDragVolume] = useState(volume);
  const barRef = useRef<HTMLDivElement>(null);

  const currentVolume = isDragging ? dragVolume : volume;
  const percentage = currentVolume * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!barRef.current) return;
    setIsDragging(true);
    updateVolume(e.clientX);
  };

  const updateVolume = (clientX: number) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newVolume = x / rect.width;
    setDragVolume(newVolume);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateVolume(e.clientX);
    };

    const handleMouseUp = async () => {
      setIsDragging(false);
      try {
        await playerApi.setVolume(dragVolume);
      } catch (error) {
        console.error('Failed to set volume:', error);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragVolume]);

  const isMuted = currentVolume === 0;

  return (
    <div className="volume-control">
      <button
        className="volume-icon"
        onClick={() => playerApi.setVolume(isMuted ? 0.8 : 0)}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M2 6h3l4-4v14l-4-4H2V6z" />
            <line
              x1="12"
              y1="6"
              x2="16"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="6"
              x2="12"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M2 6h3l4-4v14l-4-4H2V6z" />
            <path
              d="M12 5c1.5 1 2 2 2 4s-.5 3-2 4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        )}
      </button>
      <div
        ref={barRef}
        className="volume-bar"
        onMouseDown={handleMouseDown}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        aria-label="Volume"
      >
        <div className="volume-bar-track">
          <div className="volume-bar-fill" style={{ width: `${percentage}%` }}>
            <div className="volume-bar-thumb" />
          </div>
        </div>
      </div>
      <span className="volume-percentage">{Math.round(percentage)}%</span>
    </div>
  );
}
