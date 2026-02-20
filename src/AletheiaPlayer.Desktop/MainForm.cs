using Microsoft.Web.WebView2.WinForms;

namespace AletheiaPlayer.Desktop;

public partial class MainForm : Form
{
    private WebView2 webView = null!;
    private string? _urlToNavigate;

    public MainForm(string urlToNavigate)
    {
        _urlToNavigate = urlToNavigate;
        InitializeComponent();
        InitializeWebView();
    }

    private void InitializeWebView()
    {
        webView = new WebView2
        {
            Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right,
            Location = new System.Drawing.Point(0, 24),
            Size = new System.Drawing.Size(this.ClientSize.Width, this.ClientSize.Height - 24)
        };
        this.Controls.Add(webView);
        this.Load += MainForm_Load;
    }

    private async void MainForm_Load(object? sender, EventArgs e)
    {
        openFolderMenuItem.Enabled = false;

        if (_urlToNavigate != null)
        {
            await webView.EnsureCoreWebView2Async(null);
            webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            webView.CoreWebView2.Settings.AreDevToolsEnabled = false;
            webView.CoreWebView2.Navigate(_urlToNavigate);

            openFolderMenuItem.Enabled = true;
        }
    }

    private void OpenFolderMenuItem_Click(object? sender, EventArgs e)
    {
        if (webView.CoreWebView2 == null)
        {
            MessageBox.Show(
                "Please wait for the application to finish loading.",
                "Aletheia General Intelligence - Media Player Division",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
            return;
        }

        using var dialog = new FolderBrowserDialog
        {
            Description = "Select a folder containing MP3 files",
            UseDescriptionForTitle = true,
            ShowNewFolderButton = false
        };

        if (dialog.ShowDialog(this) == DialogResult.OK)
        {
            var selectedPath = dialog.SelectedPath;

            var message = System.Text.Json.JsonSerializer.Serialize(new
            {
                type = "LOAD_FOLDER",
                folder = selectedPath
            });

            webView.CoreWebView2.PostWebMessageAsString(message);
        }
    }
}
