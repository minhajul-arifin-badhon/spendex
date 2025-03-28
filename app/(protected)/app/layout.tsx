import { Navbar } from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<Navbar></Navbar>
			<div className="container mx-auto py-5 sm:py-8 px-4">{children}</div>
		</div>
	);
}
