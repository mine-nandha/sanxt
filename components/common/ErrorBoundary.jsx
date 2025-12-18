"use client";

import { Component } from "react";

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */
export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Error Boundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="flex flex-col items-center justify-center min-h-[400px] p-8">
						<div className="text-red-500 text-xl font-bold mb-4">
							⚠️ Something went wrong
						</div>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							{this.state.error?.message || "An unexpected error occurred"}
						</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
						>
							Reload Page
						</button>
					</div>
				)
			);
		}

		return this.props.children;
	}
}
