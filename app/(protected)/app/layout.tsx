import { Navbar } from "@/components/navigation-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<Navbar></Navbar>
			<div className="w-full xl:container mx-auto py-3 sm:py-6 px-4 xl:px-2">
				<div className="space-y-3 lg:space-y-6">{children}</div>
			</div>
		</div>
	);
}
