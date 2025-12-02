import { useState } from 'react';
import { Save } from 'lucide-react';
import { CATEGORIAS, STATUS_OPTIONS, ORIGENS, ESTADOS } from '../types/conversa';

interface AddConversaProps {
  onSuccess?: () => void;
}

export default function AddConversa({ onSuccess }: AddConversaProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    categoria: 'Compra',
    estado: 'SP',
    origem: 'WhatsApp',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    status: 'Iniciada',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // BUSCAR LISTA ATUAL
      const storage = localStorage.getItem('conversas');
      const conversas = storage ? JSON.parse(storage) : [];

      // CRIAR NOVO OBJETO COM ID ÚNICO
      const novaConversa = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // SALVAR NO LOCALSTORAGE
      const atualizado = [novaConversa, ...conversas];
      localStorage.setItem('conversas', JSON.stringify(atualizado));

      // MENSAGEM DE SUCESSO
      setMessage({ type: 'success', text: 'Conversa adicionada com sucesso!' });

      // LIMPAR FORM
      setFormData({
        nome: '',
        telefone: '',
        categoria: 'Compra',
        estado: 'SP',
        origem: 'WhatsApp',
        descricao: '',
        data: new Date().toISOString().split('T')[0],
        status: 'Iniciada',
      });

      // RETORNAR PARA DASHBOARD
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: 'Erro ao salvar conversa. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-10 mt-4">

      {/* TÍTULO */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Adicionar Conversa
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
          Registre uma nova conversa do WhatsApp
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 md:p-6 space-y-4 transition-colors"
      >

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Cliente *
          </label>
          <input
            type="text"
            name="nome"
            required
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#5BE38C]"
            placeholder="João Silva"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            name="telefone"
            required
            value={formData.telefone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#5BE38C]"
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Categoria / Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria *
            </label>
            <select
              name="categoria"
              required
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-4 py-3 border dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#5BE38C]"
            >
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estado *
            </label>
            <select
              name="estado"
              required
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-4 py-3 border dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#5BE38C]"
            >
              {ESTADOS.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Origem / Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Origem *
            </label>
            <select
              name="origem"
              required
              value={formData.origem}
              onChange={handleChange}
              className="w-full px-4 py-3 border dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#5BE38C]"
            >
              {ORIGENS.map(origem => (
                <option key={origem} value={origem}>{origem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#5BE38C]"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data da Conversa *
          </label>
          <input
            type="date"
            name="data"
            required
            value={formData.data}
            onChange={handleChange}
            className="w-full px-4 py-3 border dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#5BE38C]"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            rows={4}
            value={formData.descricao}
            onChange={handleChange}
            className="w-full px-4 py-3 border dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#5BE38C]"
            placeholder="Detalhes da conversa..."
          />
        </div>

        {/* Mensagem */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#5BE38C] hover:bg-[#4AC97B] 
                     text-[#0B3C5D] font-medium px-6 py-3 rounded-lg transition-colors 
                     text-base md:text-lg disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? 'Salvando...' : 'Salvar Conversa'}
        </button>
      </form>
    </div>
  );
}

