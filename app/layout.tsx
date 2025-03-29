import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import {
	Lustria,
	Lato
	// Merriweather_Sans,
	// Source_Sans_3,
} from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/react-query/query-provider";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/theme/theme-provider";
// import { dark, shadesOfPurple } from "@clerk/themes";

const lustria = Lustria({
	weight: ["400"],
	variable: "--font-lustria"
});

const lato = Lato({
	weight: ["300", "400", "700", "900"],
	variable: "--font-lato",
	preload: true
});

// const merriweather = Merriweather_Sans({
// 	variable: "--font-merriweather-sans",
// 	subsets: ["latin"],
// });

// const sourceSans = Source_Sans_3({
// 	variable: "--font-source-sans-3",
// 	subsets: ["latin"],
// });

export const metadata: Metadata = {
	title: "Spendex",
	description: "Track your finances."
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			appearance={{
				elements: {
					formButtonPrimary: ""
				}
			}}
		>
			<html lang="en" suppressHydrationWarning>
				<body className={`${lustria.variable} ${lato.variable} antialiased`}>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
						<QueryProvider>{children}</QueryProvider>
						<Toaster position="top-right" richColors />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
