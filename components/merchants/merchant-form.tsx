"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { merchantFormSchema } from "@/lib/validation";
import { Merchant } from "@prisma/client";
import { CategoriesWithSub, CategorySelection, MerchantFormProps } from "@/app/types";
import { useEffect, useState } from "react";
// import { SelectWithClear } from "./ui/select-with-clear";
import { MultiInput } from "../ui/multi-input";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComponentProps {
	defaultValues: MerchantFormProps;
	categories: CategoriesWithSub[];
	onSubmit: (data: MerchantFormProps) => void;
	onCancel: () => void;
	title: string;
	description: string;
	submitButtonText: string;
	existingMerchants?: Merchant[];
	currentMerchantId?: number;
	isFormOpen: boolean;
}

export default function MerchantForm({
	defaultValues,
	categories,
	onSubmit,
	onCancel,
	title,
	description,
	submitButtonText,
	existingMerchants = [],
	currentMerchantId,
	isFormOpen
}: ComponentProps) {
	const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

	const formSchema = merchantFormSchema(existingMerchants, currentMerchantId);

	const form = useForm<MerchantFormProps>({
		resolver: zodResolver(formSchema),
		defaultValues
	});

	const handleFormSubmit = (data: MerchantFormProps) => {
		onSubmit(data);
	};

	const getCategorySelectOptions = (): CategorySelection[] => {
		const options: CategorySelection[] = [];

		categories.forEach((category) => {
			// Add the category itself
			options.push({
				type: "category",
				id: category.id,
				name: category.name
			});

			// Add its subcategories
			category.subcategories.forEach((subcategory) => {
				options.push({
					type: "subcategory",
					id: subcategory.id,
					categoryId: category.id,
					name: `${category.name} / ${subcategory.name}`
				});
			});
		});

		return options;
	};

	const getSelectionDisplayText = (selection: CategorySelection | null) => {
		if (!selection) return "Select category or subcategory";
		return selection.name;
	};

	useEffect(() => {
		if (!isFormOpen) {
			console.log("Resetting form---------------");
			form.reset();
		}
	}, [form, isFormOpen]);

	return (
		<DialogContent className="w-11/12 sm:max-w-3xl max-h-11/12 sm:max-h-11/12 overflow-y-auto">
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
					<div className="grid gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Merchant Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter a name for the merchant" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="includes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>If Description Includes</FormLabel>
									<FormControl>
										<MultiInput value={field.value || []} onChange={field.onChange} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="categorySelection"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Category / Subcategory</FormLabel>
									<FormControl>
										<div className="relative w-full">
											<Popover
												modal={true}
												open={categoryPopoverOpen}
												onOpenChange={setCategoryPopoverOpen}
											>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															role="combobox"
															className={cn(
																"w-full justify-between focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
																!field.value && "text-muted-foreground"
															)}
														>
															{getSelectionDisplayText(field.value)}
															<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-[300px] p-0"
													onInteractOutside={(e) => {
														setCategoryPopoverOpen(false);
														e.preventDefault();
													}}
												>
													<Command>
														<CommandInput
															placeholder="Search category or subcategory..."
															className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
														/>
														<CommandList>
															<CommandEmpty>No results found.</CommandEmpty>
															<CommandGroup>
																{getCategorySelectOptions().map((option) => (
																	<CommandItem
																		key={`${option.type}-${option.id}`}
																		value={option.name}
																		onSelect={() => {
																			// Toggle selection if the same item is clicked
																			if (
																				field.value?.id === option.id &&
																				field.value?.type === option.type
																			) {
																				field.onChange(null);
																			} else {
																				field.onChange(option);
																			}
																			// Close only the popover
																			setCategoryPopoverOpen(false);
																		}}
																		className={cn(
																			option.type === "subcategory" && "pl-6",
																			field.value?.id === option.id &&
																				field.value?.type === option.type &&
																				"bg-accent"
																		)}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				field.value?.id === option.id &&
																					field.value?.type === option.type
																					? "opacity-100"
																					: "opacity-0"
																			)}
																		/>
																		{option.type === "category" ? (
																			<span className="font-medium">
																				{option.name}
																			</span>
																		) : (
																			<span>{option.name.split(" / ")[1]}</span>
																		)}
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											{field.value && (
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full"
													onClick={(e) => {
														e.stopPropagation();
														e.preventDefault();
														field.onChange(null);
													}}
												>
													<X className="h-4 w-4" />
													<span className="sr-only">Clear</span>
												</Button>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<DialogFooter>
						<Button variant="outline" type="button" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit">{submitButtonText}</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}
