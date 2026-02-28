import { useThemeStore } from '../../stores/themeStore';

export function SettingsDisplay() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] text-foreground">Display Settings</p>

      <div className="rounded-[12px] bg-muted p-[14px]">
        <p className="mb-3 text-[14px] text-foreground">Theme</p>
        <div className="flex gap-3">
          {(['dark', 'light', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-[12px] px-[16px] py-[8px] text-[14px] capitalize transition-colors ${
                theme === t
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[12px] bg-muted p-[14px]">
        <p className="mb-1 text-[14px] text-foreground">Interface</p>
        <p className="text-[12px] text-muted-foreground">
          More display options like font size and compact mode coming soon.
        </p>
      </div>
    </div>
  );
}
