import type { Theme } from "@/dark-light-theme/theme-context";
import { ThemeProvider } from "@/dark-light-theme/theme-provider";
import { useTheme } from "@/dark-light-theme/use-theme";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    themeLS: "light" as Theme,
    setThemeLS: vi.fn(),
}));

vi.mock("@/constants", () => ({
    LOCAL_STORAGE_THEME_KEY: "theme",
}));

vi.mock("@/utils/hooks/use-local-storage-hook", () => ({
    useLocalStorage: vi.fn(() => [mocks.themeLS, mocks.setThemeLS]),
}));

const TestComponent = () => {
    const { theme, toggle } = useTheme();

    return (
        <div>
            <div data-testid="theme">{theme}</div>

            <button type="button" onClick={toggle}>
                Toggle theme
            </button>
        </div>
    );
};

describe("ThemeProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.themeLS = "light";
        document.documentElement.classList.remove("dark");
    });

    it("renders children", () => {
        render(
            <ThemeProvider>
                <div>Child content</div>
            </ThemeProvider>
        );

        expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("provides initial light theme from localStorage", async () => {
        mocks.themeLS = "light";

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId("theme")).toHaveTextContent("light");

        await waitFor(() => {
            expect(mocks.setThemeLS).toHaveBeenCalledWith("light");
        });

        expect(document.documentElement).not.toHaveClass("dark");
    });

    it("provides initial dark theme from localStorage", async () => {
        mocks.themeLS = "dark";

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId("theme")).toHaveTextContent("dark");

        await waitFor(() => {
            expect(mocks.setThemeLS).toHaveBeenCalledWith("dark");
        });

        expect(document.documentElement).toHaveClass("dark");
    });

    it("toggles theme from light to dark", async () => {
        const user = userEvent.setup();

        mocks.themeLS = "light";

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        await user.click(screen.getByRole("button", { name: /toggle theme/i }));

        expect(screen.getByTestId("theme")).toHaveTextContent("dark");

        await waitFor(() => {
            expect(mocks.setThemeLS).toHaveBeenCalledWith("dark");
        });

        expect(document.documentElement).toHaveClass("dark");
    });

    it("toggles theme from dark to light", async () => {
        const user = userEvent.setup();

        mocks.themeLS = "dark";

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        await user.click(screen.getByRole("button", { name: /toggle theme/i }));

        expect(screen.getByTestId("theme")).toHaveTextContent("light");

        await waitFor(() => {
            expect(mocks.setThemeLS).toHaveBeenCalledWith("light");
        });

        expect(document.documentElement).not.toHaveClass("dark");
    });
});