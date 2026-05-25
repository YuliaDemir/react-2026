import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CardList } from "./card-list";
import type { Product } from "../../types/interfaces";

vi.mock("./card-list.module.scss", () => ({
    default: {
        list: "list",
        item: "item",
    },
}));

vi.mock("../product-section-card/product-section-card", () => ({
    ProductSectionCard: ({ product }: { product: Product }) => (
        <div data-testid="product-section-card">
            {product.title}
        </div>
    ),
}));

const products: Product[] = [
    {
        id: 1,
        title: "First product",
        description: "First description",
        image: "first-image.jpg",
        category: "",
        price: "",
        stock: 0
    },
    {
        id: 2,
        title: "Second product",
        description: "Second description",
        image: "second-image.jpg",
        category: "",
        price: "",
        stock: 0
    },
];

describe("CardList", () => {
    it("renders list of products", () => {
        render(<CardList data={products} />);

        expect(screen.getByText("First product")).toBeInTheDocument();
        expect(screen.getByText("Second product")).toBeInTheDocument();
    });

    it("renders correct number of cards", () => {
        render(<CardList data={products} />);

        expect(screen.getAllByTestId("card")).toHaveLength(products.length);
        expect(screen.getAllByTestId("product-section-card")).toHaveLength(products.length);
    });

    it("renders empty list when data is empty", () => {
        render(<CardList data={[]} />);

        expect(screen.queryAllByTestId("card")).toHaveLength(0);
    });

    it("applies list class", () => {
        const { container } = render(<CardList data={products} />);

        const list = container.querySelector("ul");

        expect(list).toHaveClass("list");
    });
});