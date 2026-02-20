using AletheiaPlayer.Api.Models;
using NAudio.Wave;

namespace AletheiaPlayer.Api.Services;

public class AudioPlayerService : IDisposable
{
    private readonly object _lock = new();
    private readonly AppSettingsService _appSettings;
    private WaveOutEvent? _outputDevice;
    private AudioFileReader? _audioFile;
    private string? _currentFilePath;
    private string? _currentTitle;
    private string? _currentArtist;
    private string? _currentAlbum;
    private double _volume;

    public AudioPlayerService(AppSettingsService appSettings)
    {
        _appSettings = appSettings;
        _volume = _appSettings.GetVolume();
    }

    public void Play(string? filePath = null)
    {
        lock (_lock)
        {
            if (filePath != null && filePath != _currentFilePath)
            {
                CleanupInternal();

                _audioFile = new AudioFileReader(filePath);
                _audioFile.Volume = (float)_volume;

                _outputDevice = new WaveOutEvent();
                _outputDevice.Init(_audioFile);

                _currentFilePath = filePath;

                LoadMetadata(filePath);
            }

            _outputDevice?.Play();
        }
    }

    public void Pause()
    {
        lock (_lock)
        {
            _outputDevice?.Pause();
        }
    }

    public void Stop()
    {
        lock (_lock)
        {
            _outputDevice?.Stop();
            if (_audioFile != null)
                _audioFile.Position = 0;
        }
    }

    public void Seek(double positionSeconds)
    {
        lock (_lock)
        {
            if (_audioFile != null)
            {
                var clamped = Math.Clamp(positionSeconds, 0, _audioFile.TotalTime.TotalSeconds);
                _audioFile.CurrentTime = TimeSpan.FromSeconds(clamped);
            }
        }
    }

    public void SetVolume(double volume)
    {
        lock (_lock)
        {
            _volume = Math.Clamp(volume, 0.0, 1.0);
            if (_audioFile != null)
                _audioFile.Volume = (float)_volume;
        }
        _appSettings.SaveVolume(_volume);
    }

    public PlayerState GetState()
    {
        lock (_lock)
        {
            var status = _outputDevice?.PlaybackState switch
            {
                PlaybackState.Playing => "playing",
                PlaybackState.Paused => "paused",
                _ => "stopped"
            };

            return new PlayerState(
                Status: status,
                CurrentFilePath: _currentFilePath,
                Title: _currentTitle,
                Artist: _currentArtist,
                Album: _currentAlbum,
                PositionSeconds: _audioFile?.CurrentTime.TotalSeconds ?? 0,
                DurationSeconds: _audioFile?.TotalTime.TotalSeconds ?? 0,
                Volume: _volume
            );
        }
    }

    private void LoadMetadata(string filePath)
    {
        try
        {
            using var tagFile = TagLib.File.Create(filePath);
            _currentTitle = tagFile.Tag.Title ?? Path.GetFileNameWithoutExtension(filePath);
            _currentArtist = tagFile.Tag.FirstPerformer ?? "Artista sconosciuto";
            _currentAlbum = tagFile.Tag.Album ?? "Album sconosciuto";
        }
        catch
        {
            _currentTitle = Path.GetFileNameWithoutExtension(filePath);
            _currentArtist = "Artista sconosciuto";
            _currentAlbum = "Album sconosciuto";
        }
    }

    private void CleanupInternal()
    {
        _outputDevice?.Stop();
        _outputDevice?.Dispose();
        _audioFile?.Dispose();
        _outputDevice = null;
        _audioFile = null;
        _currentFilePath = null;
        _currentTitle = null;
        _currentArtist = null;
        _currentAlbum = null;
    }

    public void Dispose()
    {
        lock (_lock)
        {
            CleanupInternal();
        }
    }
}
