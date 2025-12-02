import { Search, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onToggleSidebar?: () => void;
}

export default function Header({
  searchQuery = "",
  onSearchChange,
  onToggleSidebar,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="
      bg-white dark:bg-gray-800 
      border-b border-gray-200 dark:border-gray-700 
      px-4 md:px-6 py-3 md:py-4 
      transition-colors sticky top-0 z-30
    "
    >
      <div className="flex items-center gap-3 md:gap-6">

        {/* BOTÃO MENU — SOMENTE MOBILE */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-700 dark:text-gray-300" />
        </button>

        {/* CAMPO DE BUSCA */}
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nome, telefone, estado ou categoria..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2 
                border border-gray-300 dark:border-gray-600 
                rounded-lg text-sm md:text-base
                focus:outline-none focus:ring-2 focus:ring-[#5BE38C] 
                dark:bg-gray-700 dark:text-white 
                transition-colors
              "
            />
          </div>
        </div>

        {/* BOTÃO DE TEMA */}
        <button
          onClick={toggleTheme}
          className="
            p-2 md:p-3 
            rounded-lg 
            hover:bg-gray-100 dark:hover:bg-gray-700 
            transition-colors
          "
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon size={20} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun size={22} className="text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
}
