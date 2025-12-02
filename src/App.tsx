import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';

import Dashboard from './pages/Dashboard';
import AddConversa from './pages/AddConversa';
import CategoryMap from './pages/CategoryMap';
import StateMap from './pages/StateMap';
import StatusFlow from './pages/StatusFlow';
import Settings from './pages/Settings';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import { Conversa } from './types/conversa';
import ConversaCard from './components/ConversaCard';

// ⚠️ Modo local — sem Supabase ainda

type Page = 'dashboard' | 'add' | 'category' | 'state' | 'flow' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversas, setFilteredConversas] = useState<Conversa[]>([]);
  const [allConversas, setAllConversas] = useState<Conversa[]>([]);

  // 📱 Sidebar Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ============================================================
     🔄 Carregar conversas do localStorage ao iniciar
     ============================================================ */
  useEffect(() => {
    const storage = localStorage.getItem("conversas");
    if (storage) setAllConversas(JSON.parse(storage));
  }, []);

  /* ============================================================
     🔎 Sistema de busca local
     ============================================================ */
  useEffect(() => {
    if (searchQuery.trim()) {
      searchConversas(searchQuery);
    } else {
      setFilteredConversas([]);
    }
  }, [searchQuery, allConversas]);

  const searchConversas = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) {
      setFilteredConversas([]);
      return;
    }

    const results = allConversas.filter(conversa =>
      conversa.nome.toLowerCase().includes(q) ||
      conversa.telefone.toLowerCase().includes(q) ||
      conversa.categoria.toLowerCase().includes(q) ||
      conversa.estado.toLowerCase().includes(q)
    );

    setFilteredConversas(results);
  };

  /* ============================================================
     🔄 Navegação entre páginas
     ============================================================ */
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setSearchQuery('');
    setFilteredConversas([]);
    setIsSidebarOpen(false); // fecha sidebar no mobile
  };

  /* ============================================================
     🔄 Após adicionar conversa com sucesso
     ============================================================ */
  const handleAddSuccess = () => {
    const storage = localStorage.getItem("conversas");
    if (storage) setAllConversas(JSON.parse(storage));
    setCurrentPage('dashboard');
  };

  /* ============================================================
     🎨 Render da página atual
     ============================================================ */
  const renderPage = () => {
    if (searchQuery && filteredConversas.length > 0) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resultados da Busca
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredConversas.length} resultado(s) encontrado(s)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConversas.map(conversa => (
              <ConversaCard key={conversa.id} conversa={conversa} />
            ))}
          </div>
        </div>
      );
    }

    if (searchQuery && filteredConversas.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum resultado encontrado para "{searchQuery}"
          </p>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'add': return <AddConversa onSuccess={handleAddSuccess} />;
      case 'category': return <CategoryMap />;
      case 'state': return <StateMap />;
      case 'flow': return <StatusFlow />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  /* ============================================================
     🧱 Layout Principal
     ============================================================ */
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      {/* 📱 Sidebar Mobile + Desktop */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 📄 Conteúdo */}
      <div className="flex-1 flex flex-col">

        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Scroll liberado corretamente no mobile */}
        <main className="flex-1 overflow-y-auto p-6 mobile-scroll">
          {renderPage()}
        </main>

      </div>
    </div>
  );
}

/* ============================================================
   🌎 App Root
============================================================ */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
