import HeroNavbar from "@/components/landing/hero-navbar";
import HeroSection from "@/components/landing/hero-section";
import FeaturesShowcase from "@/components/landing/features-showcase";
import Footer from "@/components/landing/footer";

export default function Home() {
	return (
		<div className="relative min-h-screen">
			<div className="relative z-10">
				<HeroNavbar />
				<HeroSection />
				<FeaturesShowcase />
				<Footer />
			</div>
		</div>
	);
}
