import { LayoutDashboard, Plus, FolderKanban, Map, GitBranch, Settings } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Plus, label: 'Adicionar Conversa', id: 'add' },
  { icon: FolderKanban, label: 'Mapa por Categoria', id: 'category' },
  { icon: Map, label: 'Mapa por Estado', id: 'state' },
  { icon: GitBranch, label: 'Fluxo por Status', id: 'flow' },
  { icon: Settings, label: 'Configurações', id: 'settings' },
];

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export default function Sidebar({ currentPage = 'dashboard', onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0B3C5D] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold"> Mapa de Contatos</h1>
        <p className="text-xs text-white/70 mt-1">Organizador de Conversas</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#5BE38C] text-[#0B3C5D] font-medium'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/50 text-center">
          v1.0.0
        </div>
      </div>
    </aside>
  );
}
