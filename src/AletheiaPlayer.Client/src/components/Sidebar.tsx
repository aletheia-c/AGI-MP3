import './Sidebar.css';

type ViewType = 'albums' | 'songs' | 'artists' | 'genres';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const libraryItems: { id: ViewType; label: string }[] = [
    { id: 'albums', label: 'Albums' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'genres', label: 'Genres' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-title">Library</div>
        {libraryItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="sidebar-item-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
