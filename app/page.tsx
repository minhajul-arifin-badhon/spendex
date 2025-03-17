import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import type { User } from "@clerk/nextjs/api";

export default function Home() {
	return (
		<div
			className="flex size-full min-h-screen flex-col bg-cover bg-center bg-no-repeat"
			style={{
				backgroundImage: "url(https://i.ibb.co/wZK600gt/landing-background.jpg)"
			}}
		>
			<nav>
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
					<a href="/meditrack" className="flex items-center space-x-3 rtl:space-x-reverse">
						{" "}
						<Image
							src="https://cdn-icons-png.flaticon.com/512/7892/7892621.png"
							className="h-8"
							alt="Spendex Logo"
							width={36}
							height={40}
						/>{" "}
						<span className="self-center text-2xl whitespace-nowrap text-white">Spendex</span>
					</a>

					<div
						className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
						id="navbar-user"
					>
						<ul className="flex font-medium p-4 md:p-0 md:space-x-8 rtl:space-x-reverse mt-0">
							<li>
								<Link href="" className="py-2 px-3 text-blue-500 md:p-0">
									Home
								</Link>
							</li>
							<li>
								<Link
									href=""
									className="py-2 px-3 text-gray-400 md:p-0 hover:text-blue-500 transition-colors duration-300"
								>
									About
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<div className="flex-1 flex-center flex-col max-w-7xl px-10 mx-auto">
				<h1 className="text-white text-center font-extrabold text-4xl lg:text-6xl xl:text-6xl">
					Track, manage, and optimize
				</h1>
				<h1 className="text-white text-center font-extrabold text-4xl lg:text-6xl xl:text-6xl mt-3">
					your finances
				</h1>

				<p className="mt-10 text-gray-300 text-lg text-center">
					With Spendex, effortlessly import transactions from any bank using custom rules, categorize
					transactions and merchants in just a few taps, and explore powerful data visualizations to gain
					insights into your spending habits - ensuring a seamless, personalized financial tracking
					experience.
				</p>

				<div className="mt-20 flex-center flex-col lg:flex-row">
					<Link className="" href="/sign-up">
						<Button className="button-base button-primary my-4">Get Started</Button>
					</Link>
					<Link href="/sign-in">
						<Button className="button-base button-ghost my-4 lg:ml-10">Sign In</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
