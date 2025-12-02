import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 pb-10">

      {/* =================== TÍTULO =================== */}
      <div className="px-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
          Personalize sua experiência
        </p>
      </div>

      {/* =================== TEMA =================== */}
      <div className="
        bg-white dark:bg-gray-800 
        rounded-lg shadow-sm 
        p-5 sm:p-6 
        transition-colors
      ">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Aparência
        </h3>

        <div className="
          flex flex-col sm:flex-row 
          sm:items-center 
          justify-between 
          gap-4
        ">
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">Tema</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-tight">
              Alternar entre modo claro e escuro
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="
              flex items-center gap-3 
              bg-gray-100 dark:bg-gray-700 
              px-4 py-3 sm:py-2 
              rounded-lg
              hover:bg-gray-200 dark:hover:bg-gray-600 
              transition-colors 
              justify-center
              min-w-[140px]
            "
          >
            {theme === 'light' ? (
              <>
                <Sun size={20} className="text-yellow-500" />
                <span className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                  Claro
                </span>
              </>
            ) : (
              <>
                <Moon size={20} className="text-blue-400" />
                <span className="text-white font-medium text-sm sm:text-base">
                  Escuro
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =================== SOBRE O SISTEMA =================== */}
      <div className="
        bg-white dark:bg-gray-800 
        rounded-lg shadow-sm 
        p-5 sm:p-6 
        transition-colors
      ">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sobre o Sistema
        </h3>

        <div className="space-y-4 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Versão</span>
            <span className="font-medium text-gray-900 dark:text-white">
              1.0.0
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Nome</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Mapa de Contatos
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Descrição</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Organizador de Conversas
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
