// throw-error-button.test.tsx

import { Component, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThrowErrorButton } from "./throw-error-button";

vi.mock("../button/button-or-link", () => ({
  ButtonOrLink: ({
    children,
    onClick,
    type = "button",
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
  }) => (
    <button type={type} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

type ErrorBoundaryState = {
  error: Error | null;
};

class TestErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <div role="alert">{this.state.error.message}</div>;
    }

    return this.props.children;
  }
}

describe("ThrowErrorButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders button", () => {
    render(<ThrowErrorButton />);

    expect(
      screen.getByRole("button", { name: /throw error/i })
    ).toBeInTheDocument();
  });

  it("throws simulated fatal error after click", async () => {
    const user = userEvent.setup();

    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <TestErrorBoundary>
        <ThrowErrorButton />
      </TestErrorBoundary>
    );

    await user.click(screen.getByRole("button", { name: /throw error/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Simulated fatal error"
    );

    expect(
      screen.queryByRole("button", { name: /throw error/i })
    ).not.toBeInTheDocument();
  });
});