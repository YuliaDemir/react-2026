// app.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { App } from './app';

vi.mock('./app.module.scss', () => ({
  default: {
    app: 'app',
    nav: 'nav',
    navLink: 'navLink',
    shell: 'shell',
  },
}));

vi.mock('../constants', () => ({
  LINKS: {
    home: '/products',
    about: '/about',
  },
}));

vi.mock('../pages', () => ({
  ProductsPage: () => (
    <section>
      <h1>Products page</h1>
      <Outlet />
    </section>
  ),
  AboutPage: () => <h1>About page</h1>,
  NotFoundPage: () => <h1>Not found page</h1>,
}));

vi.mock('../components/side-card/side-card', () => ({
  SideCard: ({ children }: { children: React.ReactNode }) => (
    <aside data-testid="side-card">{children}</aside>
  ),
}));

vi.mock('../components/product-info/product-info', () => ({
  ProductInfo: () => <div>Product info</div>,
}));

vi.mock('../components', () => ({
  ThrowErrorButton: () => <button type="button">Throw error</button>,
}));

const renderApp = (initialEntry = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  );
};

describe('App', () => {
  it('renders main navigation', () => {
    renderApp('/products');

    expect(
      screen.getByRole('navigation', { name: /main navigation/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute(
      'href',
      '/products',
    );

    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about',
    );

    expect(
      screen.getByRole('button', { name: /throw error/i }),
    ).toBeInTheDocument();
  });

  it('redirects from root route to products page', () => {
    renderApp('/');

    expect(screen.getByRole('heading', { name: /products page/i })).toBeInTheDocument();
    expect(screen.getByTestId('side-card')).toBeInTheDocument();
    expect(screen.getByText(/product info/i)).toBeInTheDocument();
  });

  it('renders products page for /products route', () => {
    renderApp('/products');

    expect(screen.getByRole('heading', { name: /products page/i })).toBeInTheDocument();
    expect(screen.getByTestId('side-card')).toBeInTheDocument();
    expect(screen.getByText(/product info/i)).toBeInTheDocument();
  });

  it('renders about page for /about route', () => {
    renderApp('/about');

    expect(screen.getByRole('heading', { name: /about page/i })).toBeInTheDocument();
    expect(screen.queryByText(/product info/i)).not.toBeInTheDocument();
  });

  it('renders not found page for unknown route', () => {
    renderApp('/unknown-route');

    expect(screen.getByRole('heading', { name: /not found page/i })).toBeInTheDocument();
  });
});