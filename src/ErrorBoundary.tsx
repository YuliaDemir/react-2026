import { Component, type ErrorInfo, type ReactNode } from 'react';

import styles from './ErrorBoundary.module.scss';

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
        <main className={styles.page}>
          <section className={styles.card}>
            <div className={styles.icon} aria-hidden="true">
              !
            </div>

            <h2 className={styles.title}>Something went wrong. TTT</h2>

            <p className={styles.text}>
              The application encountered an unexpected error.
            </p>

            <button
              className={styles.button}
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