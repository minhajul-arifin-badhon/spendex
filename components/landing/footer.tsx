import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t bg-muted/40">
			<div className="container py-12 mx-auto px-6">
				<div className="flex flex-col items-center justify-between gap-8 md:flex-row">
					<div className="space-y-4 text-center md:text-left">
						<h3 className="text-xl font-bold">Spendex</h3>
						<p className="text-sm text-muted-foreground max-w-xs">
							Take control of your finances with our powerful expense tracking and analysis tools.
						</p>
					</div>

					<div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
						<div className="space-y-4 text-center md:text-left">
							<h4 className="font-medium">Links</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<Link href="#" className="text-muted-foreground hover:text-primary">
										Features
									</Link>
								</li>
								<li>
									<Link href="#" className="text-muted-foreground hover:text-primary">
										About
									</Link>
								</li>
								<li>
									<Link href="#" className="text-muted-foreground hover:text-primary">
										Contact
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4 text-center md:text-left">
							<h4 className="font-medium">Connect</h4>
							<div className="flex space-x-4 justify-center md:justify-start">
								<Link href="#" className="text-muted-foreground hover:text-primary">
									<Facebook className="h-5 w-5" />
									<span className="sr-only">Facebook</span>
								</Link>
								<Link href="#" className="text-muted-foreground hover:text-primary">
									<Twitter className="h-5 w-5" />
									<span className="sr-only">Twitter</span>
								</Link>
								<Link href="#" className="text-muted-foreground hover:text-primary">
									<Instagram className="h-5 w-5" />
									<span className="sr-only">Instagram</span>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 border-t pt-8 text-center">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Spendex. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
