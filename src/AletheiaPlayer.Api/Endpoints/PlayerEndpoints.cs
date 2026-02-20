using AletheiaPlayer.Api.Models;
using AletheiaPlayer.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace AletheiaPlayer.Api.Endpoints;

public static class PlayerEndpoints
{
    public static void MapPlayerEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/player");

        group.MapGet("/state", (AudioPlayerService player) =>
        {
            return Results.Ok(player.GetState());
        });

        group.MapPost("/play", ([FromBody] PlayRequest? request, AudioPlayerService player) =>
        {
            player.Play(request?.FilePath);
            return Results.Ok();
        });

        group.MapPost("/pause", (AudioPlayerService player) =>
        {
            player.Pause();
            return Results.Ok();
        });

        group.MapPost("/stop", (AudioPlayerService player) =>
        {
            player.Stop();
            return Results.Ok();
        });

        group.MapPost("/seek", ([FromBody] SeekRequest request, AudioPlayerService player) =>
        {
            player.Seek(request.PositionSeconds);
            return Results.Ok();
        });

        group.MapPost("/volume", ([FromBody] VolumeRequest request, AudioPlayerService player) =>
        {
            player.SetVolume(request.Volume);
            return Results.Ok();
        });
    }
}
