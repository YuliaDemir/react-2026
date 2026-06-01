import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
    addProduct,
    removeProduct,
} from "@/store/selected-items/selected-items-slice";
import { selectSelectedProductById } from "@/store/selected-items/selectors";
import type { Product } from "@/types";
import { useHandleChange } from "@/utils/hooks/use-handle-change";

vi.mock("@/store/hook", () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock("@/store/selected-items/selected-items-slice", () => ({
    addProduct: vi.fn((product: Product) => ({
        type: "selectedItems/addProduct",
        payload: product,
    })),

    removeProduct: vi.fn((id: number) => ({
        type: "selectedItems/removeProduct",
        payload: id,
    })),
}));

vi.mock("@/store/selected-items/selectors", () => ({
    selectSelectedProductById: vi.fn((id: number) => ({
        type: "mock-selector",
        id,
    })),
}));

const dispatchMock = vi.fn();

const product = {
    id: 10,
    title: "iPhone",
    description: "Nice phone",
    category: "smartphones",
    price: "999",
    stock: 5,
    image: "iphone.jpg",
} as Product;

describe("useHandleChange", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useAppDispatch).mockReturnValue(dispatchMock);
    });

    it("checks selected product by product id", () => {
        vi.mocked(useAppSelector).mockReturnValue(false);

        renderHook(() => useHandleChange(product));

        expect(selectSelectedProductById).toHaveBeenCalledWith(product.id);
        expect(useAppSelector).toHaveBeenCalledWith({
            type: "mock-selector",
            id: product.id,
        });
    });

    it("returns isChecked from selector", () => {
        vi.mocked(useAppSelector).mockReturnValue(true);

        const { result } = renderHook(() => useHandleChange(product));

        expect(result.current.isChecked).toBe(true);
    });

    it("dispatches addProduct when product is not selected", () => {
        vi.mocked(useAppSelector).mockReturnValue(false);

        const { result } = renderHook(() => useHandleChange(product));

        act(() => {
            result.current.handleChange();
        });

        expect(addProduct).toHaveBeenCalledWith(product);
        expect(removeProduct).not.toHaveBeenCalled();

        expect(dispatchMock).toHaveBeenCalledWith({
            type: "selectedItems/addProduct",
            payload: product,
        });
    });

    it("dispatches removeProduct when product is already selected", () => {
        vi.mocked(useAppSelector).mockReturnValue(true);

        const { result } = renderHook(() => useHandleChange(product));

        act(() => {
            result.current.handleChange();
        });

        expect(removeProduct).toHaveBeenCalledWith(product.id);
        expect(addProduct).not.toHaveBeenCalled();

        expect(dispatchMock).toHaveBeenCalledWith({
            type: "selectedItems/removeProduct",
            payload: product.id,
        });
    });
});