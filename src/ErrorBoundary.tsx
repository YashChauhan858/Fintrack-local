import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || "Unknown error occurred",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Error:", error);
    console.log("Error Info:", errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 text-white">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            {/* Animated Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-red-500/20">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-3xl font-bold text-white">
                  !
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="mb-3 text-center text-4xl font-bold">
              Something went wrong
            </h1>

            <p className="mb-6 text-center text-zinc-400">
              An unexpected error occurred while rendering this page.
            </p>

            {/* Error Box */}
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="mb-2 text-sm font-semibold text-red-400">
                Error Message
              </p>

              <code className="break-words text-sm text-red-200">
                {this.state.errorMessage}
              </code>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={this.handleReload}
                className="cursor-pointer flex-1 rounded-xl bg-white px-5 py-3 font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-zinc-200 active:scale-95"
              >
                Reload Page
              </button>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-zinc-500">
              If the issue persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
