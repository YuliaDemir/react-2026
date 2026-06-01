// selected-items-flyout.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { SelectedItemsBlock } from "./selected-items-flyout";
import type { Product } from "@/types";

const mocks = vi.hoisted(() => ({
    selectedProducts: [] as Product[],
    dispatch: vi.fn(),
    clearList: vi.fn(() => ({ type: "selectedItems/clearList" })),
    downloadProductsAsCsv: vi.fn(),
}));

vi.mock("@/store/hook", () => ({
    useAppSelector: vi.fn((selector) => selector({})),
    useAppDispatch: vi.fn(() => mocks.dispatch),
}));

vi.mock("@/store/selected-items/selectors", () => ({
    selectSelectedProductList: vi.fn(() => mocks.selectedProducts),
}));

vi.mock("@/store/selected-items/selected-items-slice", () => ({
    clearList: mocks.clearList,
}));

vi.mock("@/utils/download-products-as-svc", () => ({
    downloadProductsAsCsv: mocks.downloadProductsAsCsv,
}));

vi.mock("./selected-items-flyout.module.scss", () => ({
    default: {
        block: "block",
        info: "info",
        count: "count",
        text: "text",
        actions: "actions",
    },
}));

vi.mock("../button/button-or-link", () => ({
    ButtonOrLink: ({
        children,
        onClick,
        type = "button",
    }: {
        children: React.ReactNode;
        onClick?: () => void;
        type?: "button" | "submit";
    }) => (
        <button type={type} onClick={onClick}>
            {children}
        </button>
    ),
}));

const products: Product[] = [
    {
        id: 1,
        title: "Mascara",
        description: "Black mascara",
        image: "mascara.jpg",
        category: "",
        price: "",
        stock: 0
    },
    {
        id: 2,
        title: "Lipstick",
        description: "Red lipstick",
        image: "lipstick.jpg",
        category: "",
        price: "",
        stock: 0
    },
];

describe("SelectedItemsBlock", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.selectedProducts = [];
    });

    it("renders nothing when selected products list is empty", () => {
        const { container } = render(<SelectedItemsBlock />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renders selected products count", () => {
        mocks.selectedProducts = products;

        render(<SelectedItemsBlock />);

        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("items selected")).toBeInTheDocument();
    });

    it("renders action buttons", () => {
        mocks.selectedProducts = products;

        render(<SelectedItemsBlock />);

        expect(
            screen.getByRole("button", { name: /unselect all/i })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /download/i })
        ).toBeInTheDocument();
    });

    it("dispatches clearList when Unselect all is clicked", async () => {
        const user = userEvent.setup();

        mocks.selectedProducts = products;

        render(<SelectedItemsBlock />);

        await user.click(screen.getByRole("button", { name: /unselect all/i }));

        expect(mocks.clearList).toHaveBeenCalledTimes(1);
        expect(mocks.dispatch).toHaveBeenCalledTimes(1);
        expect(mocks.dispatch).toHaveBeenCalledWith({
            type: "selectedItems/clearList",
        });
    });

    it("calls downloadProductsAsCsv with selected products when Download is clicked", async () => {
        const user = userEvent.setup();

        mocks.selectedProducts = products;

        render(<SelectedItemsBlock />);

        await user.click(screen.getByRole("button", { name: /download/i }));

        expect(mocks.downloadProductsAsCsv).toHaveBeenCalledTimes(1);
        expect(mocks.downloadProductsAsCsv).toHaveBeenCalledWith(products);
    });

    it("applies css module classes", () => {
        mocks.selectedProducts = products;

        const { container } = render(<SelectedItemsBlock />);

        expect(container.firstChild).toHaveClass("block");
        expect(screen.getByText("2")).toHaveClass("count");
        expect(screen.getByText("items selected")).toHaveClass("text");
    });
});