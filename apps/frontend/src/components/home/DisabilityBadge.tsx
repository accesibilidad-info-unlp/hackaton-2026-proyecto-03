import { Eye, Keyboard, Brain, Volume2, Accessibility } from 'lucide-react';

interface DisabilityBadgeProps {
  disability: string;
}

export function getDisabilityStyle(disability: string) {
  const normalized = disability.toLowerCase();
  if (normalized.includes('lector') || normalized.includes('ceguera')) {
    return {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30',
      icon: Eye
    };
  }
  if (normalized.includes('visión') || normalized.includes('contraste') || normalized.includes('daltonismo')) {
    return {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30',
      icon: Eye
    };
  }
  if (normalized.includes('teclado') || normalized.includes('motriz')) {
    return {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30',
      icon: Keyboard
    };
  }
  if (normalized.includes('cognitiva') || normalized.includes('estructura') || normalized.includes('comprensión')) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30',
      icon: Brain
    };
  }
  if (normalized.includes('auditiva') || normalized.includes('subtítulo') || normalized.includes('audio')) {
    return {
      bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 dark:border-pink-500/30',
      icon: Volume2
    };
  }
  return {
    bg: 'bg-muted text-muted-foreground border-border',
    icon: Accessibility
  };
}

export function DisabilityBadge({ disability }: DisabilityBadgeProps) {
  const style = getDisabilityStyle(disability);
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all duration-200 hover:scale-105 ${style.bg}`}
    >
      <Icon className="w-3 h-3" />
      {disability}
    </span>
  );
}
