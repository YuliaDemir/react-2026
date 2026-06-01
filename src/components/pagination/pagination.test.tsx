import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OpenCloseDetailsLink } from "@components";
import { Pagination } from "./pagination";

vi.mock("@const", () => ({
    PRODUCTS_PER_PAGE: 10,
}));

vi.mock("./pagination.module.scss", () => ({
    default: {
        paginationButton: "paginationButton",
        disabled: "disabled",
        pageInfo: "pageInfo",
    },
}));

vi.mock("@components", () => ({
    OpenCloseDetailsLink: vi.fn(
        ({
            children,
            page,
            className,
        }: {
            children: React.ReactNode;
            page?: number;
            className?: string;
        }) => (
            <a href={`/products?page=${page}`} className={className} data-page={page}>
                {children}
            </a>
        )
    ),
}));

describe("Pagination", () => {
    it("renders Previous and Next links", () => {
        render(<Pagination page={2} total={30} />);

        expect(screen.getByRole("link", { name: /previous/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /next/i })).toBeInTheDocument();
    });

    it("renders current page and max page", () => {
        render(<Pagination page={2} total={30} />);

        expect(screen.getByText("Page: 2 from 3")).toBeInTheDocument();
    });

    it("renders all products text when total is 0", () => {
        render(<Pagination page={1} total={0} />);

        expect(screen.getByText("Page: 1 from all products")).toBeInTheDocument();
    });

    it("passes previous page to Previous link", () => {
        render(<Pagination page={3} total={50} />);

        expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
            "data-page",
            "2"
        );
    });

    it("does not pass page less than 1 to Previous link", () => {
        render(<Pagination page={1} total={50} />);

        expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
            "data-page",
            "1"
        );
    });

    it("passes next page to Next link", () => {
        render(<Pagination page={2} total={50} />);

        expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
            "data-page",
            "3"
        );
    });

    it("does not pass page greater than maxPage to Next link", () => {
        render(<Pagination page={5} total={50} />);

        expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
            "data-page",
            "5"
        );
    });

    it("adds disabled class to Previous link on first page", () => {
        render(<Pagination page={1} total={50} />);

        expect(screen.getByRole("link", { name: /previous/i })).toHaveClass(
            "disabled"
        );
    });

    it("adds disabled class to Next link on last page", () => {
        render(<Pagination page={5} total={50} />);

        expect(screen.getByRole("link", { name: /next/i })).toHaveClass("disabled");
    });

    it("calls OpenCloseDetailsLink with correct pages", () => {
        render(<Pagination page={2} total={30} />);

        expect(OpenCloseDetailsLink).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 1,
                children: "Previous",
            }),
            undefined
        );

        expect(OpenCloseDetailsLink).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 3,
                children: "Next",
            }),
            undefined
        );
    });
});