using AletheiaPlayer.Api.Endpoints;
using AletheiaPlayer.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace AletheiaPlayer.Api;

public static class ApiSetup
{
    public static IServiceCollection AddAletheiaServices(this IServiceCollection services)
    {
        services.AddSingleton<AudioPlayerService>();
        services.AddTransient<MetadataService>();
        services.AddSingleton<AppSettingsService>();
        return services;
    }

    public static WebApplication MapAletheiaEndpoints(this WebApplication app)
    {
        app.MapPlayerEndpoints();
        app.MapLibraryEndpoints();
        app.MapMetadataEndpoints();
        app.MapSettingsEndpoints();
        return app;
    }
}
