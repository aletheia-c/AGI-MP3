using AletheiaPlayer.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace AletheiaPlayer.Api.Endpoints;

public static class MetadataEndpoints
{
    public static void MapMetadataEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/metadata");

        group.MapGet("/cover", (string filePath, MetadataService metadata) =>
        {
            var cover = metadata.GetCoverArt(filePath);
            if (cover == null)
                return Results.NotFound();

            return Results.Bytes(cover.Value.Data, cover.Value.MimeType);
        });
    }
}
