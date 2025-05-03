"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
	// const [queryClient] = useState(() => new QueryClient());
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 15 * 60 * 1000, // 15 minutes
						gcTime: 30 * 60 * 1000, // 30 minutes
						refetchOnWindowFocus: true,
						retry: 1
					}
				}
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
}
