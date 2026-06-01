import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { getToForLink } from "@/utils/get-to-for-link";
import { OpenCloseDetailsLink } from "./open-close-link";

vi.mock("@/utils/get-to-for-link", () => ({
    getToForLink: vi.fn(() => ({
        pathname: "/products",
        search: "details=10&page=2",
    })),
}));

describe("OpenCloseDetailsLink", () => {
    it("renders children inside link", () => {
        render(
            <MemoryRouter>
                <OpenCloseDetailsLink id={10} page={2}>
                    Open details
                </OpenCloseDetailsLink>
            </MemoryRouter>
        );

        expect(
            screen.getByRole("link", { name: /open details/i })
        ).toBeInTheDocument();
    });

    it("calls getToForLink with id and page", () => {
        render(
            <MemoryRouter>
                <OpenCloseDetailsLink id={10} page={2}>
                    Open details
                </OpenCloseDetailsLink>
            </MemoryRouter>
        );

        expect(getToForLink).toHaveBeenCalledWith({
            id: 10,
            page: 2,
        });
    });

    it("uses getToForLink result as link href", () => {
        render(
            <MemoryRouter>
                <OpenCloseDetailsLink id={10} page={2}>
                    Open details
                </OpenCloseDetailsLink>
            </MemoryRouter>
        );

        expect(screen.getByRole("link", { name: /open details/i })).toHaveAttribute(
            "href",
            "/products?details=10&page=2"
        );
    });

    it("passes className to link", () => {
        render(
            <MemoryRouter>
                <OpenCloseDetailsLink id={10} page={2} className="test-class">
                    Open details
                </OpenCloseDetailsLink>
            </MemoryRouter>
        );

        expect(screen.getByRole("link", { name: /open details/i })).toHaveClass(
            "test-class"
        );
    });

    it("works without id and page", () => {
        render(
            <MemoryRouter>
                <OpenCloseDetailsLink>Close details</OpenCloseDetailsLink>
            </MemoryRouter>
        );

        expect(getToForLink).toHaveBeenCalledWith({
            id: undefined,
            page: undefined,
        });

        expect(
            screen.getByRole("link", { name: /close details/i })
        ).toBeInTheDocument();
    });
});