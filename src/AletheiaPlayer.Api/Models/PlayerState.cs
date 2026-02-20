namespace AletheiaPlayer.Api.Models;

public record PlayerState(
    string Status,
    string? CurrentFilePath,
    string? Title,
    string? Artist,
    string? Album,
    double PositionSeconds,
    double DurationSeconds,
    double Volume
);
