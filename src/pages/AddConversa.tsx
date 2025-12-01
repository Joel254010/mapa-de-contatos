import { useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('conversas')
        .insert([formData]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Conversa adicionada com sucesso!' });
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

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (error) {
      console.error('Error adding conversa:', error);
      setMessage({ type: 'error', text: 'Erro ao adicionar conversa. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Adicionar Conversa</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Registre uma nova conversa do WhatsApp</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4 transition-colors">
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BE38C] dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="João Silva"
          />
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BE38C] dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria *
            </label>
            <select
              name="categoria"
              required
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BE38C] dark:bg-gray-700 dark:text-white transition-colors"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BE38C] dark:bg-gray-700 dark:text-white transition-colors"
            >
              {ESTADOS.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Origem *
            </label>
            <select
              name="origem"
              required
              value={formData.origem}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BE38C] dark:bg-gray-700 dark:text-white transition-colors"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BE38C] dark:bg-gray-700 dark:text-white transition-colors"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BE38C] dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            rows={4}
            value={formData.descricao}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5BE38C] dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="Detalhes da conversa..."
          />
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#5BE38C] hover:bg-[#4AC97B] text-[#0B3C5D] font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? 'Salvando...' : 'Salvar Conversa'}
        </button>
      </form>
    </div>
  );
}
