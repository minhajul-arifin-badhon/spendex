"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { transactionFormSchema } from "@/lib/validation";
import { Merchant } from "@prisma/client";
import { CategoriesWithSub, CategorySelection, TransactionFormProps } from "@/app/types";
import { useEffect, useState } from "react";
// import { SelectWithClear } from "./ui/select-with-clear";
import { CalendarIcon, Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";

interface ComponentProps {
	defaultValues: TransactionFormProps;
	categories: CategoriesWithSub[];
	merchants: Merchant[];
	onSubmit: (data: TransactionFormProps) => void;
	onCancel: () => void;
	title: string;
	description: string;
	submitButtonText: string;
	// existingMerchants?: Merchant[];
	// currentTransactionId?: number;
	isFormOpen: boolean;
}

export default function TransactionForm({
	defaultValues,
	categories,
	merchants,
	onSubmit,
	onCancel,
	title,
	description,
	submitButtonText,
	// existingMerchants = [],
	// currentTransactionId,
	isFormOpen
}: ComponentProps) {
	const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
	const [merchantPopoverOpen, setMerchantPopoverOpen] = useState(false);

	// const [isProcessing, setIsProcessing] = useState(false);
	const [newMerchantName, setNewMerchantName] = useState("");
	const [showAddMerchant, setShowAddMerchant] = useState(false);
	const [merchantError, setMerchantError] = useState<string | null>(null);

	// Add state for controlling popover open/close
	const [dateOpen, setDateOpen] = useState(false);
	// const [merchantOpen, setMerchantOpen] = useState(false);

	// const formSchema = merchantFormSchema(existingMerchants, currentMerchantId);

	const form = useForm<TransactionFormProps>({
		resolver: zodResolver(transactionFormSchema),
		defaultValues
	});

	// Call onSubmit and reset form when the form is submitted
	const handleFormSubmit = (data: TransactionFormProps) => {
		// console.log(data);
		onSubmit(data);
	};

	// Create a function to prepare the category/subcategory data for the select
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

	// Function to get display text for a selection
	const getCategorySelectionDisplayText = (selection: CategorySelection | null) => {
		if (!selection) return "Select category or subcategory";
		return selection.name;
	};

	const handleCreateNewMerchant = (name: string) => {
		if (!name.trim()) return;

		// Check if merchant already exists
		const merchantExists = merchants.some((merchant) => merchant.name.toLowerCase() === name.trim().toLowerCase());

		if (merchantExists) {
			setMerchantError(`"${name}" already exists. Please select from the dropdown.`);
			return;
		}

		setMerchantError(null);
		form.setValue("merchant", name);
		form.trigger("merchant");
		// setMerchantOpen(false);
		setShowAddMerchant(false);
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
						{/* Date Field */}
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date*</FormLabel>
									<Popover open={dateOpen} onOpenChange={setDateOpen}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full h-10 pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={(date) => {
													field.onChange(date);
													setDateOpen(false);
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="accountName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Account Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter an account name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Amount Field */}
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount*</FormLabel>
									<FormDescription className="font-normal">
										Enter a postive (+) number for money in and a negative (-) number for money out.
									</FormDescription>
									<FormControl>
										<Input placeholder="0.00" {...field} type="number" step="1" className="h-10" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Merchant Field - Now Optional */}
						<FormField
							control={form.control}
							name="merchant"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="flex items-center gap-1">
										Merchant
										{/* <span className="text-sm text-muted-foreground font-normal">(optional)</span> */}
									</FormLabel>
									{showAddMerchant ? (
										<div className="space-y-2">
											<div className="flex gap-2">
												<Input
													placeholder="Enter new merchant name"
													value={newMerchantName}
													onChange={(e) => {
														setNewMerchantName(e.target.value);
														setMerchantError(null);
													}}
													className="flex-1"
												/>
												<Button
													type="button"
													onClick={() => handleCreateNewMerchant(newMerchantName)}
													disabled={!newMerchantName.trim()}
												>
													Add
												</Button>
												<Button
													type="button"
													variant="outline"
													onClick={() => {
														setShowAddMerchant(false);
														setNewMerchantName("");
														setMerchantError(null);
													}}
												>
													Cancel
												</Button>
											</div>
											{merchantError && (
												<p className="text-sm font-medium text-destructive">{merchantError}</p>
											)}
										</div>
									) : (
										<div className="flex gap-2">
											<div className="relative flex-1">
												{/* <FormControl> */}
												<>
													<Popover
														modal={true}
														open={merchantPopoverOpen}
														onOpenChange={setMerchantPopoverOpen}
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
																	{field.value ? field.value : "Select merchant"}
																	<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent
															className="w-[300px] p-0"
															onInteractOutside={(e) => {
																setMerchantPopoverOpen(false);
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
																		{merchants.map((option) => (
																			<CommandItem
																				key={`${option.id}`}
																				value={option.name}
																				onSelect={() => {
																					// Toggle selection if the same item is clicked
																					if (field.value === option.name) {
																						field.onChange("");
																					} else {
																						field.onChange(option.name);
																					}
																					// Close only the popover
																					setMerchantPopoverOpen(false);
																				}}
																				className={cn(
																					field.value === option.name &&
																						"bg-accent"
																				)}
																			>
																				<Check
																					className={cn(
																						"mr-2 h-4 w-4",
																						field.value === option.name
																							? "opacity-100"
																							: "opacity-0"
																					)}
																				/>
																				<span>{option.name}</span>
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
																field.onChange("");
															}}
														>
															<X className="h-4 w-4" />
															<span className="sr-only">Clear</span>
														</Button>
													)}
												</>
												{/* </FormControl> */}
											</div>
											<Button
												type="button"
												variant="outline"
												className="shrink-0"
												onClick={() => setShowAddMerchant(true)}
											>
												<Plus className="h-4 w-4" />
											</Button>
										</div>
									)}
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
															{getCategorySelectionDisplayText(field.value)}
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

						{/* Description Field */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter transaction description"
											className="resize-none"
											{...field}
										/>
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
						{/* <Button type="submit" disabled={isProcessing}> */}
						<Button type="submit">
							{/* {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
							{submitButtonText}
						</Button>
						{/* <Button type="submit">{submitButtonText}</Button> */}
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}
