import { ThemeContext } from "@/dark-light-theme/theme-context";
import { useTheme } from "@/dark-light-theme/use-theme";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";

const TestComponent = () => {
    const { theme, toggle } = useTheme();

    return (
        <>
            <div data-testid="theme">{theme}</div>
            <button type="button" onClick={toggle}>
                Toggle theme
            </button>
        </>
    );
};

describe("useTheme", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns theme context value", () => {
        const toggle = vi.fn();

        render(
            <ThemeContext.Provider value={{ theme: "dark", toggle }}>
                <TestComponent />
            </ThemeContext.Provider>
        );

        expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });

    it("calls toggle from context", async () => {
        const user = userEvent.setup();
        const toggle = vi.fn();

        render(
            <ThemeContext.Provider value={{ theme: "light", toggle }}>
                <TestComponent />
            </ThemeContext.Provider>
        );

        await user.click(screen.getByRole("button", { name: /toggle theme/i }));

        expect(toggle).toHaveBeenCalledTimes(1);
    });

    it("throws error when used outside ThemeProvider", () => {
        vi.spyOn(console, "error").mockImplementation(() => undefined);

        expect(() => render(<TestComponent />)).toThrow(
            "useTheme must be used inside ThemeProvider"
        );
    });
});