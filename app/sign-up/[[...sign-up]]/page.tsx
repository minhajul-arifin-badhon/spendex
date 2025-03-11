import { SignUp } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="flex-center size-full min-h-screen bg-slate-700">
			<SignUp />
		</div>
	);
}
