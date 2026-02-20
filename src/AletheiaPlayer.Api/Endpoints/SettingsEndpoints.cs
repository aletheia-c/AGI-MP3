using AletheiaPlayer.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace AletheiaPlayer.Api.Endpoints;

public static class SettingsEndpoints
{
    public static void MapSettingsEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/settings", (AppSettingsService appSettings) =>
        {
            var lastFolder = appSettings.GetLastFolder();
            return Results.Ok(new { lastFolder });
        });
    }
}
