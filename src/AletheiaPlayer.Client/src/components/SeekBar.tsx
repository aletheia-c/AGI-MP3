import { useState, useRef, useEffect } from 'react';
import { playerApi } from '../api/playerApi';
import './SeekBar.css';

interface SeekBarProps {
  positionSeconds: number;
  durationSeconds: number;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SeekBar({
  positionSeconds,
  durationSeconds,
  onSeekStart,
  onSeekEnd,
}: SeekBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  const currentPosition = isDragging ? dragPosition : positionSeconds;
  const percentage =
    durationSeconds > 0 ? (currentPosition / durationSeconds) * 100 : 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!barRef.current) return;
    setIsDragging(true);
    onSeekStart?.();
    updatePosition(e.clientX);
  };

  const updatePosition = (clientX: number) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newPosition = percentage * durationSeconds;
    setDragPosition(newPosition);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX);
    };

    const handleMouseUp = async () => {
      setIsDragging(false);
      try {
        await playerApi.seek(dragPosition);
      } catch (error) {
        console.error('Failed to seek:', error);
      }
      onSeekEnd?.();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragPosition, onSeekEnd]);

  return (
    <div className="seek-bar-container">
      <span className="time-display">{formatTime(currentPosition)}</span>
      <div
        ref={barRef}
        className="seek-bar"
        onMouseDown={handleMouseDown}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={durationSeconds}
        aria-valuenow={currentPosition}
        aria-label="Seek position"
      >
        <div className="seek-bar-track">
          <div className="seek-bar-fill" style={{ width: `${percentage}%` }}>
            <div className="seek-bar-thumb" />
          </div>
        </div>
      </div>
      <span className="time-display">{formatTime(durationSeconds)}</span>
    </div>
  );
}
