import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { ThemeSwitcher } from "./theme-switcher";
import type { Theme } from "@/dark-light-theme/theme-context";

const mocks = vi.hoisted(() => ({
    theme: "light" as Theme,
    toggle: vi.fn(),
}));

vi.mock("@/dark-light-theme/use-theme", () => ({
    useTheme: () => ({
        theme: mocks.theme,
        toggle: mocks.toggle,
    }),
}));

vi.mock("./theme-switcher.module.scss", () => ({
    default: {
        switcher: "switcher",
        icon: "icon",
        text: "text",
        track: "track",
        thumb: "thumb",
    },
}));

vi.mock("../button/button-or-link", () => ({
    ButtonOrLink: ({
        children,
        cn,
        ...props
    }: ButtonHTMLAttributes<HTMLButtonElement> & {
        children: ReactNode;
        cn?: string;
    }) => (
        <button className={cn} {...props}>
            {children}
        </button>
    ),
}));

describe("ThemeSwitcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.theme = "light";
    });

    it("renders light theme state", () => {
        render(<ThemeSwitcher />);

        const button = screen.getByRole("button", {
            name: "Switch to dark theme",
        });

        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("aria-pressed", "false");

        expect(screen.getByText("☀️")).toBeInTheDocument();
        expect(screen.getByText("Light")).toBeInTheDocument();
    });

    it("renders dark theme state", () => {
        mocks.theme = "dark";

        render(<ThemeSwitcher />);

        const button = screen.getByRole("button", {
            name: "Switch to light theme",
        });

        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("aria-pressed", "true");

        expect(screen.getByText("🌙")).toBeInTheDocument();
        expect(screen.getByText("Dark")).toBeInTheDocument();
    });

    it("calls toggle when clicked", async () => {
        const user = userEvent.setup();

        render(<ThemeSwitcher />);

        await user.click(
            screen.getByRole("button", {
                name: "Switch to dark theme",
            })
        );

        expect(mocks.toggle).toHaveBeenCalledTimes(1);
    });

    it("applies css module classes", () => {
        render(<ThemeSwitcher />);

        const button = screen.getByRole("button", {
            name: "Switch to dark theme",
        });

        expect(button).toHaveClass("switcher");
        expect(screen.getByText("☀️")).toHaveClass("icon");
        expect(screen.getByText("Light")).toHaveClass("text");
    });
});