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
import { supabase } from './lib/supabase';
import ConversaCard from './components/ConversaCard';

type Page = 'dashboard' | 'add' | 'category' | 'state' | 'flow' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversas, setFilteredConversas] = useState<Conversa[]>([]);

  useEffect(() => {
    if (searchQuery) {
      searchConversas(searchQuery);
    } else {
      setFilteredConversas([]);
    }
  }, [searchQuery]);

  const searchConversas = async (query: string) => {
    if (!query.trim()) {
      setFilteredConversas([]);
      return;
    }

    try {
      const { data } = await supabase
        .from('conversas')
        .select('*')
        .or(`nome.ilike.%${query}%,telefone.ilike.%${query}%,categoria.ilike.%${query}%,estado.ilike.%${query}%`)
        .order('updated_at', { ascending: false });

      if (data) {
        setFilteredConversas(data);
      }
    } catch (error) {
      console.error('Error searching conversas:', error);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setSearchQuery('');
    setFilteredConversas([]);
  };

  const handleAddSuccess = () => {
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (searchQuery && filteredConversas.length > 0) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resultados da Busca</h2>
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
          <p className="text-gray-500 dark:text-gray-400">Nenhum resultado encontrado para "{searchQuery}"</p>
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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
