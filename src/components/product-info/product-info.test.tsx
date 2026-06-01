import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { useOutletContext } from "react-router";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useGetProductDetailsQuery } from "@/api/products/products-fetch-slice";
import { ProductInfo } from "./product-info";

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>(
        "react-router"
    );

    return {
        ...actual,
        useOutletContext: vi.fn(),
    };
});

vi.mock("@/api/products/products-fetch-slice", () => ({
    useGetProductDetailsQuery: vi.fn(),
}));

vi.mock("@components", () => ({
    ContentState: ({
        children,
        isLoading,
        error,
    }: {
        children: ReactNode;
        isLoading?: boolean;
        error?: unknown;
    }) => (
        <div
            data-testid="content-state"
            data-loading={String(Boolean(isLoading))}
            data-error={String(Boolean(error))}
        >
            {children}
        </div>
    ),
}));

vi.mock("./product-info.module.scss", () => ({
    default: {
        card: "card",
        image: "image",
        title: "title",
        info: "info",
        infoItem: "infoItem",
        label: "label",
        value: "value",
        description: "description",
    },
}));

const product = {
    id: 10,
    title: "iPhone 15",
    description: "Nice phone",
    category: "smartphones",
    price: "999",
    stock: 25,
    image: "iphone.jpg",
};

describe("ProductInfo", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useOutletContext).mockReturnValue({
            detailsId: "10",
        });

        vi.mocked(useGetProductDetailsQuery).mockReturnValue({
            data: product,
            isFetching: false,
            error: undefined,
        } as unknown as ReturnType<typeof useGetProductDetailsQuery>);
    });

    it("gets detailsId from outlet context and requests product by numeric id", () => {
        render(<ProductInfo />);

        expect(useOutletContext).toHaveBeenCalled();
        expect(useGetProductDetailsQuery).toHaveBeenCalledWith(10);
    });

    it("renders product details", () => {
        render(<ProductInfo />);

        expect(
            screen.getByRole("heading", { name: /iphone 15/i })
        ).toBeInTheDocument();

        expect(screen.getByText("Category:")).toBeInTheDocument();
        expect(screen.getByText("smartphones")).toBeInTheDocument();

        expect(screen.getByText("Price:")).toBeInTheDocument();
        expect(screen.getByText("$999")).toBeInTheDocument();

        expect(screen.getByText("Stock:")).toBeInTheDocument();
        expect(screen.getByText("25")).toBeInTheDocument();

        expect(screen.getByText("Nice phone")).toBeInTheDocument();
    });

    it("renders product image with correct src and alt", () => {
        render(<ProductInfo />);

        const image = screen.getByRole("img", { name: /iphone 15/i });

        expect(image).toHaveAttribute("src", "iphone.jpg");
        expect(image).toHaveAttribute("alt", "iPhone 15");
    });

    it("passes loading state to ContentState", () => {
        vi.mocked(useGetProductDetailsQuery).mockReturnValue({
            data: undefined,
            isFetching: true,
            error: undefined,
        } as unknown as ReturnType<typeof useGetProductDetailsQuery>);

        render(<ProductInfo />);

        expect(screen.getByTestId("content-state")).toHaveAttribute(
            "data-loading",
            "true"
        );
    });

    it("passes error to ContentState", () => {
        vi.mocked(useGetProductDetailsQuery).mockReturnValue({
            data: undefined,
            isFetching: false,
            error: { status: 500 },
        } as unknown as ReturnType<typeof useGetProductDetailsQuery>);

        render(<ProductInfo />);

        expect(screen.getByTestId("content-state")).toHaveAttribute(
            "data-error",
            "true"
        );
    });

    it("renders fallback text when product is missing", () => {
        vi.mocked(useGetProductDetailsQuery).mockReturnValue({
            data: undefined,
            isFetching: false,
            error: undefined,
        } as unknown as ReturnType<typeof useGetProductDetailsQuery>);

        render(<ProductInfo />);

        expect(screen.getByText("Upss. Something went wrong.")).toBeInTheDocument();
    });
});