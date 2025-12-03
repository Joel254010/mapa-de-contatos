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

type Page = 'dashboard' | 'add' | 'category' | 'state' | 'flow' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversas, setFilteredConversas] = useState<Conversa[]>([]);
  const [allConversas, setAllConversas] = useState<Conversa[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ============================================================
     🔄 CARREGAR CONVERSAS
  ============================================================ */
  useEffect(() => {
    const storage = localStorage.getItem('conversas');
    if (storage) setAllConversas(JSON.parse(storage));
  }, []);

  /* ============================================================
     🔎 SISTEMA DE BUSCA
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

    const results = allConversas.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.telefone.toLowerCase().includes(q) ||
        c.categoria.toLowerCase().includes(q) ||
        c.estado.toLowerCase().includes(q)
    );

    setFilteredConversas(results);
  };

  /* ============================================================
     🔁 NAVEGAÇÃO
  ============================================================ */
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setSearchQuery('');
    setFilteredConversas([]);
    setIsSidebarOpen(false);
  };

  /* ============================================================
     ➕ APÓS ADICIONAR CONVERSA
  ============================================================ */
  const handleAddSuccess = () => {
    const storage = localStorage.getItem('conversas');
    if (storage) setAllConversas(JSON.parse(storage));
    setCurrentPage('dashboard');
  };

  /* ============================================================
     🧾 RENDER DA PÁGINA
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
            {filteredConversas.map((conversa) => (
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
      case 'dashboard':
        return <Dashboard />;
      case 'add':
        return <AddConversa onSuccess={handleAddSuccess} />;
      case 'category':
        return <CategoryMap />;
      case 'state':
        return <StateMap />;
      case 'flow':
        return <StatusFlow />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  /* ============================================================
     🧱 LAYOUT PRINCIPAL
  ============================================================ */
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">

        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* 🎯 FIX REAL PARA MOBILE:
            - mantemos scroll vertical liberado
            - NÃO bloqueamos scroll horizontal dos carrosséis */}
        <main
          className="flex-1 p-6 overflow-y-auto mobile-scroll"
          style={{
            overflowX: "hidden",  // impede conflito com carrosséis
            touchAction: "pan-y", // libera gesto vertical sem bloquear horizontal dentro dos carrosséis
          }}
        >
          {renderPage()}
        </main>

      </div>
    </div>
  );
}

/* ============================================================
   ROOT
============================================================ */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
