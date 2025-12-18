/**
 * Loading Spinner Component
 * Displays an animated loading indicator
 */
export default function LoadingSpinner({ size = "md", className = "" }) {
	const sizeClasses = {
		sm: "w-4 h-4 border-2",
		md: "w-6 h-6 border-4",
		lg: "w-8 h-8 border-4",
	};

	return (
		<div
			className={`${sizeClasses[size]} border-white/30 border-t-white rounded-full animate-spin ${className}`}
			aria-busy="true"
		/>
	);
}
