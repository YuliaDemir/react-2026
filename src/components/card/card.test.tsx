// card.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Card } from "./card";
import type { Product } from "../../types/interfaces";

vi.mock("./card.module.scss", () => ({
    default: {
        card: "card",
        checkbox: "checkbox",
        image: "image",
        title: "title",
        description: "description",
    },
}));

const product: Product = {
    id: 1,
    title: "Test product",
    description: "Test product description",
    image: "test-image.jspg",
    category: "",
    price: '40',
    stock: 40
};

describe("Card", () => {
    it("renders product image, title and description", () => {
        render(<Card product={product} />);

        expect(
            screen.getByRole("img", { name: product.title })
        ).toBeInTheDocument();

        expect(screen.getByText(product.title)).toBeInTheDocument();
        expect(screen.getByText(product.description)).toBeInTheDocument();
    });

    it("renders image with correct src and alt", () => {
        render(<Card product={product} />);

        const image = screen.getByRole("img", { name: product.title });

        expect(image).toHaveAttribute("src", product.image);
        expect(image).toHaveAttribute("alt", product.title);
    });

    it("does not render checkbox if Checkbox prop is not passed", () => {
        render(<Card product={product} />);

        expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("renders checkbox if Checkbox prop is passed", () => {
        render(
            <Card
                product={product}
                Checkbox={<input type="checkbox" aria-label="Select product" />}
            />
        );

        expect(
            screen.getByRole("checkbox", { name: "Select product" })
        ).toBeInTheDocument();
    });

    it("applies card class", () => {
        const { container } = render(<Card product={product} />);

        expect(container.firstChild).toHaveClass("card");
    });
});