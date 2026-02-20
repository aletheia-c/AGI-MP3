namespace AletheiaPlayer.Desktop;

partial class MainForm
{
    private System.ComponentModel.IContainer components = null;
    private System.Windows.Forms.MenuStrip menuStrip = null!;
    private System.Windows.Forms.ToolStripMenuItem fileMenuItem = null!;
    internal System.Windows.Forms.ToolStripMenuItem openFolderMenuItem = null!;
    private System.Windows.Forms.ToolStripMenuItem viewMenuItem = null!;
    private System.Windows.Forms.ToolStripMenuItem settingsMenuItem = null!;

    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }
        if (disposing && (menuStrip != null))
        {
            menuStrip.Dispose();
        }
        base.Dispose(disposing);
    }

    private void InitializeComponent()
    {
        this.components = new System.ComponentModel.Container();

        this.menuStrip = new System.Windows.Forms.MenuStrip();
        this.fileMenuItem = new System.Windows.Forms.ToolStripMenuItem();
        this.openFolderMenuItem = new System.Windows.Forms.ToolStripMenuItem();
        this.viewMenuItem = new System.Windows.Forms.ToolStripMenuItem();
        this.settingsMenuItem = new System.Windows.Forms.ToolStripMenuItem();

        this.SuspendLayout();

        this.menuStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileMenuItem,
            this.viewMenuItem,
            this.settingsMenuItem
        });
        this.menuStrip.Location = new System.Drawing.Point(0, 0);
        this.menuStrip.Name = "menuStrip";
        this.menuStrip.Size = new System.Drawing.Size(1200, 24);
        this.menuStrip.TabIndex = 0;
        this.menuStrip.Text = "menuStrip";

        this.fileMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.openFolderMenuItem
        });
        this.fileMenuItem.Name = "fileMenuItem";
        this.fileMenuItem.Size = new System.Drawing.Size(37, 20);
        this.fileMenuItem.Text = "&File";

        this.openFolderMenuItem.Name = "openFolderMenuItem";
        this.openFolderMenuItem.Size = new System.Drawing.Size(145, 22);
        this.openFolderMenuItem.Text = "&Open Folder...";
        this.openFolderMenuItem.ShortcutKeys = System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.O;
        this.openFolderMenuItem.Click += new System.EventHandler(this.OpenFolderMenuItem_Click);

        this.viewMenuItem.Name = "viewMenuItem";
        this.viewMenuItem.Size = new System.Drawing.Size(44, 20);
        this.viewMenuItem.Text = "&View";

        this.settingsMenuItem.Name = "settingsMenuItem";
        this.settingsMenuItem.Size = new System.Drawing.Size(61, 20);
        this.settingsMenuItem.Text = "&Settings";

        this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
        this.ClientSize = new System.Drawing.Size(1200, 800);
        this.Controls.Add(this.menuStrip);
        this.MainMenuStrip = this.menuStrip;
        this.Text = "Aletheia General Intelligence - Media Player Division";
        this.StartPosition = FormStartPosition.CenterScreen;

        this.ResumeLayout(false);
        this.PerformLayout();
    }
}
