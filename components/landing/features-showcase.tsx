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

			{/* <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" /> */}

			<FeatureSection
				title="Effortless Data Import and Mapping"
				description="Easily import your financial data from any CSV or Excel file with our flexible column mapping system. Match your bank's export format to Spendex fields in seconds, ensuring a seamless transition without data loss."
				image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000?height=600&width=800"
				alt="Custom column mapping interface"
			/>

			<FeatureSection
				title="Transaction Categorization with Keyword Matching"
				description="Automatically assign merchants and categories to transactions by matching transaction descriptions with predefined keywords. Simplify categorization and save time with accurate, keyword-driven automation."
				image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000?height=600&width=800"
				alt="Merchant and category suggestion interface"
				reversed
			/>

			<FeatureSection
				title="Bank-Free Transaction Management"
				description="No need to link sensitive bank accounts. Import transactions from files or add them manually, then analyze your spending patterns with our comprehensive dashboard and visualization tools."
				image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000?height=600&width=800"
				alt="Transaction dashboard interface"
			/>

			<FeatureSection
				title="Customizable Categories & Subcategories"
				description="Create a personalized financial organization system with fully customizable categories and subcategories. Tailor Spendex to match your unique spending habits and financial goals."
				image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000?height=600&width=800"
				alt="Category customization interface"
				reversed
			/>
		</div>
	);
}
