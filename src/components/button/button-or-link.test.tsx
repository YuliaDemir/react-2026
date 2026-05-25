import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ButtonOrLink } from "./button-or-link";


vi.mock("./button.module.scss", () => ({
    default: {
        primary: "primary",
        secondary: "secondary",
        error: "error",
        round: "round",
        "round-rectangle": "round-rectangle",
    },
}));

const renderWithRouter = (component: React.ReactNode) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("ButtonOrLink", () => {
    it("renders button by default", () => {
        render(
            <ButtonOrLink>
                Save
            </ButtonOrLink>
        );

        const button = screen.getByRole("button", { name: "Save" });

        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("type", "button");
    });

    it("renders button with submit type", () => {
        render(
            <ButtonOrLink type="submit">
                Submit
            </ButtonOrLink>
        );

        const button = screen.getByRole("button", { name: "Submit" });

        expect(button).toHaveAttribute("type", "submit");
    });

    it("calls onClick when button is clicked", async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(
            <ButtonOrLink onClick={handleClick}>
                Click me
            </ButtonOrLink>
        );

        await user.click(screen.getByRole("button", { name: "Click me" }));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies variant, border and custom class to button", () => {
        render(
            <ButtonOrLink
                variant="primary"
                border="round"
                cn="custom-class"
            >
                Styled button
            </ButtonOrLink>
        );

        const button = screen.getByRole("button", { name: "Styled button" });

        expect(button).toHaveClass("primary");
        expect(button).toHaveClass("round");
        expect(button).toHaveClass("custom-class");
    });

    it("renders link when to prop is passed", () => {
        renderWithRouter(
            <ButtonOrLink to="/products">
                Products
            </ButtonOrLink>
        );

        const link = screen.getByRole("link", { name: "Products" });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/products");
    });

    it("calls onClick when link is clicked", async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        renderWithRouter(
            <ButtonOrLink to="/products" onClick={handleClick}>
                Products
            </ButtonOrLink>
        );

        await user.click(screen.getByRole("link", { name: "Products" }));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies variant, border and custom class to link", () => {
        renderWithRouter(
            <ButtonOrLink
                to="/settings"
                variant="secondary"
                border="round-rectangle"
                cn="external-class"
            >
                Settings
            </ButtonOrLink>
        );

        const link = screen.getByRole("link", { name: "Settings" });

        expect(link).toHaveClass("secondary");
        expect(link).toHaveClass("round-rectangle");
        expect(link).toHaveClass("external-class");
    });

    it("does not add variant and border classes if they are not passed", () => {
        render(
            <ButtonOrLink cn="only-custom">
                Plain button
            </ButtonOrLink>
        );

        const button = screen.getByRole("button", { name: "Plain button" });

        expect(button).toHaveClass("only-custom");
        expect(button).not.toHaveClass("primary");
        expect(button).not.toHaveClass("secondary");
        expect(button).not.toHaveClass("error");
        expect(button).not.toHaveClass("round");
        expect(button).not.toHaveClass("round-rectangle");
    });
});