import { LayoutDashboard, Plus, FolderKanban, Map, GitBranch, Settings, X } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Plus, label: 'Adicionar Conversa', id: 'add' },
  { icon: FolderKanban, label: 'Mapa por Categoria', id: 'category' },
  { icon: Map, label: 'Mapa por Estado', id: 'state' },
  { icon: GitBranch, label: 'Fluxo por Status', id: 'flow' },
  { icon: Settings, label: 'Configurações', id: 'settings' },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;

  // 🔥 Novos props integrados ao App.tsx
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose(); // fecha no mobile
  };

  return (
    <>
      {/* 🟢 OVERLAY — aparece apenas quando sidebar está aberta no mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* 🟢 SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full z-50
          bg-[#0B3C5D] text-white flex flex-col w-64
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Mapa de Contatos</h1>
            <p className="text-xs text-white/70 mt-1">Organizador de Conversas</p>
          </div>

          {/* BOTÃO FECHAR — só no mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
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

        {/* RODAPÉ */}
        <div className="p-4 border-t border-white/10 text-center text-xs text-white/50">
          v1.0.0
        </div>
      </aside>
    </>
  );
}
