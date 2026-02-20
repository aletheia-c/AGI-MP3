using System.Text.Json;
using AletheiaPlayer.Api.Models;

namespace AletheiaPlayer.Api.Services;

public class AppSettingsService
{
    private readonly string _appDataDir;
    private readonly string _settingsPath;
    private readonly string _cachePath;

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public AppSettingsService()
    {
        _appDataDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "AletheiaPlayer");
        _settingsPath = Path.Combine(_appDataDir, "settings.json");
        _cachePath = Path.Combine(_appDataDir, "library_cache.json");
        Directory.CreateDirectory(_appDataDir);
    }

    public string? GetLastFolder() => ReadSettings().LastFolder;

    public void SaveLastFolder(string folder)
    {
        var settings = ReadSettings();
        settings.LastFolder = folder;
        WriteSettings(settings);
    }

    public double GetVolume() => ReadSettings().Volume ?? 1.0;

    public void SaveVolume(double volume)
    {
        var settings = ReadSettings();
        settings.Volume = volume;
        WriteSettings(settings);
    }

    private SettingsFile ReadSettings()
    {
        try
        {
            if (!File.Exists(_settingsPath)) return new SettingsFile();
            var json = File.ReadAllText(_settingsPath);
            return JsonSerializer.Deserialize<SettingsFile>(json, _jsonOptions) ?? new SettingsFile();
        }
        catch { return new SettingsFile(); }
    }

    private void WriteSettings(SettingsFile settings)
    {
        try { File.WriteAllText(_settingsPath, JsonSerializer.Serialize(settings, _jsonOptions)); }
        catch { }
    }

    public List<TrackInfo>? TryGetValidCache(string folder)
    {
        try
        {
            if (!File.Exists(_cachePath)) return null;
            var json = File.ReadAllText(_cachePath);
            var cache = JsonSerializer.Deserialize<LibraryCacheFile>(json, _jsonOptions);
            if (cache == null) return null;
            if (!string.Equals(cache.Folder, folder, StringComparison.OrdinalIgnoreCase)) return null;

            var currentMtime = Directory.GetLastWriteTimeUtc(folder);
            if (currentMtime != cache.FolderLastModified) return null;

            return cache.Tracks;
        }
        catch
        {
            return null;
        }
    }

    public void SaveCache(string folder, List<TrackInfo> tracks)
    {
        try
        {
            var cache = new LibraryCacheFile
            {
                Folder = folder,
                CachedAt = DateTime.UtcNow,
                FolderLastModified = Directory.GetLastWriteTimeUtc(folder),
                Tracks = tracks
            };
            File.WriteAllText(_cachePath, JsonSerializer.Serialize(cache, _jsonOptions));
        }
        catch { }
    }

    private class SettingsFile
    {
        public string? LastFolder { get; set; }
        public double? Volume { get; set; }
    }

    private class LibraryCacheFile
    {
        public string Folder { get; set; } = string.Empty;
        public DateTime CachedAt { get; set; }
        public DateTime FolderLastModified { get; set; }
        public List<TrackInfo> Tracks { get; set; } = [];
    }
}
