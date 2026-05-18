import { render, screen, within } from '@testing-library/react';
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

vi.mock('@constants', () => ({
  LINKS: {
    home: '/products',
    about: '/about',
  },
}));

vi.mock('@pages', () => ({
  ProductsPage: () => (
    <div data-testid="products-page">
      Products page
      <Outlet />
    </div>
  ),
  AboutPage: () => <div data-testid="about-page">About page</div>,
  NotFoundPage: () => <div data-testid="not-found-page">Not found page</div>,
}));

vi.mock('@components', () => ({
  ProductInfo: () => <div data-testid="product-info" />,
  SideCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="side-card">{children}</div>
  ),
  ThrowErrorButton: () => <button>Throw error</button>,
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

    const navigation = screen.getByRole('navigation', {
      name: /main navigation/i,
    });

    expect(navigation).toBeInTheDocument();

    const productsLink = within(navigation).getByRole('link', {
      name: /products/i,
    });

    const href = productsLink.getAttribute('href');

    expect(new URL(href!, window.location.origin).pathname).toBe('/products');

    expect(
      within(navigation).getByRole('link', { name: /about/i }),
    ).toHaveAttribute('href', '/about');

    expect(
      within(navigation).getByRole('button', { name: /throw error/i }),
    ).toBeInTheDocument();
  });

  it('redirects from root route to products page', () => {
    renderApp('/');

    expect(screen.getByTestId('products-page')).toBeInTheDocument();
    expect(screen.getByTestId('side-card')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
  });

  it('renders products page for /products route', () => {
    renderApp('/products');

    expect(screen.getByTestId('products-page')).toBeInTheDocument();
    expect(screen.getByTestId('side-card')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
  });

  it('renders about page for /about route', () => {
    renderApp('/about');

    expect(screen.getByTestId('about-page')).toBeInTheDocument();
    expect(screen.queryByTestId('products-page')).not.toBeInTheDocument();
  });

  it('renders not found page for unknown route', () => {
    renderApp('/unknown-route');

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});