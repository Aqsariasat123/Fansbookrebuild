// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '../pages/Login';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Login page', () => {
  it('renders login heading', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText('Welcome Back to FansBook')).toBeInTheDocument();
  });

  it('renders login button', () => {
    renderWithProviders(<Login />);
    const buttons = screen.getAllByRole('button');
    const submitBtn = buttons.find((b) => b.getAttribute('type') === 'submit');
    expect(submitBtn).toBeDefined();
    expect(submitBtn?.textContent).toBe('Login');
  });
});
