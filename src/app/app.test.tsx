import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { App } from "./app";

vi.mock("./app.module.scss", () => ({
  default: {
    app: "app",
    nav: "nav",
    shell: "shell",
  },
}));

vi.mock("@const", () => ({
  LINKS: {
    home: "/products",
    about: "/about",
  },
}));

vi.mock("@/components/theme-switcher/theme-switcher", () => ({
  ThemeSwitcher: () => <button type="button">Theme switcher</button>,
}));

vi.mock("@/components/button/button-or-link", () => ({
  ButtonOrLink: ({
    children,
    to,
    onClick,
    type = "button",
  }: {
    children: ReactNode;
    to?: string;
    onClick?: () => void;
    type?: "button" | "submit";
  }) => {
    if (to) {
      return <a href={to}>{children}</a>;
    }

    return (
      <button type={type} onClick={onClick}>
        {children}
      </button>
    );
  },
}));

vi.mock("@components", () => ({
  ThrowErrorButton: () => <button type="button">Throw error</button>,

  SideCard: ({ children }: { children: ReactNode }) => (
    <aside data-testid="side-card">{children}</aside>
  ),

  ProductInfo: () => <div data-testid="product-info">Product info</div>,
}));

vi.mock("@pages", async () => {
  const { Outlet } =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ProductsPage: () => (
      <div>
        <h1>Products page</h1>
        <Outlet />
      </div>
    ),

    AboutPage: () => <h1>About page</h1>,

    NotFoundPage: () => <h1>Not found page</h1>,
  };
});

const renderApp = (initialEntries = ["/products"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
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

    expect(
      screen.getByRole("button", { name: /theme switcher/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /products/i })
    ).toHaveAttribute("href", "/products");

    expect(
      screen.getByRole("link", { name: /about/i })
    ).toHaveAttribute("href", "/about");

    expect(
      screen.getByRole("button", { name: /throw error/i })
    ).toBeInTheDocument();
  });

  it("redirects from root path to products page", async () => {
    renderApp(["/"]);

    expect(
      await screen.findByRole("heading", { name: /products page/i })
    ).toBeInTheDocument();
  });

  it("renders products page on /products", () => {
    renderApp(["/products"]);

    expect(
      screen.getByRole("heading", { name: /products page/i })
    ).toBeInTheDocument();
  });

  it("renders product info inside side card for products index route", () => {
    renderApp(["/products"]);

    expect(screen.getByTestId("side-card")).toBeInTheDocument();
    expect(screen.getByTestId("product-info")).toBeInTheDocument();
  });

  it("renders about page on /about", () => {
    renderApp(["/about"]);

    expect(
      screen.getByRole("heading", { name: /about page/i })
    ).toBeInTheDocument();
  });

  it("renders not found page for unknown route", () => {
    renderApp(["/unknown-page"]);

    expect(
      screen.getByRole("heading", { name: /not found page/i })
    ).toBeInTheDocument();
  });

  it("applies layout classes", () => {
    const { container } = renderApp();

    expect(container.firstChild).toHaveClass("app");
    expect(screen.getByRole("navigation")).toHaveClass("nav");
    expect(screen.getByRole("main")).toHaveClass("shell");
  });
});