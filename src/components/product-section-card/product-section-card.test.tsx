// product-section-card.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { ProductSectionCard } from "./product-section-card";
import type { Product } from "@/types";

const mocks = vi.hoisted(() => ({
    useHandleChange: vi.fn(),
    handleChange: vi.fn(),
}));

vi.mock("./product-section-card.module.scss", () => ({
    default: {
        cardButton: "cardButton",
    },
}));

vi.mock("@/utils/hooks/use-handle-change", () => ({
    useHandleChange: mocks.useHandleChange,
}));

vi.mock("../open-close-link/open-close-link", () => ({
    OpenCloseDetailsLink: ({
        children,
        id,
        className,
        ...props
    }: {
        children: ReactNode;
        id: number | string;
        className?: string;
        [key: string]: unknown;
    }) => (
        <a
            href={`/products/${id}`}
            data-testid="open-close-details-link"
            data-id={id}
            className={className}
            data-product-card={props["data-product-card"] ? "true" : undefined}
        >
            {children}
        </a>
    ),
}));

vi.mock("../card/card", () => ({
    Card: ({
        product,
        Checkbox,
    }: {
        product: Product;
        Checkbox?: ReactNode;
    }) => (
        <div data-testid="card">
            <span>{product.title}</span>
            {Checkbox}
        </div>
    ),
}));

vi.mock("../select-checkbox/select-checkbox", () => ({
    SelectCheckbox: ({
        isChecked,
        handleChange,
    }: {
        isChecked: boolean;
        handleChange: () => void;
    }) => (
        <input
            type="checkbox"
            aria-label="Select product"
            checked={isChecked}
            onChange={handleChange}
        />
    ),
}));

const product: Product = {
    id: 1,
    title: "Test product",
    description: "Test description",
    image: "test-image.jpg",
    category: "",
    price: "",
    stock: 0
};

describe("ProductSectionCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.useHandleChange.mockReturnValue({
            isChecked: true,
            handleChange: mocks.handleChange,
        });
    });

    it("calls useHandleChange with product", () => {
        render(<ProductSectionCard product={product} />);

        expect(mocks.useHandleChange).toHaveBeenCalledWith(product);
    });

    it("renders OpenCloseDetailsLink with product id and className", () => {
        render(<ProductSectionCard product={product} />);

        const link = screen.getByTestId("open-close-details-link");

        expect(link).toHaveAttribute("data-id", String(product.id));
        expect(link).toHaveClass("cardButton");
        expect(link).toHaveAttribute("data-product-card", "true");
    });

    it("renders Card with product", () => {
        render(<ProductSectionCard product={product} />);

        expect(screen.getByTestId("card")).toBeInTheDocument();
        expect(screen.getByText(product.title)).toBeInTheDocument();
    });

    it("renders checked SelectCheckbox when product is selected", () => {
        render(<ProductSectionCard product={product} />);

        const checkbox = screen.getByRole("checkbox", {
            name: "Select product",
        });

        expect(checkbox).toBeChecked();
    });

    it("renders unchecked SelectCheckbox when product is not selected", () => {
        mocks.useHandleChange.mockReturnValue({
            isChecked: false,
            handleChange: mocks.handleChange,
        });

        render(<ProductSectionCard product={product} />);

        const checkbox = screen.getByRole("checkbox", {
            name: "Select product",
        });

        expect(checkbox).not.toBeChecked();
    });

    it("calls handleChange when checkbox is clicked", async () => {
        const user = userEvent.setup();

        render(<ProductSectionCard product={product} />);

        await user.click(
            screen.getByRole("checkbox", { name: "Select product" })
        );

        expect(mocks.handleChange).toHaveBeenCalledTimes(1);
    });
});