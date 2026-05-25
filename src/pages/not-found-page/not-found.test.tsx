import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NotFoundPage } from "./not-found-page";

vi.mock("./not-found-page.module.scss", () => ({
    default: {
        page: "page",
        code: "code",
        title: "title",
    },
}));

vi.mock("@const", () => ({
    LINKS: {
        home: "/",
    },
}));

vi.mock("@/components/button/button-or-link", () => ({
    ButtonOrLink: ({
        children,
        to,
        variant,
        border,
    }: {
        children: React.ReactNode;
        to?: string;
        variant?: string;
        border?: string;
    }) => (
        <a
            href={to}
            data-variant={variant}
            data-border={border}
        >
            {children}
        </a>
    ),
}));

describe("NotFoundPage", () => {
    it("renders 404 code", () => {
        render(<NotFoundPage />);

        expect(screen.getByText("404")).toBeInTheDocument();
    });

    it("renders page title", () => {
        render(<NotFoundPage />);

        expect(
            screen.getByRole("heading", { name: /page not found/i })
        ).toBeInTheDocument();
    });

    it("renders link to home page", () => {
        render(<NotFoundPage />);

        const link = screen.getByRole("link", {
            name: /go to products/i,
        });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/");
    });

    it("passes variant and border to ButtonOrLink", () => {
        render(<NotFoundPage />);

        const link = screen.getByRole("link", {
            name: /go to products/i,
        });

        expect(link).toHaveAttribute("data-variant", "error");
        expect(link).toHaveAttribute("data-border", "round-rectangle");
    });

    it("applies css module classes", () => {
        const { container } = render(<NotFoundPage />);

        expect(container.firstChild).toHaveClass("page");
        expect(screen.getByText("404")).toHaveClass("code");
        expect(
            screen.getByRole("heading", { name: /page not found/i })
        ).toHaveClass("title");
    });
});