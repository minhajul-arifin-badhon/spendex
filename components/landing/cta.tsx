import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
	return (
		<section className="relative overflow-hidden border-t border-b">
			<div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/10" />
			<div className="container relative z-10 flex flex-col items-center gap-6 mx-auto py-24 text-center md:py-32">
				<h2 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
					Ready to take control of your finances?
				</h2>
				<p className="max-w-[42rem] text-lg text-muted-foreground">
					Join thousands of users who have transformed their financial habits with Spendex. Start your journey
					to financial clarity today.
				</p>
				<div className="flex flex-col gap-4 sm:flex-row">
					<Button size="lg" className="px-8">
						Get Started Free
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
					<Button size="lg" variant="outline">
						Schedule a Demo
					</Button>
				</div>
			</div>
		</section>
	);
}
