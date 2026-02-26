import { Sun, Moon, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '../../lib/utils';

const themes = [
  { value: 'light' as const, icon: Sun, labelKey: 'theme.light' },
  { value: 'dark' as const, icon: Moon, labelKey: 'theme.dark' },
  { value: 'system' as const, icon: Monitor, labelKey: 'theme.system' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const { t } = useTranslation();

  return (
    <div className="flex gap-1 rounded-lg border p-1">
      {themes.map(({ value, icon: Icon, labelKey }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            theme === value
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground',
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{t(labelKey)}</span>
        </button>
      ))}
    </div>
  );
}
