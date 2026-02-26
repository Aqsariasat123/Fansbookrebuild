import { useTranslation } from 'react-i18next';

export default function Explore() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.explore')}</h1>
      <p className="text-muted-foreground">Discover creators and trending content.</p>
    </div>
  );
}
