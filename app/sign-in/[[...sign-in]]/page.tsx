import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="flex-center size-full min-h-screen bg-slate-700">
			<SignIn />
		</div>
	);
}
