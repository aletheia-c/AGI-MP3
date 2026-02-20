using AletheiaPlayer.Api;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Web.WebView2.Core;

namespace AletheiaPlayer.Desktop;

static class Program
{
    private static WebApplication? _app;

    [STAThread]
    static void Main()
    {
        if (!IsWebView2RuntimeInstalled())
        {
            MessageBox.Show(
                "WebView2 Runtime is not installed.\n\n" +
                "Please download and install it from:\n" +
                "https://go.microsoft.com/fwlink/p/?LinkId=2124703",
                "Aletheia General Intelligence - Media Player Division - Missing Dependency",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
            return;
        }

        var builder = WebApplication.CreateBuilder();

        builder.WebHost.UseUrls("http://127.0.0.1:0");

        builder.Environment.ContentRootPath = AppContext.BaseDirectory;

        builder.Services.AddAletheiaServices();

        _app = builder.Build();

        _app.MapAletheiaEndpoints();

        _app.UseDefaultFiles();
        _app.UseStaticFiles();

        string? serverUrl = null;
        var serverReady = new ManualResetEvent(false);

        Task.Run(async () =>
        {
            await _app.StartAsync();

            var server = _app.Services.GetRequiredService<IServer>();
            var addresses = server.Features.Get<IServerAddressesFeature>();
            serverUrl = addresses?.Addresses.FirstOrDefault() ?? "http://127.0.0.1:5100";

            Console.WriteLine($"=== Aletheia General Intelligence - Media Player Division ===");
            Console.WriteLine($"Backend started: {serverUrl}");

            serverReady.Set();
        });

        serverReady.WaitOne();

        ApplicationConfiguration.Initialize();

        var mainForm = new MainForm(serverUrl!);

        Application.Run(mainForm);

        _app.StopAsync().Wait();
        _app.DisposeAsync().AsTask().Wait();
    }

    private static bool IsWebView2RuntimeInstalled()
    {
        try
        {
            var version = CoreWebView2Environment.GetAvailableBrowserVersionString();
            return !string.IsNullOrEmpty(version);
        }
        catch
        {
            return false;
        }
    }
}
