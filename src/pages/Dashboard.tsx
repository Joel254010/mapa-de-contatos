import { useEffect, useState } from 'react';
import { TrendingUp, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Conversa, CATEGORIAS } from '../types/conversa';

interface Stats {
  total: number;
  today: number;
  inProgress: number;
  completed: number;
}

interface CategoryCount {
  categoria: string;
  count: number;
}

interface StateCount {
  estado: string;
  count: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0, inProgress: 0, completed: 0 });
  const [categoryData, setCategoryData] = useState<CategoryCount[]>([]);
  const [stateData, setStateData] = useState<StateCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: conversas } = await supabase
        .from('conversas')
        .select('*');

      if (conversas) {
        const today = new Date().toISOString().split('T')[0];

        setStats({
          total: conversas.length,
          today: conversas.filter(c => c.data === today).length,
          inProgress: conversas.filter(c => c.status === 'Em andamento').length,
          completed: conversas.filter(c => c.status === 'Concluída').length,
        });

        const categoryCounts: Record<string, number> = {};
        conversas.forEach(c => {
          categoryCounts[c.categoria] = (categoryCounts[c.categoria] || 0) + 1;
        });
        setCategoryData(
          Object.entries(categoryCounts).map(([categoria, count]) => ({ categoria, count }))
        );

        const stateCounts: Record<string, number> = {};
        conversas.forEach(c => {
          stateCounts[c.estado] = (stateCounts[c.estado] || 0) + 1;
        });
        setStateData(
          Object.entries(stateCounts)
            .map(([estado, count]) => ({ estado, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
        );
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Compra': 'bg-blue-500',
      'Venda': 'bg-green-500',
      'Financiamento': 'bg-purple-500',
      'Consórcio': 'bg-orange-500',
      'Avaliação': 'bg-yellow-500',
      'Pergunta rápida': 'bg-pink-500',
      'Suporte': 'bg-red-500',
      'Outro': 'bg-gray-500',
    };
    return colors[categoria] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Visão geral das suas conversas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={MessageSquare}
          label="Total de Conversas"
          value={stats.total}
          color="bg-[#0B3C5D]"
        />
        <StatCard
          icon={TrendingUp}
          label="Conversas Hoje"
          value={stats.today}
          color="bg-[#5BE38C]"
        />
        <StatCard
          icon={Clock}
          label="Em Andamento"
          value={stats.inProgress}
          color="bg-blue-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Concluídas"
          value={stats.completed}
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Conversas por Categoria
          </h3>
          <div className="space-y-3">
            {categoryData.length > 0 ? (
              categoryData.map(({ categoria, count }) => (
                <div key={categoria} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(categoria)}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{categoria}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma conversa registrada</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top 5 Estados
          </h3>
          <div className="space-y-3">
            {stateData.length > 0 ? (
              stateData.map(({ estado, count }) => (
                <div key={estado} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{estado}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#5BE38C] h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma conversa registrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}
