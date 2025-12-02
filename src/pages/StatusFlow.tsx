import { useEffect, useState, useRef } from "react";
import { Conversa, STATUS_OPTIONS, Status } from "../types/conversa";
import ConversaCard from "../components/ConversaCard";

/* ======================================================
    STATUS FLOW — SUPORTE 100% DESKTOP + MOBILE
   ====================================================== */

export default function StatusFlow() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);

  // item sendo arrastado
  const [draggedItem, setDraggedItem] = useState<Conversa | null>(null);

  // controles de touch mobile
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const touchOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    loadConversas();
  }, []);

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
    conversas.filter((c) => c.status === status);

  /* ============================================================
     DESKTOP — USO DO DRAG NATIVO
  ============================================================ */
  const handleDragStart = (conversa: Conversa) => {
    setDraggedItem(conversa);
  };

  const handleDrop = (e: React.DragEvent, newStatus: Status) => {
    e.preventDefault();
    if (!draggedItem) return;

    applyStatusChange(newStatus);
  };

  /* ============================================================
     MOBILE — TOUCH DRAG IMPLEMENTADO DO ZERO
  ============================================================ */

  const handleTouchStart = (e: any, conversa: Conversa) => {
    setDraggedItem(conversa);

    const touch = e.touches[0];
    const card = e.target.closest(".drag-card");
    const rect = card.getBoundingClientRect();

    // posição relativa do dedo no card
    touchOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    // cria ghost
    const ghost = document.createElement("div");
    ghost.className =
      "fixed z-[9999] opacity-90 pointer-events-none w-[85vw] max-w-[320px]";
    ghost.style.left = rect.left + "px";
    ghost.style.top = rect.top + "px";
    ghost.innerHTML = card.innerHTML;
    document.body.appendChild(ghost);

    ghostRef.current = ghost;
  };

  const handleTouchMove = (e: any) => {
    if (!ghostRef.current) return;

    const touch = e.touches[0];
    ghostRef.current.style.left =
      touch.clientX - touchOffset.current.x + "px";
    ghostRef.current.style.top =
      touch.clientY - touchOffset.current.y + "px";

    e.preventDefault(); // impede o scroll durante o drag
  };

  const handleTouchEnd = (e: any) => {
    if (!ghostRef.current) return;

    const ghost = ghostRef.current;
    ghost.remove();
    ghostRef.current = null;

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    if (!dropTarget) {
      setDraggedItem(null);
      return;
    }

    // encontra coluna alvo
    const column = dropTarget.closest("[data-status]");
    if (column && draggedItem) {
      const newStatus = column.getAttribute("data-status") as Status;
      applyStatusChange(newStatus);
    }

    setDraggedItem(null);
  };

  /* ============================================================
     APLICA ALTERAÇÃO DE STATUS
  ============================================================ */

  const applyStatusChange = (newStatus: Status) => {
    if (!draggedItem) return;

    const atualizada = conversas.map((c) =>
      c.id === draggedItem.id
        ? { ...c, status: newStatus, updated_at: new Date().toISOString() }
        : c
    );

    setConversas(atualizada);
    saveConversas(atualizada);
  };

  /* ============================================================ */

  const getStatusColor = (status: Status) => {
    const colors: Record<Status, string> = {
      Iniciada: "border-blue-500",
      "Em andamento": "border-yellow-500",
      "Aguardando resposta": "border-orange-500",
      Concluída: "border-green-500",
      Perdida: "border-red-500",
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
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
          Arraste e solte para alterar o status
        </p>
      </div>

      {/* COLUNAS */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {STATUS_OPTIONS.map((status) => {
          const statusConversas = getConversasByStatus(status);

          return (
            <div
              key={status}
              data-status={status} // necessário p/ mobile detectar destino
              className="flex-shrink-0 w-[85vw] sm:w-80 snap-start"
              onDragOver={(e) => e.preventDefault()}
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

                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                      {statusConversas.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="p-4 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {statusConversas.length > 0 ? (
                    statusConversas.map((conversa) => (
                      <div
                        key={conversa.id}
                        draggable
                        onDragStart={() => handleDragStart(conversa)}
                        onTouchStart={(e) =>
                          handleTouchStart(e, conversa)
                        }
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="drag-card cursor-move active:scale-95 transition-transform"
                      >
                        <ConversaCard conversa={conversa} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-8 text-center">
                      Nenhuma conversa
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
