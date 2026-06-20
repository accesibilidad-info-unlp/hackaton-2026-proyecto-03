import { ShieldAlert, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldAlert className="w-6 h-6 animate-pulse text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight flex items-center gap-1.5">
              Auditor de Accesibilidad IA
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
            title={darkMode ? "Alternar Modo Claro" : "Alternar Modo Oscuro"}
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-primary" /> : <Moon className="w-4.5 h-4.5 text-primary" />}
          </button>
        </div>
      </div>
    </header>
  );
}
