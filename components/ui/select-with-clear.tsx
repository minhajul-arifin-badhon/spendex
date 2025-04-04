import { Button } from "./button";
import { X } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";

export const SelectWithClear = ({
	value,
	onChange,
	options,
	placeholder
}: {
	value: string | undefined;
	onChange: (value: string) => void;
	options: {
		id: string;
		value: string;
	}[];
	placeholder: string;
}) => {
	return (
		// <Select value={value} onValueChange={onChange}>
		// 	<SelectTrigger className="w-full col-span-3">
		// 		<SelectValue placeholder="Select field" />
		// 	</SelectTrigger>
		// 	<SelectContent>
		// 		{options.map((option) => (
		// 			<SelectItem key={option || "none"} value={option || "None"}>
		// 				{option || "None"}
		// 			</SelectItem>
		// 		))}
		// 	</SelectContent>
		// </Select>
		<div className="w-full relative">
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.id} value={option.id}>
							{option.value}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{value && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full"
					onClick={() => onChange("")}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Clear</span>
				</Button>
			)}
		</div>
	);
};
