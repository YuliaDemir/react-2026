import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary-page">
          <section className="error-boundary-card">
            <div className="error-boundary-icon" aria-hidden="true">
              !
            </div>

            <h2 className="error-boundary-title">Something went wrong. TTT</h2>

            <p className="error-boundary-text">
              The application encountered an unexpected error.
            </p>

            <button
              className="error-boundary-button"
              type="button"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;