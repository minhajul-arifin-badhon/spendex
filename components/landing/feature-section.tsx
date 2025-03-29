import type React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeatureSectionProps {
	title: string;
	description: string;
	image: string;
	alt: string;
	reversed?: boolean;
	children?: React.ReactNode;
}

export default function FeatureSection({
	title,
	description,
	image,
	alt,
	reversed = false,
	children
}: FeatureSectionProps) {
	return (
		<section className="container py-24 md:py-32 mx-auto">
			<div
				className={cn(
					"mx-auto grid max-w-screen-xl gap-12 md:grid-cols-2 md:items-center md:gap-16",
					reversed && "md:grid-flow-dense"
				)}
			>
				<div className={cn("space-y-6", reversed && "md:col-start-2")}>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
					<p className="text-lg text-muted-foreground">{description}</p>
					{children}
				</div>
				<div
					className={cn(
						"relative aspect-video overflow-hidden rounded-xl border bg-background shadow-xl",
						"before:absolute before:inset-0 before:z-10 before:bg-gradient-to-br before:from-background/10 before:via-background/5 before:to-background/0",
						"after:absolute after:inset-0 after:z-10 after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.15)_100%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(255,255,255,0.08)_100%)]",
						reversed ? "md:col-start-1" : "md:col-start-2"
					)}
				>
					<div className="absolute -inset-40 z-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background blur-3xl" />
					<div className="relative z-20 h-full w-full transform transition-transform duration-500 hover:scale-105">
						<Image
							src={image || "/placeholder.svg"}
							alt={alt}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
