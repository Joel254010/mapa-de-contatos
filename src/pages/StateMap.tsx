import { useEffect, useState } from 'react';
import { Conversa, ESTADOS, ESTADO_NAMES } from '../types/conversa';
import ConversaCard from '../components/ConversaCard';
import { X } from 'lucide-react';

// =======================================================
//    STATE MAP — 100% LOCALSTORAGE VERSION
// =======================================================

export default function StateMap() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversas();
  }, []);

  // 🔄 Carregar conversas do LocalStorage
  const loadConversas = () => {
    try {
      const storage = localStorage.getItem('conversas');
      if (!storage) {
        setConversas([]);
      } else {
        setConversas(JSON.parse(storage));
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConversasByState = (estado: string) =>
    conversas.filter(c => c.estado === estado);

  const getStateCount = (estado: string) =>
    conversas.filter(c => c.estado === estado).length;

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ======================== TÍTULO ======================== */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mapa por Estado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
          {selectedState
            ? `Conversas de ${ESTADO_NAMES[selectedState]}`
            : 'Toque em um estado para visualizar as conversas'}
        </p>
      </div>

      {/* ======================== MAPA DE ESTADOS ======================== */}
      {!selectedState ? (
        <div
          className="
            grid 
            grid-cols-3 
            sm:grid-cols-4 
            md:grid-cols-6 
            lg:grid-cols-8 
            xl:grid-cols-10 
            gap-3
          "
        >
          {ESTADOS.map(estado => {
            const count = getStateCount(estado);

            return (
              <button
                key={estado}
                onClick={() => setSelectedState(estado)}
                className="
                  bg-white dark:bg-gray-800 
                  rounded-lg 
                  p-3 sm:p-4 
                  shadow-sm 
                  hover:shadow-md 
                  transition-all 
                  border border-gray-200 dark:border-gray-700 
                  hover:border-[#5BE38C] dark:hover:border-[#5BE38C]
                "
              >
                <div className="text-center">
                  <div
                    className="
                      text-lg sm:text-xl 
                      font-bold 
                      text-[#0B3C5D] dark:text-[#5BE38C]
                    "
                  >
                    {estado}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                    {ESTADO_NAMES[estado]}
                  </div>

                  <div className="mt-2">
                    <span
                      className="
                        bg-[#5BE38C] 
                        text-[#0B3C5D] 
                        px-2 py-1 
                        rounded-full 
                        text-[11px] font-semibold
                      "
                    >
                      {count}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* ======================== LISTAGEM DO ESTADO ======================== */
        <div>

          {/* Botão voltar */}
          <button
            onClick={() => setSelectedState(null)}
            className="
              flex items-center gap-2 
              text-gray-600 dark:text-gray-400 
              hover:text-gray-900 dark:hover:text-white 
              mb-4 transition-colors text-sm
            "
          >
            <X size={20} />
            <span>Voltar ao mapa</span>
          </button>

          {/* Cards responsivos */}
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              gap-4
            "
          >
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
