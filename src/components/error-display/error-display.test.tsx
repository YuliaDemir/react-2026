import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { AppError } from "@/types";
import { getErrorMessage } from "@/utils/get-error-message";
import { ErrorDisplay } from "./error-display";

vi.mock("@/utils/get-error-message", () => ({
    getErrorMessage: vi.fn(() => "Test error message"),
}));

describe("ErrorDisplay", () => {
    it("renders error title", () => {
        render(<ErrorDisplay error={{} as AppError} />);

        expect(
            screen.getByRole("heading", { name: /something went wrong/i })
        ).toBeInTheDocument();
    });

    it("renders formatted error message", () => {
        const error = { status: 500, data: "Server error" } as AppError;

        render(<ErrorDisplay error={error} />);

        expect(getErrorMessage).toHaveBeenCalledWith(error);
        expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("renders fallback funny text", () => {
        render(<ErrorDisplay error={{} as AppError} />);

        expect(
            screen.getByText(/don.t panic! the little hamsters/i)
        ).toBeInTheDocument();
    });
});