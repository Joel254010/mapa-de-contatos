import { Phone, Calendar, MapPin, Tag } from 'lucide-react';
import { Conversa } from '../types/conversa';

interface ConversaCardProps {
  conversa: Conversa;
  onClick?: () => void;
}

export default function ConversaCard({ conversa, onClick }: ConversaCardProps) {

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Iniciada': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Em andamento': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Aguardando resposta': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Concluída': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Perdida': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const formatPhone = (phone: string) => phone.replace(/\D/g, '');
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div
      className="
        bg-white dark:bg-gray-800 
        rounded-xl p-4 shadow-sm hover:shadow-md 
        transition-all 
        border border-gray-200 dark:border-gray-700
        select-none
      "
      // 👉 Não usar onClick aqui para não bloquear o DRAG no mobile
      // Se precisar abrir detalhes, vamos colocar em outro botão depois.
    >

      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg leading-tight">
          {conversa.nome}
        </h3>

        <span
          className={`
            px-2 py-1 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap
            ${getStatusColor(conversa.status)}
          `}
        >
          {conversa.status}
        </span>
      </div>

      {/* INFOS */}
      <div className="space-y-2 text-sm md:text-[15px]">

        {/* Telefone */}
        <a
          href={`https://wa.me/${formatPhone(conversa.telefone)}`}
          target="_blank"
          rel="noopener noreferrer"
          // ⚠️ Remove o stopPropagation — atrapalha o drag no mobile
          className="flex items-center gap-2 text-[#25D366] hover:text-[#1DA851] transition-colors"
        >
          <Phone size={18} />
          <span className="truncate">{conversa.telefone}</span>
        </a>

        {/* Estado */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin size={18} />
          <span>{conversa.estado}</span>
        </div>

        {/* Categoria */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Tag size={18} />
          <span className="capitalize">{conversa.categoria}</span>
        </div>

        {/* Data */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar size={18} />
          <span>{formatDate(conversa.data)}</span>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      {conversa.descricao && (
        <p className="
          mt-3 text-sm md:text-[15px] text-gray-600 dark:text-gray-400 
          line-clamp-2 leading-snug
        ">
          {conversa.descricao}
        </p>
      )}
    </div>
  );
}
