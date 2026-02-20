namespace AletheiaPlayer.Api.Models;

public record TrackInfo(
    string FilePath,
    string Title,
    string Artist,
    string AlbumArtist,
    string Album,
    double DurationSeconds,
    bool HasCoverArt
);
