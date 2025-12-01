import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Conversa, ESTADOS, ESTADO_NAMES } from '../types/conversa';
import ConversaCard from '../components/ConversaCard';
import { X } from 'lucide-react';

export default function StateMap() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
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

  const getConversasByState = (estado: string) => {
    return conversas.filter(c => c.estado === estado);
  };

  const getStateCount = (estado: string) => {
    return conversas.filter(c => c.estado === estado).length;
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mapa por Estado</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {selectedState
            ? `Conversas de ${ESTADO_NAMES[selectedState]}`
            : 'Clique em um estado para ver as conversas'}
        </p>
      </div>

      {!selectedState ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3">
          {ESTADOS.map(estado => {
            const count = getStateCount(estado);

            return (
              <button
                key={estado}
                onClick={() => setSelectedState(estado)}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 hover:border-[#5BE38C] dark:hover:border-[#5BE38C]"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0B3C5D] dark:text-[#5BE38C]">
                    {estado}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {ESTADO_NAMES[estado]}
                  </div>
                  <div className="mt-2">
                    <span className="bg-[#5BE38C] text-[#0B3C5D] px-2 py-1 rounded-full text-xs font-semibold">
                      {count}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedState(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <X size={20} />
            <span>Voltar ao mapa</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getConversasByState(selectedState).length > 0 ? (
              getConversasByState(selectedState).map(conversa => (
                <ConversaCard key={conversa.id} conversa={conversa} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma conversa registrada para {ESTADO_NAMES[selectedState]}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
