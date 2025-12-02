import { useEffect, useState } from 'react';
import { Conversa, STATUS_OPTIONS, Status } from '../types/conversa';
import ConversaCard from '../components/ConversaCard';

/* ======================================================
    STATUS FLOW — SUPORTE DESKTOP + MOBILE
   ====================================================== */

export default function StatusFlow() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<Conversa | null>(null);

  useEffect(() => {
    loadConversas();
  }, []);

  // 🔄 Carregar conversas do localStorage
  const loadConversas = () => {
    try {
      const storage = localStorage.getItem("conversas");
      setConversas(storage ? JSON.parse(storage) : []);
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveConversas = (lista: Conversa[]) => {
    localStorage.setItem("conversas", JSON.stringify(lista));
  };

  const getConversasByStatus = (status: Status) =>
    conversas.filter(c => c.status === status);

  /* ==========================================================
     DESKTOP → inicia drag nativo
  ========================================================== */
  const handleDragStart = (conversa: Conversa) => {
    setDraggedItem(conversa);
  };

  /* ==========================================================
     MOBILE → inicia drag quando desliza o dedo
  ========================================================== */
  const handleDragStartMobile = (conversa: Conversa) => {
    setDraggedItem(conversa);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessário para permitir drop
  };

  const handleDrop = (e: React.DragEvent, newStatus: Status) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.status === newStatus) {
      setDraggedItem(null);
      return;
    }

    const atualizada = conversas.map(c =>
      c.id === draggedItem.id
        ? { ...c, status: newStatus, updated_at: new Date().toISOString() }
        : c
    );

    setConversas(atualizada);
    saveConversas(atualizada);

    setDraggedItem(null);
  };

  const getStatusColor = (status: Status) => {
    const colors: Record<Status, string> = {
      'Iniciada': 'border-blue-500',
      'Em andamento': 'border-yellow-500',
      'Aguardando resposta': 'border-orange-500',
      'Concluída': 'border-green-500',
      'Perdida': 'border-red-500',
    };
    return colors[status];
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

      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Fluxo por Status
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Arraste e solte para alterar o status das conversas
        </p>
      </div>

      {/* COLUNAS — Drag & Drop */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">

        {STATUS_OPTIONS.map(status => {
          const statusConversas = getConversasByStatus(status);

          return (
            <div
              key={status}
              className="flex-shrink-0 w-[85vw] sm:w-80 snap-start"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div
                className={`
                  bg-white dark:bg-gray-800
                  rounded-lg shadow-sm
                  border-t-4 ${getStatusColor(status)}
                  transition-colors
                `}
              >

                {/* Cabeçalho */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {status}
                    </h3>

                    <span className="
                      bg-gray-100 dark:bg-gray-700 
                      text-gray-700 dark:text-gray-300 
                      px-2 py-1 rounded-full text-xs font-medium
                    ">
                      {statusConversas.length}
                    </span>
                  </div>
                </div>

                {/* Conteúdo scroll */}
                <div className="
                  p-4 space-y-3
                  min-h-[200px]
                  max-h-[calc(100vh-280px)]
                  overflow-y-auto
                ">
                  {statusConversas.length > 0 ? (
                    statusConversas.map(conversa => (
                      <div
                        key={conversa.id}
                        draggable
                        onDragStart={() => handleDragStart(conversa)}
                        className="cursor-move active:scale-[0.98] transition-transform"
                      >
                        <ConversaCard
                          conversa={conversa}
                          onDragStartMobile={handleDragStartMobile}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      Nenhuma conversa neste status
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
