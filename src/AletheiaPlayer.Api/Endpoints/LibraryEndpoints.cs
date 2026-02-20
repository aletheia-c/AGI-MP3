using AletheiaPlayer.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace AletheiaPlayer.Api.Endpoints;

public static class LibraryEndpoints
{
    public static void MapLibraryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/library");

        group.MapGet("/files", async (string folder, MetadataService metadata, AppSettingsService appSettings) =>
        {
            if (!Directory.Exists(folder))
                return Results.BadRequest(new { error = "Folder not found" });

            try
            {
                var cached = appSettings.TryGetValidCache(folder);
                if (cached != null)
                    return Results.Ok(cached);

                var tracks = await metadata.ScanFolderAsync(folder);
                appSettings.SaveCache(folder, tracks);
                appSettings.SaveLastFolder(folder);
                return Results.Ok(tracks);
            }
            catch (UnauthorizedAccessException)
            {
                return Results.Json(new { error = "Access denied to folder" }, statusCode: 403);
            }
            catch (Exception ex)
            {
                return Results.Json(new { error = $"Failed to scan folder: {ex.Message}" }, statusCode: 500);
            }
        });
    }
}
