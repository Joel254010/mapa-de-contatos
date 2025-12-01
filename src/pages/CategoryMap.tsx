import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Conversa, CATEGORIAS } from '../types/conversa';
import ConversaCard from '../components/ConversaCard';

export default function CategoryMap() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversas();
  }, []);

  const loadConversas = async () => {
    try {
      const { data } = await supabase
        .from('conversas')
        .select('*')
        .order('updated_at', { ascending: false });

      if (data) {
        setConversas(data);
      }
    } catch (error) {
      console.error('Error loading conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConversasByCategory = (categoria: string) => {
    return conversas.filter(c => c.categoria === categoria);
  };

  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Compra': 'border-blue-500',
      'Venda': 'border-green-500',
      'Financiamento': 'border-purple-500',
      'Consórcio': 'border-orange-500',
      'Avaliação': 'border-yellow-500',
      'Pergunta rápida': 'border-pink-500',
      'Suporte': 'border-red-500',
      'Outro': 'border-gray-500',
    };
    return colors[categoria] || 'border-gray-500';
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mapa por Categoria</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Conversas organizadas por tipo</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {CATEGORIAS.map(categoria => {
          const categoryConversas = getConversasByCategory(categoria);

          return (
            <div
              key={categoria}
              className="flex-shrink-0 w-80"
            >
              <div className={`bg-white dark:bg-gray-800 rounded-lg border-t-4 ${getCategoryColor(categoria)} shadow-sm transition-colors`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{categoria}</h3>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                      {categoryConversas.length}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {categoryConversas.length > 0 ? (
                    categoryConversas.map(conversa => (
                      <ConversaCard key={conversa.id} conversa={conversa} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      Nenhuma conversa nesta categoria
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
