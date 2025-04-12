import FeatureSection from "./feature-section";

export default function FeaturesShowcase() {
	return (
		<div className="overflow-hidden py-8 bg-feature">
			<div className="container mx-auto px-6 mb-10 md:mb-16 text-center">
				<div className="mx-auto mb-6 h-px w-24 bg-primary/50" />
				<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Powerful Features</h2>
				<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
					Everything you need to manage your finances in one place
				</p>
			</div>

			<FeatureSection
				title="Bank-Free Transaction Management"
				description="No need to link sensitive bank accounts. Add transactions manually, then analyze your spending patterns with our comprehensive search tools."
				image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000?height=600&width=800"
				alt="Transaction interface"
			/>
		</div>
	);
}
