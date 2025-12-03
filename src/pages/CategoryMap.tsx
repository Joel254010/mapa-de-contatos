import { useEffect, useState } from 'react';
import { Conversa, CATEGORIAS } from '../types/conversa';
import ConversaCard from '../components/ConversaCard';

export default function CategoryMap() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversas();
  }, []);

  // 🔄 Carregar conversas do localStorage
  const loadConversas = () => {
    try {
      const storage = localStorage.getItem('conversas');
      if (storage) {
        const parsed = JSON.parse(storage);

        // Ordena para manter consistência visual
        const ordenado = parsed.sort((a: Conversa, b: Conversa) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

        setConversas(ordenado);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
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
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mapa por Categoria
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Conversas organizadas por tipo
        </p>
      </div>

      {/* ⚡️ CARROSSEL DE CATEGORIAS — SCROLL LATERAL CORRIGIDO */}
      <div
        className="
          flex gap-4 
          overflow-x-auto overflow-y-hidden
          pb-4 px-1
          scroll-smooth
          snap-x snap-mandatory
          whitespace-nowrap
          touch-pan-x
          pr-6
          scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600
        "
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pinch-zoom' // 🔥 FIX MOBILE
        }}
      >
        {CATEGORIAS.map(categoria => {
          const categoryConversas = getConversasByCategory(categoria);

          return (
            <div
              key={categoria}
              className="
                flex-shrink-0 
                w-80 
                snap-center 
                md:snap-start
              "
            >
              <div
                className={`
                  bg-white dark:bg-gray-800 
                  rounded-lg shadow-sm 
                  border-t-4 ${getCategoryColor(categoria)}
                  transition-all
                `}
              >

                {/* CABEÇALHO */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {categoria}
                  </h3>

                  <span
                    className="
                      bg-gray-100 dark:bg-gray-700 
                      text-gray-700 dark:text-gray-300 
                      px-2 py-1 rounded-full 
                      text-xs font-medium
                    "
                  >
                    {categoryConversas.length}
                  </span>
                </div>

                {/* LISTAGEM — SCROLL PARA BAIXO FUNCIONANDO */}
                <div
                  className="
                    p-4 space-y-3 
                    max-h-[65vh] md:max-h-[calc(100vh-300px)]
                    overflow-y-auto 
                  "
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y'  // 🔥 LIBERA SCROLL VERTICAL
                  }}
                >
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
