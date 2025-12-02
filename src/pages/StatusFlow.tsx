import { useEffect, useState, useRef } from "react";
import { Conversa, STATUS_OPTIONS, Status } from "../types/conversa";
import ConversaCard from "../components/ConversaCard";

/* ======================================================
      STATUS FLOW — DRAG IGUAL DESKTOP + MOBILE REAL
   ====================================================== */

export default function StatusFlow() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);

  // item arrastado
  const draggedItem = useRef<Conversa | null>(null);

  // timeout para ativar drag no mobile
  const dragTimeout = useRef<any>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const storage = localStorage.getItem("conversas");
    setConversas(storage ? JSON.parse(storage) : []);
    setLoading(false);
  }, []);

  const saveConversas = (lista: Conversa[]) => {
    localStorage.setItem("conversas", JSON.stringify(lista));
  };

  const getConversasByStatus = (status: Status) =>
    conversas.filter((c) => c.status === status);

  /* ================================
        DESKTOP DRAG NATIVO
  ================================ */
  const handleDragStart = (conversa: Conversa) => {
    draggedItem.current = conversa;
  };

  const handleDrop = (e: any, newStatus: Status) => {
    e.preventDefault();
    applyStatusChange(newStatus);
  };

  /* ================================
        MOBILE — SEGURA 300ms → DRAG
  ================================ */

  const handleTouchStart = (conversa: Conversa) => {
    dragging.current = false;

    dragTimeout.current = setTimeout(() => {
      draggedItem.current = conversa;
      dragging.current = true;
    }, 250); // tempo perfeito para simular drag
  };

  const handleTouchMove = (e: any) => {
    if (!dragging.current) return; // ainda clicando, não arrastando

    e.preventDefault(); // evita selecionar texto
  };

  const handleTouchEnd = (e: any, status: Status) => {
    clearTimeout(dragTimeout.current);

    if (!dragging.current) return; // foi só clique, não arraste
    dragging.current = false;

    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);

    if (!el) return;

    const column = el.closest("[data-status]");
    if (!column) return;

    const newStatus = column.getAttribute("data-status") as Status;
    applyStatusChange(newStatus);
  };

  /* ================================
        ALTERA STATUS
  ================================ */
  const applyStatusChange = (newStatus: Status) => {
    if (!draggedItem.current) return;

    const atualizado = conversas.map((c) =>
      c.id === draggedItem.current!.id
        ? { ...c, status: newStatus }
        : c
    );

    setConversas(atualizado);
    saveConversas(atualizado);

    draggedItem.current = null;
  };

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

  if (loading) return <div className="py-12 text-center text-gray-500">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Fluxo por Status
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Arraste e solte para alterar o status
      </p>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_OPTIONS.map((status) => {
          const statusConversas = getConversasByStatus(status);

          return (
            <div
              key={status}
              data-status={status}
              className="flex-shrink-0 w-[85vw] sm:w-80"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-t-4 ${getStatusColor(
                  status
                )}`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{status}</h3>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {statusConversas.length}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {statusConversas.length ? (
                    statusConversas.map((conversa) => (
                      <div
                        key={conversa.id}
                        draggable
                        onDragStart={() => handleDragStart(conversa)}
                        onTouchStart={() => handleTouchStart(conversa)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={(e) => handleTouchEnd(e, status)}
                        className="cursor-move active:scale-95 transition"
                      >
                        <ConversaCard conversa={conversa} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">
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
