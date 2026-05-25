import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SelectCheckbox } from "./select-checkbox";

vi.mock("./select-checkbox.module.scss", () => ({
    default: {
        checkbox: "checkbox",
    },
}));

describe("SelectCheckbox", () => {
    it("renders checkbox by default", () => {
        render(<SelectCheckbox isChecked={false} />);

        const checkbox = screen.getByRole("checkbox", {
            name: "Select product",
        });

        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveAttribute("type", "checkbox");
    });

    it("renders radio when type is radio", () => {
        render(<SelectCheckbox isChecked={false} type="radio" />);

        const radio = screen.getByRole("radio", {
            name: "Select product",
        });

        expect(radio).toBeInTheDocument();
        expect(radio).toHaveAttribute("type", "radio");
    });

    it("is checked when isChecked is true", () => {
        render(<SelectCheckbox isChecked />);

        expect(
            screen.getByRole("checkbox", { name: "Select product" })
        ).toBeChecked();
    });

    it("is not checked when isChecked is false", () => {
        render(<SelectCheckbox isChecked={false} />);

        expect(
            screen.getByRole("checkbox", { name: "Select product" })
        ).not.toBeChecked();
    });

    it("calls handleChange when value changes", () => {
        const handleChange = vi.fn();

        render(
            <SelectCheckbox
                isChecked={false}
                handleChange={handleChange}
            />
        );

        fireEvent.click(
            screen.getByRole("checkbox", { name: "Select product" })
        );

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("calls custom handleClick when clicked", () => {
        const handleClick = vi.fn();

        render(
            <SelectCheckbox
                isChecked={false}
                handleClick={handleClick}
            />
        );

        fireEvent.click(
            screen.getByRole("checkbox", { name: "Select product" })
        );

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("stops propagation by default on click", () => {
        const parentClick = vi.fn();

        render(
            <div onClick={parentClick}>
                <SelectCheckbox isChecked={false} />
            </div>
        );

        fireEvent.click(
            screen.getByRole("checkbox", { name: "Select product" })
        );

        expect(parentClick).not.toHaveBeenCalled();
    });

    it("applies checkbox class", () => {
        render(<SelectCheckbox isChecked={false} />);

        expect(
            screen.getByRole("checkbox", { name: "Select product" })
        ).toHaveClass("checkbox");
    });
});