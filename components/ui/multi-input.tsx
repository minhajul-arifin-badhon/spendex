"use client";

import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Input styles for focus states
const inputStyles = "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none";

interface MultiInputProps {
	value: string[];
	onChange: (value: string[]) => void;
}

export function MultiInput({ value = [], onChange }: MultiInputProps) {
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim()) {
			e.preventDefault();
			// Check if the value already exists
			if (!value.includes(inputValue.trim().toLowerCase())) {
				onChange([...value, inputValue.trim().toLowerCase()]);
				setInputValue("");
			}
		}
	};

	const handleRemove = (item: string) => {
		onChange(value.filter((i) => i !== item));
	};

	return (
		<div className="border rounded-md py-1 px-2 flex flex-wrap gap-2">
			{value.map((item) => (
				<Badge key={item} variant="secondary" className="flex items-center gap-1">
					{item}
					<X
						className="cursor-pointer hover:text-red-600"
						style={{ pointerEvents: "auto" }}
						onClick={() => handleRemove(item)}
					/>
				</Badge>
			))}
			<Input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				className={`flex-1 min-w-[120px] border-0 p-0 h-7 shadow-none ${inputStyles}`}
				placeholder={value.length ? "Add more..." : "Type and press Enter to add..."}
			/>
		</div>
	);
}
