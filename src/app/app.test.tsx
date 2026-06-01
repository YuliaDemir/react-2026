import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { App } from "./app";

vi.mock("@pages", () => ({
  ProductsPage: () => (
    <div>
      Products page
      <div data-testid="products-outlet" />
    </div>
  ),
  AboutPage: () => <div>About page</div>,
  NotFoundPage: () => <div>Not found page</div>,
}));

vi.mock("@components", () => ({
  ProductInfo: () => <div>Product info</div>,
  SideCard: ({ children }: { children: React.ReactNode }) => (
    <aside>{children}</aside>
  ),
  ThrowErrorButton: () => <button type="button">Throw error</button>,
}));

vi.mock("@/components/theme-switcher/theme-switcher", () => ({
  ThemeSwitcher: () => <button type="button">Theme switcher</button>,
}));

vi.mock("@/components/refetch-button/refetch-button", () => ({
  RefetchButton: () => <button type="button">Refetch</button>,
}));

vi.mock("@/components/button/button-or-link", async () => {
  const { Link } = await import("react-router");

  return {
    ButtonOrLink: ({
      children,
      to,
      onClick,
      type = "button",
    }: {
      children: React.ReactNode;
      to?: string;
      onClick?: () => void;
      type?: "button" | "submit" | "reset";
    }) =>
      to ? (
        <Link to={to}>{children}</Link>
      ) : (
        <button type={type} onClick={onClick}>
          {children}
        </button>
      ),
  };
});

const renderApp = (initialPath = "/products") => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  );
};

describe("App", () => {
  it("renders main navigation", () => {
    renderApp();

    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Theme switcher")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /refetch/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /throw error/i })
    ).toBeInTheDocument();
  });

  it("redirects from root path to products page", () => {
    renderApp("/");

    expect(screen.getByText("Products page")).toBeInTheDocument();
  });

  it("renders products page on products route", () => {
    renderApp("/products");

    expect(screen.getByText("Products page")).toBeInTheDocument();
  });

  it("renders about page on about route", () => {
    renderApp("/about");

    expect(screen.getByText("About page")).toBeInTheDocument();
  });

  it("renders not found page for unknown route", () => {
    renderApp("/unknown-route");

    expect(screen.getByText("Not found page")).toBeInTheDocument();
  });
});