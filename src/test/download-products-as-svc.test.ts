import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Product } from "@/types/interfaces";
import { downloadProductsAsCsv } from "@/utils/download-products-as-svc";

vi.mock("@/constants", () => ({
    HEADERS_FOR_SVC: [
        "ID",
        "Title",
        "Description",
        "Category",
        "Price",
        "Stock",
        "Image",
        "Details URL",
    ],
}));

const products = [
    {
        id: 1,
        title: "Mascara",
        description: 'Black "volume" mascara',
        category: "beauty",
        price: '10',
        stock: 5,
        image: "mascara.jpg",
    },
    {
        id: 2,
        title: "Lipstick",
        description: "Red lipstick",
        category: "makeup",
        price: '15',
        stock: 3,
        image: "lipstick.jpg",
    },
] as Product[];

describe("downloadProductsAsCsv", () => {
    const createObjectURLMock = vi.fn<(blob: Blob) => string>(
        () => "blob:mock-url"
    );

    const revokeObjectURLMock = vi.fn<(url: string) => void>();

    const clickMock = vi.fn<() => void>();

    beforeEach(() => {
        vi.clearAllMocks();

        Object.defineProperty(URL, "createObjectURL", {
            writable: true,
            value: createObjectURLMock,
        });

        Object.defineProperty(URL, "revokeObjectURL", {
            writable: true,
            value: revokeObjectURLMock,
        });

        vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(clickMock);
    });

    it("creates blob with correct csv content", async () => {
        downloadProductsAsCsv(products);

        const blob = createObjectURLMock.mock.calls[0][0];

        const text = await blob.text();

        expect(blob.type).toBe("text/csv;charset=utf-8;");
        expect(text).toContain('"ID","Title","Description"');
    });
});