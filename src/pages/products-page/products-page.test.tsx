import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { ProductsPage } from "./products-page";
import type { Product } from "@/types";

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    setLSValue: vi.fn(),
    useAppState: vi.fn(),
    getToForLink: vi.fn(),
    searchParams: "",
    lsValue: "mascara",
    detailsId: null as string | number | null,
    theme: "light",
}));

vi.mock("./products-page.module.scss", () => ({
    default: {
        page: "page",
        resultsBlock: "resultsBlock",
        resultsBlockWithOutlet: "resultsBlockWithOutlet",
        actions: "actions",
    },
}));

vi.mock("react-router", () => ({
    useNavigate: () => mocks.navigate,
    useSearchParams: () => [new URLSearchParams(mocks.searchParams)],
    Outlet: ({ context }: { context: { detailsId: string | number } }) => (
        <div data-testid="outlet">Outlet detailsId: {context.detailsId}</div>
    ),
}));

vi.mock("@components", () => ({
    Search: ({
        query,
        onSearch,
    }: {
        query: string;
        onSearch: (value: string) => void;
    }) => (
        <div data-testid="search">
            <span data-testid="search-query">{query}</span>
            <button type="button" onClick={() => onSearch("lipstick")}>
                Search lipstick
            </button>
        </div>
    ),

    CardList: ({ data }: { data: Product[] }) => (
        <div data-testid="card-list">
            {data.map((product) => (
                <div key={product.id}>{product.title}</div>
            ))}
        </div>
    ),

    ContentState: ({
        error,
        isLoading,
        children,
    }: {
        error: unknown;
        isLoading: boolean;
        children: ReactNode;
    }) => {
        if (error) {
            return <div data-testid="error">Error</div>;
        }

        if (isLoading) {
            return <div data-testid="loader">Loading</div>;
        }

        return <div data-testid="content">{children}</div>;
    },

    Pagination: ({ page, total }: { page: number; total: number }) => (
        <div data-testid="pagination">
            Page: {page}, Total: {total}
        </div>
    ),
}));

vi.mock("@/utils/hooks/use-app-state", () => ({
    useAppState: (...args: unknown[]) => mocks.useAppState(...args),
}));

vi.mock("@/utils/hooks/use-detalisation", () => ({
    useDetalisation: () => ({
        detailsId: mocks.detailsId,
    }),
}));

vi.mock("@/utils/hooks/use-local-storage-hook", () => ({
    useLocalStorage: () => [mocks.lsValue, mocks.setLSValue],
}));

vi.mock("@/utils/get-to-for-link", () => ({
    getToForLink: (...args: unknown[]) => mocks.getToForLink(...args),
}));

vi.mock("@/components/selected-items-flyout/selected-items-flyout", () => ({
    SelectedItemsBlock: () => <div data-testid="selected-items-block" />,
}));

vi.mock("@/dark-light-theme/use-theme", () => ({
    useTheme: () => ({
        theme: mocks.theme,
    }),
}));

const products = [
    {
        id: 1,
        title: "Mascara",
        description: "Black mascara",
        image: "mascara.jpg",
    },
    {
        id: 2,
        title: "Lipstick",
        description: "Red lipstick",
        image: "lipstick.jpg",
    },
] as Product[];

describe("ProductsPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.navigate.mockClear();
        mocks.setLSValue.mockClear();

        mocks.searchParams = "";
        mocks.lsValue = "mascara";
        mocks.detailsId = null;
        mocks.theme = "light";

        mocks.getToForLink.mockReturnValue("/?page=1");

        mocks.useAppState.mockReturnValue({
            data: products,
            isLoading: false,
            error: null,
            total: 20,
        });
    });

    it("renders Search with query from localStorage", () => {
        render(<ProductsPage />);

        expect(screen.getByTestId("search")).toBeInTheDocument();
        expect(screen.getByTestId("search-query")).toHaveTextContent("mascara");
    });

    it("calls useAppState with query from localStorage and page from search params", () => {
        mocks.searchParams = "page=3";

        render(<ProductsPage />);

        expect(mocks.useAppState).toHaveBeenCalledWith("mascara", 3);
    });

    it("uses page 1 when page search param is missing", () => {
        render(<ProductsPage />);

        expect(mocks.useAppState).toHaveBeenCalledWith("mascara", 1);
    });

    it("renders products", () => {
        render(<ProductsPage />);

        expect(screen.getByTestId("card-list")).toBeInTheDocument();
        expect(screen.getByText("Mascara")).toBeInTheDocument();
        expect(screen.getByText("Lipstick")).toBeInTheDocument();
    });

    it("renders pagination when there is no error and loading is false", () => {
        mocks.searchParams = "page=2";

        render(<ProductsPage />);

        expect(screen.getByTestId("pagination")).toHaveTextContent(
            "Page: 2, Total: 20"
        );
    });

    it("does not render pagination while loading", () => {
        mocks.useAppState.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
            total: 0,
        });

        render(<ProductsPage />);

        expect(screen.getByTestId("loader")).toBeInTheDocument();
        expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("does not render pagination when error exists", () => {
        mocks.useAppState.mockReturnValue({
            data: [],
            isLoading: false,
            error: new Error("Failed"),
            total: 0,
        });

        render(<ProductsPage />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
        expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("handles search: navigates to first page, updates query and localStorage", async () => {
        const user = userEvent.setup();

        render(<ProductsPage />);

        await user.click(screen.getByRole("button", { name: /search lipstick/i }));

        expect(mocks.getToForLink).toHaveBeenCalledWith(undefined, 1);
        expect(mocks.navigate).toHaveBeenCalledWith("/?page=1");
        expect(mocks.setLSValue).toHaveBeenCalledWith("lipstick");

        await waitFor(() => {
            expect(mocks.useAppState).toHaveBeenLastCalledWith("lipstick", 1);
        });
    });

    it("renders Outlet when detailsId exists", () => {
        mocks.detailsId = 10;

        render(<ProductsPage />);

        expect(screen.getByTestId("outlet")).toHaveTextContent(
            "Outlet detailsId: 10"
        );
    });

    it("does not render Outlet when detailsId does not exist", () => {
        mocks.detailsId = null;

        render(<ProductsPage />);

        expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
    });

    it("adds details class when details are open", () => {
        mocks.detailsId = 10;

        const { container } = render(<ProductsPage />);

        expect(
            container.querySelector(".resultsBlockWithOutlet")
        ).toBeInTheDocument();
    });

    it("adds dark class when theme is dark", () => {
        mocks.theme = "dark";

        const { container } = render(<ProductsPage />);

        expect(container.querySelector(".page")).toHaveClass("dark");
    });

    it("renders SelectedItemsBlock", () => {
        render(<ProductsPage />);

        expect(screen.getByTestId("selected-items-block")).toBeInTheDocument();
    });
});