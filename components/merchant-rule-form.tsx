"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { merchantFormSchema, merchantRuleFormSchema } from "@/lib/validation";
import { Merchant } from "@prisma/client";
import { CategoriesWithSub, CategorySelection, MerchantFormProps, UnassignedDescription } from "@/app/types";
import { useEffect, useState } from "react";
// import { SelectWithClear } from "./ui/select-with-clear";
import { MultiInput } from "./ui/multi-input";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { error } from "console";

interface ComponentProps {
	unassignedDescription: UnassignedDescription;
	merchants: Merchant[];
	categories: CategoriesWithSub[];
	onSubmit: (data: MerchantFormProps) => void;
	onCancel: () => void;
	isFormOpen: boolean;
	merchantToFormValues: (merchant: Merchant) => MerchantFormProps;
}

export default function MerchantRuleForm({
	unassignedDescription,
	merchants,
	categories,
	onSubmit,
	onCancel,
	isFormOpen,
	merchantToFormValues
}: ComponentProps) {
	const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
	const [createRuleMerchantPopoverOpen, setCreateRuleMerchantPopoverOpen] = useState(false);
	const [ruleFormMode, setRuleFormMode] = useState<string>("update");
	const [showAddMerchant, setShowAddMerchant] = useState(false);
	const [newMerchantName, setNewMerchantName] = useState("");
	const [merchantError, setMerchantError] = useState<string | null>(null);

	// const [validationSchema, setValidationSchema] = useState(merchantFormSchema(merchants, undefined));

	const form = useForm<MerchantFormProps>({
		resolver: zodResolver(merchantRuleFormSchema),
		defaultValues: {
			name: "",
			includes: [unassignedDescription["description"]],
			categorySelection: null
		}
	});

	const merchantName = form.watch("name");

	useEffect(() => {
		const merchant = merchants.find((m) => m.name == merchantName);

		if (merchant) {
			console.log("selected a merchant");
			// const updatedSchema = merchantFormSchema(merchants, merchant.id);
			// setValidationSchema(updatedSchema);

			const formValues = merchantToFormValues(merchant);

			form.setValue("includes", [unassignedDescription.description, ...formValues.includes]);
			form.setValue("categorySelection", formValues.categorySelection);

			// form.trigger("name");
		} else {
			console.log("cleared");
		}
	}, [merchantName, merchants, merchantToFormValues, unassignedDescription, form, showAddMerchant]);

	const handleFormSubmit = (data: MerchantFormProps) => {
		if (merchantError) {
			console.log("errors are not resolved yet");
			return;
		}

		console.log(data);
		onSubmit(data);
	};

	const getCategorySelectOptions = (): CategorySelection[] => {
		const options: CategorySelection[] = [];

		categories.forEach((category) => {
			options.push({
				type: "category",
				id: category.id,
				name: category.name
			});

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

	const handleCreateNewMerchant = (name: string) => {
		if (!name.trim()) return;

		// Check if merchant already exists
		const merchantExists = merchants.some((merchant) => merchant.name.toLowerCase() === name.trim().toLowerCase());

		if (merchantExists) {
			setMerchantError(`"${name}" already exists. Please select from the dropdown.`);
			return;
		}

		setMerchantError(null);
		form.setValue("name", name);
		form.trigger("name");
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
				<DialogTitle>{ruleFormMode == "create" ? "Create Merchant" : "Update Merchant"}</DialogTitle>
				{/* <DialogDescription>agasdasda asdasd</DialogDescription> */}
				<DialogDescription>
					{ruleFormMode == "create"
						? "Add a new merchant with this tag."
						: "Add this tag to an existing merchant."}
				</DialogDescription>
			</DialogHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleFormSubmit)}
					className="space-y-6"
					// onKeyDown={preventEnterKeySubmission}
				>
					{/* Merchant Name Field */}
					{/* <FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Merchant Name</FormLabel>
								<div className="flex flex-col space-y-2">
									{!showAddMerchant ? (
										<Popover
											open={createRuleMerchantPopoverOpen}
											modal={true}
											onOpenChange={setCreateRuleMerchantPopoverOpen}
										>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-full justify-between",
															!field.value && "text-muted-foreground"
															// inputStyles.button
														)}
													>
														{field.value || "Select merchant"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[300px] p-0">
												<Command>
													<CommandInput
														placeholder="Search merchant..."
														className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
													/>
													<CommandList>
														<CommandEmpty>
															<div className="px-2 py-3 text-sm">
																<p>No merchant found.</p>
																<Button
																	variant="link"
																	className="p-0 h-auto text-blue-500"
																	onClick={() => {
																		setShowAddMerchant(true);
																		setCreateRuleMerchantPopoverOpen(false);
																	}}
																>
																	<Plus className="mr-2 h-4 w-4" />
																	Add new merchant
																</Button>
															</div>
														</CommandEmpty>
														<div className="border-t px-2 py-2">
															<Button
																variant="ghost"
																className="w-full justify-start text-sm"
																onClick={() => {
																	setShowAddMerchant(true);
																	setCreateRuleMerchantPopoverOpen(false);
																}}
															>
																<Plus className="mr-2 h-4 w-4" />
																Add new merchant
															</Button>
														</div>
														<CommandGroup>
															{merchants.map((merchant, index) => (
																<CommandItem
																	key={index}
																	value={merchant.name}
																	onSelect={() => {
																		// handleSelectExistingMerchant(merchantName);
																		setCreateRuleMerchantPopoverOpen(false);
																	}}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			field.value === merchant.name
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	{merchant.name}
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
									) : (
										<div className="flex gap-2">
											<Input
												placeholder="Enter new merchant name"
												value={newMerchantName}
												onChange={(e) => setNewMerchantName(e.target.value)}
												className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
											/>
											<Button
												type="button"
												onClick={() => {
													if (newMerchantName.trim()) {
														// Check if merchant name already exists
														if (
															merchants.some(
																(m) =>
																	m.name.toLowerCase() ===
																	newMerchantName.trim().toLowerCase()
															)
														) {
															createRuleForm.setError("name", {
																type: "manual",
																message: "A merchant with this name already exists"
															});
															return;
														}
														createRuleForm.setValue("name", newMerchantName.trim());
														createRuleForm.clearErrors("name");
														setCreateRuleMode("create"); // Set mode to create for new merchant
														setShowNewMerchantInput(false);
														setNewMerchantName("");
													}
												}}
											>
												Add
											</Button>
											<Button
												type="button"
												variant="outline"
												className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
												onClick={() => {
													setShowNewMerchantInput(false);
													setNewMerchantName("");
												}}
											>
												Cancel
											</Button>
										</div>
									)}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/> */}

					<FormField
						control={form.control}
						name="name"
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
													open={createRuleMerchantPopoverOpen}
													onOpenChange={setCreateRuleMerchantPopoverOpen}
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
															setCreateRuleMerchantPopoverOpen(false);
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

																				setRuleFormMode("update");
																				setCreateRuleMerchantPopoverOpen(false);
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

															form.setValue("includes", [
																unassignedDescription.description
															]);
															form.setValue("categorySelection", null);

															form.clearErrors("name");
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
											onClick={() => {
												setShowAddMerchant(true);
												setRuleFormMode("create");
											}}
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* If Includes Field */}
					<FormField
						control={form.control}
						name="includes"
						render={({ field }) => (
							<FormItem>
								<FormLabel>If Includes</FormLabel>
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

					{/* <FormField
						control={form.control}
						name="categorySelection"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Category / Subcategory</FormLabel>
								<Popover modal={true} open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
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
																<span className="font-medium">{option.name}</span>
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
								<FormMessage />
							</FormItem>
						)}
					/> */}

					<div className="flex justify-end space-x-2">
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit">{ruleFormMode === "create" ? "Create" : "Update"}</Button>
					</div>
				</form>
			</Form>
		</DialogContent>
	);
}
