import "@testing-library/jest-dom/vitest";
import type { ContextType, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProductsPage } from "./products-page";
import { ThemeContext } from "@/dark-light-theme/theme-context";
import { useLocalStorage } from "@/utils/hooks/use-local-storage-hook";
import { useApiRequest } from "@/utils/hooks/use-api-request";
import { getToForLink } from "@/utils/get-to-for-link";

const navigateMock = vi.fn();
const setLSValueMock = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>(
        "react-router"
    );

    return {
        ...actual,
        useNavigate: () => navigateMock,
        Outlet: ({ context }: { context?: { detailsId?: string | null } }) => (
            <div data-testid="outlet">Outlet detailsId: {context?.detailsId}</div>
        ),
    };
});

vi.mock("@components", () => ({
    Search: ({
        query,
        onSearch,
    }: {
        query: string;
        onSearch: (value: string) => void;
    }) => (
        <div>
            <div data-testid="search-query">{query}</div>

            <button type="button" onClick={() => onSearch("phone")}>
                Search phone
            </button>
        </div>
    ),

    CardList: ({ data }: { data: unknown[] }) => (
        <div data-testid="card-list">Products count: {data.length}</div>
    ),

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

    Pagination: ({ page, total }: { page: number; total: number }) => (
        <div data-testid="pagination">
            Page: {page}, total: {total}
        </div>
    ),
}));

vi.mock("@/components/selected-items-flyout/selected-items-flyout", () => ({
    SelectedItemsBlock: () => <div data-testid="selected-items-block" />,
}));

vi.mock("@/utils/hooks/use-local-storage-hook", () => ({
    useLocalStorage: vi.fn(),
}));

vi.mock("@/utils/hooks/use-api-request", () => ({
    useApiRequest: vi.fn(),
}));

vi.mock("@/utils/get-to-for-link", () => ({
    getToForLink: vi.fn(({ q }: { q?: string }) => ({
        pathname: "/products",
        search: q ? `q=${q}` : "",
    })),
}));

vi.mock("./products-page.module.scss", () => ({
    default: {
        page: "page",
        resultsBlock: "resultsBlock",
        resultsBlockWithOutlet: "resultsBlockWithOutlet",
        contentGrid: "contentGrid",
        listBlock: "listBlock",
        outletBlock: "outletBlock",
        actions: "actions",
    },
}));

const products = [
    {
        id: 1,
        title: "Phone",
        image: "phone.jpg",
    },
];

const renderProductsPage = (
    initialPath = "/products?page=2",
    theme: "light" | "dark" = "light"
) => {
    const themeValue = {
        theme,
        toggleTheme: vi.fn(),
    } as unknown as NonNullable<ContextType<typeof ThemeContext>>;

    return render(
        <ThemeContext.Provider value={themeValue}>
            <MemoryRouter initialEntries={[initialPath]}>
                <ProductsPage />
            </MemoryRouter>
        </ThemeContext.Provider>
    );
};

describe("ProductsPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useLocalStorage).mockReturnValue(["saved query", setLSValueMock]);

        vi.mocked(useApiRequest).mockReturnValue({
            data: {
                products,
                total: 20,
                skip: 0,
                limit: 10,
            },
            isFetching: false,
            error: undefined,
        } as unknown as ReturnType<typeof useApiRequest>);
    });

    it("uses local storage value as initial search query", () => {
        renderProductsPage();

        expect(screen.getByTestId("search-query")).toHaveTextContent("saved query");
    });

    it("requests products with query from local storage and page from URL", () => {
        renderProductsPage("/products?page=2");

        expect(useApiRequest).toHaveBeenCalledWith("saved query", 2);
    });

    it("renders products list", () => {
        renderProductsPage();

        expect(screen.getByTestId("card-list")).toHaveTextContent(
            "Products count: 1"
        );
    });

    it("renders pagination with current page and total", () => {
        renderProductsPage("/products?page=2");

        expect(screen.getByTestId("pagination")).toHaveTextContent(
            "Page: 2, total: 20"
        );
    });

    it("passes loading and error state to ContentState", () => {
        vi.mocked(useApiRequest).mockReturnValue({
            data: {
                products: [],
                total: 0,
                skip: 0,
                limit: 10,
            },
            isFetching: true,
            error: { status: 500 },
        } as unknown as ReturnType<typeof useApiRequest>);

        renderProductsPage();

        expect(screen.getByTestId("content-state")).toHaveAttribute(
            "data-loading",
            "true"
        );

        expect(screen.getByTestId("content-state")).toHaveAttribute(
            "data-error",
            "true"
        );
    });

    it("renders outlet when detailsId exists in URL", () => {
        renderProductsPage("/products?page=2&details=10");

        expect(screen.getByTestId("outlet")).toHaveTextContent(
            "Outlet detailsId: 10"
        );
    });

    it("does not render outlet when detailsId is missing in URL", () => {
        renderProductsPage("/products?page=2");

        expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
    });

    it("navigates with saved query on mount", () => {
        renderProductsPage();

        expect(getToForLink).toHaveBeenCalledWith({
            q: "saved query",
        });

        expect(navigateMock).toHaveBeenCalledWith({
            pathname: "/products",
            search: "q=saved query",
        });
    });

    it("handles search submit", async () => {
        const user = userEvent.setup();

        renderProductsPage();

        vi.clearAllMocks();

        await user.click(screen.getByRole("button", { name: /search phone/i }));

        expect(getToForLink).toHaveBeenCalledWith({
            q: "phone",
        });

        expect(navigateMock).toHaveBeenCalledWith({
            pathname: "/products",
            search: "q=phone",
        });

        expect(setLSValueMock).toHaveBeenCalledWith("phone");
    });

    it("renders SelectedItemsBlock", () => {
        renderProductsPage();

        expect(screen.getByTestId("selected-items-block")).toBeInTheDocument();
    });

    it("adds dark class when theme is dark", () => {
        renderProductsPage("/products?page=2", "dark");

        expect(screen.getByTestId("search-query").closest(".page")).toHaveClass(
            "dark"
        );
    });
});