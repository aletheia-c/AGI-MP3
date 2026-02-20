using AletheiaPlayer.Api.Models;

namespace AletheiaPlayer.Api.Services;

public class MetadataService
{
    public TrackInfo GetTrackInfo(string filePath)
    {
        try
        {
            using var file = TagLib.File.Create(filePath);
            var artist = file.Tag.FirstPerformer ?? "Artista sconosciuto";
            var albumArtist = file.Tag.FirstAlbumArtist ?? artist;

            return new TrackInfo(
                FilePath: filePath,
                Title: file.Tag.Title ?? Path.GetFileNameWithoutExtension(filePath),
                Artist: artist,
                AlbumArtist: albumArtist,
                Album: file.Tag.Album ?? "Album sconosciuto",
                DurationSeconds: file.Properties.Duration.TotalSeconds,
                HasCoverArt: file.Tag.Pictures.Length > 0
            );
        }
        catch
        {
            return new TrackInfo(
                FilePath: filePath,
                Title: Path.GetFileNameWithoutExtension(filePath),
                Artist: "Artista sconosciuto",
                AlbumArtist: "Artista sconosciuto",
                Album: "Album sconosciuto",
                DurationSeconds: 0,
                HasCoverArt: false
            );
        }
    }

    public (byte[] Data, string MimeType)? GetCoverArt(string filePath)
    {
        try
        {
            using var file = TagLib.File.Create(filePath);
            var picture = file.Tag.Pictures.FirstOrDefault();
            if (picture == null)
                return null;

            return (picture.Data.Data, picture.MimeType);
        }
        catch
        {
            return null;
        }
    }

    public async Task<List<TrackInfo>> ScanFolderAsync(string folderPath)
    {
        if (!Directory.Exists(folderPath))
            return [];

        var extensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".mp3", ".m4a" };

        var files = await Task.Run(() =>
            Directory.EnumerateFiles(folderPath, "*", SearchOption.AllDirectories)
                .Where(f => extensions.Contains(Path.GetExtension(f)))
                .Order()
                .ToArray()
        );

        return files.Select(GetTrackInfo).ToList();
    }
}
