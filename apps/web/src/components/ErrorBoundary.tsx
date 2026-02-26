import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

function ErrorFallback() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 p-8">
      <h2 className="text-2xl font-bold">{t('errors.somethingWentWrong')}</h2>
      <p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
      <Button onClick={() => window.location.reload()}>Reload Page</Button>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>{children}</Sentry.ErrorBoundary>
  );
}
