namespace AletheiaPlayer.Api.Models;

public record PlayRequest(string? FilePath);
public record SeekRequest(double PositionSeconds);
public record VolumeRequest(double Volume);
