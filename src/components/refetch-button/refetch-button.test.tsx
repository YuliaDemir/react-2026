import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FocusEvent, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useStateRefetchButton } from "@/utils/hooks/use-handle-refetch";
import { RefetchButton } from "./refetch-button";

vi.mock("@/utils/hooks/use-handle-refetch", () => ({
    useStateRefetchButton: vi.fn(),
}));

vi.mock("./refetch-button.module.scss", () => ({
    default: {
        root: "root",
        menu: "menu",
    },
}));

vi.mock("../button/button-or-link", () => ({
    ButtonOrLink: ({
        children,
        onClick,
        type = "button",
    }: {
        children: ReactNode;
        onClick?: () => void;
        type?: "button" | "submit" | "reset";
    }) => (
        <button type={type} onClick={onClick}>
            {children}
        </button>
    ),
}));

const setIsMenuOpen = vi.fn();
const handleBlur = vi.fn();
const handleRefetch = vi.fn();

const mockUseStateRefetchButton = (isMenuOpen = false) => {
    vi.mocked(useStateRefetchButton).mockReturnValue({
        isMenuOpen,
        setIsMenuOpen,
        handleBlur: handleBlur as unknown as (event: FocusEvent<HTMLDivElement>) => void,
        handleRefetch,
    });
};

describe("RefetchButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseStateRefetchButton();
    });

    it("renders main Refetch button", () => {
        render(<RefetchButton />);

        expect(
            screen.getByRole("button", { name: /^refetch$/i })
        ).toBeInTheDocument();
    });

    it("does not render menu when isMenuOpen is false", () => {
        render(<RefetchButton />);

        expect(
            screen.queryByRole("button", { name: /refetch current/i })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", { name: /clear entire cache/i })
        ).not.toBeInTheDocument();
    });

    it("renders menu buttons when isMenuOpen is true", () => {
        mockUseStateRefetchButton(true);

        render(<RefetchButton />);

        expect(
            screen.getByRole("button", { name: /refetch current/i })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /clear entire cache/i })
        ).toBeInTheDocument();
    });

    it("toggles menu when main Refetch button is clicked", async () => {
        const user = userEvent.setup();

        render(<RefetchButton />);

        await user.click(screen.getByRole("button", { name: /^refetch$/i }));

        expect(setIsMenuOpen).toHaveBeenCalledTimes(1);
        expect(setIsMenuOpen).toHaveBeenCalledWith(expect.any(Function));

        const updater = setIsMenuOpen.mock.calls[0][0];

        expect(updater(false)).toBe(true);
        expect(updater(true)).toBe(false);
    });

    it("calls handleRefetch with current when Refetch current is clicked", async () => {
        const user = userEvent.setup();

        mockUseStateRefetchButton(true);

        render(<RefetchButton />);

        await user.click(screen.getByRole("button", { name: /refetch current/i }));

        expect(handleRefetch).toHaveBeenCalledWith("current");
    });

    it("calls handleRefetch with all when Clear entire cache is clicked", async () => {
        const user = userEvent.setup();

        mockUseStateRefetchButton(true);

        render(<RefetchButton />);

        await user.click(screen.getByRole("button", { name: /clear entire cache/i }));

        expect(handleRefetch).toHaveBeenCalledWith("all");
    });

    it("passes handleBlur to root element", () => {
        render(<RefetchButton />);

        const root = screen.getByRole("button", { name: /^refetch$/i }).parentElement;

        expect(root).toHaveClass("root");
    });
});