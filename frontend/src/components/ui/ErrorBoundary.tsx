import React from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Rendered inside the app shell (sidebar/topbar stay visible) vs full-page. */
  variant?: "full-page" | "inline";
  resetKey?: unknown;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const isFullPage = this.props.variant !== "inline";

    return (
      <div
        className={
          isFullPage
            ? "flex h-full items-center justify-center bg-neutral-50 px-4"
            : "flex items-center justify-center px-4 py-16"
        }
      >
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-danger-50">
            <AlertTriangle className="h-5 w-5 text-danger-600" />
          </div>
          <h1 className="text-lg font-semibold text-neutral-900">Something went wrong</h1>
          <p className="mt-1 text-sm text-neutral-500">
            This {isFullPage ? "page" : "section"} hit an unexpected error. Your data is safe — try reloading.
          </p>
          <Button variant="primary" className="mt-5 w-full" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    );
  }
}
