"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Upload, X } from "lucide-react";
import { Mapping, Transaction } from "@prisma/client";
import {
	ColumnFieldMappingProps,
	CreateMappingProps,
	CreateTransactionProps,
	ImportFormProps,
	MappingFormWithFilePreviewProps
} from "@/app/types";
import { importFormSchema, mappingFormSchemaWithFilePreview } from "@/lib/validation";
import { useCreateMapping, useGetMappings } from "@/lib/react-query/mappings.queries";
import { Spinner } from "../ui/spinner";
import { SelectWithClear } from "../ui/select-with-clear";
import { cn, parseFile, truncateText } from "@/lib/utils";
import { fieldOptions } from "@/lib/constants";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Sample mappings for demo
// const sampleMappings: Mapping[] = [
// 	{
// 		id: "1",
// 		name: "Bank CSV Format",
// 		includesHeader: true,
// 		columnMappings: [
// 			{ columnIndex: 0, fieldName: "Date" },
// 			{ columnIndex: 1, fieldName: "Description" },
// 			{ columnIndex: 2, fieldName: "Merchant" },
// 			{ columnIndex: 3, fieldName: "Amount" }
// 		]
// 	},
// 	{
// 		id: "2",
// 		name: "Credit Card Statement",
// 		includesHeader: true,
// 		columnMappings: [
// 			{ columnIndex: 0, fieldName: "Date" },
// 			{ columnIndex: 1, fieldName: "Merchant" },
// 			{ columnIndex: 2, fieldName: "Amount" },
// 			{ columnIndex: 3, fieldName: "Category" }
// 		]
// 	},
// 	{
// 		id: "3",
// 		name: "Expense Tracker",
// 		includesHeader: false,
// 		columnMappings: [
// 			{ columnIndex: 0, fieldName: "Date" },
// 			{ columnIndex: 1, fieldName: "Account Name" },
// 			{ columnIndex: 2, fieldName: "Merchant" },
// 			{ columnIndex: 3, fieldName: "Amount" },
// 			{ columnIndex: 4, fieldName: "Category" },
// 			{ columnIndex: 5, fieldName: "Subcategory" }
// 		]
// 	}
// ];

// Define the form schema with Zod
// const importFormSchema = z.object({
// 	file: z.instanceof(File, { message: "Please select a file to import" }),
// 	accountName: z.string().optional(),
// 	mappingId: z.string().optional(),
// 	includesHeader: z.boolean().default(true)
// });

// type ImportFormValues = z.infer<typeof importFormSchema>;

// Define the column mapping schema for the second step
// const columnMappingSchema = z.object({
// 	mappingName: z.string().min(1, "Mapping name is required"),
// 	accountName: z.string().optional(),
// 	includesHeader: z.boolean().default(true),
// 	columnMappings: z.array(
// 		z.object({
// 			columnIndex: z.number(),
// 			fieldName: z.string().optional()
// 		})
// 	)
// });

// type ColumnMappingFormValues = z.infer<typeof columnMappingSchema>;

interface ImportTransactionsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onImport: (transactions: CreateTransactionProps[]) => void;
}

export function ImportTransactionsModal({ open, onOpenChange, onImport }: ImportTransactionsModalProps) {
	const [step, setStep] = useState<1 | 2>(1);
	const [fileData, setFileData] = useState<string[][]>([]);
	const [importFormData, setImportFormData] = useState<ImportFormProps | null>(null);
	const { data: mappingsResponse, isLoading: isLoading, isError: isError } = useGetMappings();
	const mappings = (mappingsResponse?.data as Mapping[]) || [];

	const createMappingMutation = useCreateMapping();

	// Initialize the form with React Hook Form
	const form = useForm<ImportFormProps>({
		resolver: zodResolver(importFormSchema),
		defaultValues: {
			accountName: "",
			includesHeader: true,
			mappingId: undefined
		}
	});

	const formSchema = mappingFormSchemaWithFilePreview(mappings);

	// Initialize the column mapping form
	const columnMappingForm = useForm<MappingFormWithFilePreviewProps>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mappingName: "",
			accountName: "",
			includesHeader: true,
			negativeAmountMeans: "",
			columnFieldMapping: []
		}
	});

	const columnMappingFormErrors = columnMappingForm.formState.errors;

	// Handle file selection and parsing
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		form.setValue("file", file, { shouldValidate: true });

		try {
			const parsedData = await parseFile(file);
			setFileData(parsedData);
			console.log("Parsed Data:", parsedData);
		} catch (err) {
			console.error("Failed to parse file:", err);
		}

		// Parse CSV file
		// const reader = new FileReader();
		// reader.onload = (event) => {
		// 	const text = event.target?.result as string;
		// 	const rows = text.split("\n").map((row) => row.split(",").map((cell) => cell.trim().replace(/['"]/g, "")));
		// 	console.log("Uploaded Data: ");
		// 	console.log(rows);
		// 	setFileData(rows.filter((row) => row.some((cell) => cell !== "")));
		// };
		// reader.readAsText(file);
	};

	// Handle form submission for step 1
	const onSubmitStep1 = (data: ImportFormProps) => {
		console.log(data);
		setImportFormData(data);

		// If a mapping was selected, process the data directly
		if (data.mappingId) {
			const selectedMapping = mappings.find((m) => m.id === parseInt(data.mappingId as string));
			if (selectedMapping) {
				console.log(selectedMapping);
				processDataWithMapping(
					{ includesHeader: data.includesHeader, accountName: data.accountName },
					selectedMapping
				);
				return;
			}
		}

		// If no mapping was selected, go to step 2 for manual column mapping
		// Initialize empty column mappings based on the file data
		const columnCount = fileData[0]?.length || 0;
		const initialMappings = Array.from({ length: columnCount }, (_, i) => ({
			columnIndex: i,
			fieldName: ""
		}));
		columnMappingForm.reset({
			mappingName: "",
			accountName: data.accountName || "",
			includesHeader: data.includesHeader,
			columnFieldMapping: initialMappings
		});

		setStep(2);
	};

	// Process data using a selected mapping
	const processDataWithMapping = (formData: { includesHeader: boolean; accountName: string }, mapping: Mapping) => {
		// return;
		if (!fileData.length) return;

		// Process the data based on the mapping
		const startRow = formData.includesHeader || mapping.includesHeader ? 1 : 0;
		const transactions: CreateTransactionProps[] = [];

		const columnFieldMapping = mapping.columnFieldMapping as ColumnFieldMappingProps[];

		if (columnFieldMapping.length != fileData[startRow].length) {
			console.log("Mapping columns: ", columnFieldMapping.length);
			console.log("Filedata columns: ", fileData[startRow].length);

			toast.error("Number of columns does not match between the uploaded file and the selected mapping.");
			return;
		}

		for (let i = startRow; i < fileData.length; i++) {
			const row = fileData[i];
			if (!row.length) continue;

			const transaction: Partial<CreateTransactionProps> = {
				accountName: formData.accountName || mapping.accountName || ""
			};

			// Map each column to the corresponding field
			columnFieldMapping.forEach((columnMapping) => {
				if (columnMapping.fieldName) {
					const value = row[columnMapping.columnIndex];
					switch (columnMapping.fieldName) {
						case "Date":
							transaction.date = new Date(value);
							break;
						case "Description":
							transaction.description = value;
							break;
						case "Amount":
							const amount = Number.parseFloat(value.replace(/[^0-9.-]+/g, ""));
							transaction.amount = mapping.negativeAmountMeans != "Debit" ? -amount : amount;
							break;
						case "Credit":
							transaction.amount = Number.parseFloat(value.replace(/[^0-9.]+/g, ""));
							break;
						case "Debit":
							transaction.amount = -Number.parseFloat(value.replace(/[^0-9.]+/g, ""));
							break;
					}
				}
			});

			transactions.push({
				date: transaction.date!,
				accountName: transaction.accountName!,
				merchant: "",
				description: transaction.description!,
				categoryId: null,
				subcategoryId: null,
				amount: transaction.amount!
			});
		}

		onImport(transactions);
		resetModal();
	};

	// Handle form submission for step 2
	const onSubmitStep2 = async (formData: MappingFormWithFilePreviewProps) => {
		if (!importFormData || !fileData.length) return;

		console.log(formData);

		const newMapping: CreateMappingProps = {
			...formData
		};

		try {
			toast.info("Importing data...");

			const response = await createMappingMutation.mutateAsync(newMapping);
			console.log(response);

			if (response?.success) {
				processDataWithMapping(
					{ includesHeader: formData.includesHeader, accountName: formData.accountName },
					response?.data as Mapping
				);
			} else {
				toast.error(response?.data as string);
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong!");
		}
	};

	// Reset the modal state
	const resetModal = () => {
		setStep(1);
		setFileData([]);
		setImportFormData(null);
		form.reset();
		columnMappingForm.reset();
	};

	// Handle modal close
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			resetModal();
		}
		onOpenChange(open);
	};

	const getColumnMappingErrors = () => {
		console.log("CHECKING FIELD ERRORS--------------");
		console.log(columnMappingFormErrors);

		const errors: string[] = [];

		if (columnMappingFormErrors.columnFieldMapping) {
			if (typeof columnMappingFormErrors.columnFieldMapping.root?.message === "string") {
				errors.push(columnMappingFormErrors.columnFieldMapping.root.message);
			}
		}

		return errors;
	};

	const isErrorResponse = isError || (mappingsResponse ? !mappingsResponse.success : false);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				className={cn(
					"w-11/12 max-w-11/12 max-h-11/12 lg:max-w-4xl sm:max-h-11/12 overflow-y-auto",
					step == 2 && "lg:max-w-7xl"
				)}
			>
				<DialogHeader>
					<DialogTitle>Import Transactions</DialogTitle>
					<DialogDescription>
						{step === 1
							? "Upload a CSV or Excel file containing your transactions."
							: "Map the columns in your file to transaction fields."}
					</DialogDescription>
				</DialogHeader>

				{isErrorResponse && <p>Something bad happened.</p>}
				{isLoading && <Spinner size="large" />}

				{step === 1 && !isErrorResponse && !isLoading && (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmitStep1)} className="space-y-6 overflow-hidden">
							<FormField
								control={form.control}
								name="file"
								render={({ field: { value, onChange, ...fieldProps } }) => (
									<FormItem>
										<FormLabel>File*</FormLabel>
										<FormControl>
											<div className="flex items-center gap-2">
												<Input
													type="file"
													accept=".csv,.xlsx,.xls"
													onChange={handleFileChange}
													className="flex-1 cursor-pointer"
													{...fieldProps}
												/>
												{/* <Button
													type="button"
													variant="outline"
													size="icon"
													onClick={() => document.getElementById("file-upload")?.click()}
												>
													<Upload className="h-4 w-4" />
												</Button> */}
												{/* <input
													id="file-upload"
													type="file"
													accept=".csv,.xlsx,.xls"
													className="hidden"
													onChange={handleFileChange}
												/> */}
											</div>
										</FormControl>
										{/* <FormDescription>
											Select a CSV or Excel file containing your transaction data.
										</FormDescription> */}
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
											<Input placeholder="Enter account name. e.g. CIBC Savings" {...field} />
										</FormControl>
										{/* <FormDescription>
											Enter the account name for these transactions.
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="mappingId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mapping Name</FormLabel>
										<SelectWithClear
											value={field.value ? field.value.toString() : ""}
											onChange={field.onChange}
											options={mappings.map((m) => ({
												id: m.id.toString(),
												value: m.mappingName
											}))}
											placeholder="Select a mapping"
										/>
										{/* <FormDescription>
											Select a predefined mapping for your file format.
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="includesHeader"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Includes Header Row</FormLabel>
											<FormDescription>
												Check this if the first row of your file contains column headers.
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							<div className="overflow-x-auto">
								{fileData.length > 0 && (
									<div className="space-y-2">
										<Label>File Preview</Label>
										<div className="rounded-md border">
											<Table>
												<TableHeader>
													<TableRow>
														{fileData[0].map((_, i) => (
															<TableHead key={i} className="text-center min-w-[120px]">
																Column {i + 1}
															</TableHead>
														))}
													</TableRow>
												</TableHeader>
												<TableBody>
													{fileData.slice(0, 5).map((row, i) => (
														<TableRow
															key={i}
															className={
																i === 0 && form.watch("includesHeader")
																	? "bg-muted font-medium"
																	: ""
															}
														>
															{row.map((cell, j) => (
																<TableCell
																	key={j}
																	className="text-center min-w-[120px]"
																>
																	{truncateText(cell)}
																</TableCell>
															))}
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</div>
								)}
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
									Cancel
								</Button>
								<Button type="submit">{form.watch("mappingId") ? "Import" : "Next"}</Button>
							</DialogFooter>
						</form>
					</Form>
				)}

				{step === 2 && !isErrorResponse && !isLoading && (
					<Form {...columnMappingForm}>
						<form
							onSubmit={columnMappingForm.handleSubmit(onSubmitStep2)}
							className="space-y-6 overflow-hidden"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={columnMappingForm.control}
									name="mappingName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mapping Name*</FormLabel>
											<FormControl>
												<Input placeholder="Enter a name for this mapping" {...field} />
											</FormControl>
											{/* <FormDescription>Give your mapping a descriptive name.</FormDescription> */}
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={columnMappingForm.control}
									name="accountName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Account Name*</FormLabel>
											<FormControl>
												<Input placeholder="Enter account name. e.g. CIBC Savings" {...field} />
											</FormControl>
											{/* <FormDescription>
												Enter the account name for these transactions.
											</FormDescription> */}
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={columnMappingForm.control}
								name="includesHeader"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<div className="space-y-1 leading-none">
											<FormLabel htmlFor="step2-includes-header" className="cursor-pointer">
												Headers in first row?
											</FormLabel>
											{/* <FormDescription>
												Check this if the first row of your file contains column headers.
											</FormDescription> */}
										</div>
										<FormControl>
											<Checkbox
												id="step2-includes-header"
												checked={field.value}
												onCheckedChange={(value) => {
													field.onChange(value === true);
												}}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<div className="space-y-4">
								<div className="space-y-1">
									<FormLabel>Column Mappings*</FormLabel>
									<FormDescription>
										- Each column must map to a unique field or leave unassigned.
										<br /> - Mapping to the Date, Description, and Amount fields (or both Credit and
										Debit) is required.
										<br /> - Description field should contain merchant information.
									</FormDescription>
								</div>

								<div className="overflow-x-auto">
									{fileData.length > 0 && (
										<div className="space-y-2">
											<div className="rounded-md border">
												<Table>
													<TableHeader>
														<TableRow>
															{fileData[0].map((_, i) => (
																<TableHead
																	key={i}
																	className="text-center min-w-[120px]"
																>
																	Column {i + 1}
																</TableHead>
															))}
														</TableRow>
													</TableHeader>
													<TableBody>
														{fileData.slice(0, 5).map((row, i) => (
															<TableRow
																key={i}
																className={
																	i === 0 && form.watch("includesHeader")
																		? "bg-muted font-medium"
																		: ""
																}
															>
																{row.map((cell, j) => (
																	<TableCell
																		key={j}
																		className="text-center min-w-[120px]"
																	>
																		{truncateText(cell)}
																	</TableCell>
																))}
															</TableRow>
														))}

														{/* Field mapping row */}
														<TableRow className="bg-muted/50 border-t-2">
															{columnMappingForm
																.watch("columnFieldMapping")
																.map((mapping, index) => (
																	<TableCell key={index} className="p-2">
																		<FormField
																			control={columnMappingForm.control}
																			name={`columnFieldMapping.${index}.fieldName`}
																			render={({ field }) => (
																				<FormItem className="space-y-1">
																					<SelectWithClear
																						value={
																							field.value
																								? field.value.toString()
																								: ""
																						}
																						onChange={field.onChange}
																						options={fieldOptions.map(
																							(item) => ({
																								id: item,
																								value: item
																							})
																						)}
																						placeholder="Select field"
																					/>
																					<FormMessage />
																				</FormItem>
																			)}
																		/>
																	</TableCell>
																))}
														</TableRow>
													</TableBody>
												</Table>
											</div>
										</div>
									)}
								</div>
							</div>

							{columnMappingForm
								.watch("columnFieldMapping")
								.some((field) => field.fieldName == "Amount") && (
								<FormField
									control={columnMappingForm.control}
									name="negativeAmountMeans"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Interpret Negative (-) Amount As*</FormLabel>
											<SelectWithClear
												value={field.value ? field.value.toString() : ""}
												onChange={field.onChange}
												options={["Debit", "Credit"].map((m) => ({
													id: m,
													value: m
												}))}
												placeholder="Select a type"
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{columnMappingFormErrors.columnFieldMapping &&
								columnMappingFormErrors.columnFieldMapping.root && (
									<Alert variant="destructive" className="mt-4 flex align-middle">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>
											<ul className="list-none">
												{getColumnMappingErrors().map((error, index) => (
													<li key={index}>{error}</li>
												))}
											</ul>
										</AlertDescription>
									</Alert>
								)}

							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setStep(1)}>
									Back
								</Button>
								<Button type="submit">Import Transactions</Button>
							</DialogFooter>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
}
