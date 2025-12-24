import localFont from "next/font/local";
import "./globals.css";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Navigation from "@/components/layout/Navigation";
import { ThemeProvider } from "@/lib/context/ThemeContext";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	title: "BRK Generator",
	description: "Dev - Nandha",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider>
					<Navigation />
					<ErrorBoundary>{children}</ErrorBoundary>
				</ThemeProvider>
			</body>
		</html>
	);
}
