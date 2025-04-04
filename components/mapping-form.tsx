"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, ArrowRight, Asterisk } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mappingFormSchema } from "@/lib/validation";
import { Mapping } from "@prisma/client";
import { MappingFormProps } from "@/app/types";
import { useEffect } from "react";
import { SelectWithClear } from "./ui/select-with-clear";
import { fieldOptions } from "@/lib/constants";

interface ComponentProps {
	defaultValues: MappingFormProps;
	onSubmit: (data: MappingFormProps) => void;
	onCancel: () => void;
	title: string;
	description: string;
	submitButtonText: string;
	existingMappings?: Mapping[];
	currentMappingId?: number;
	isFormOpen: boolean;
}

export default function MappingForm({
	defaultValues,
	onSubmit,
	onCancel,
	title,
	description,
	submitButtonText,
	existingMappings = [],
	currentMappingId,
	isFormOpen
}: ComponentProps) {
	const formSchema = mappingFormSchema(existingMappings, currentMappingId);

	console.log("default value: ", defaultValues);

	const form = useForm<MappingFormProps>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: "onSubmit"
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "columnFieldMapping"
	});

	// const isAmount = form.watch("columnFieldMapping").some((field) => field.fieldName == "Account");
	const formErrors = form.formState.errors;

	const handleColumnCountChange = (value: string) => {
		const count = parseInt(value);
		form.setValue("columnCount", count);

		if (count > fields.length) {
			// Add new empty mappings
			for (let i = fields.length; i < count; i++) {
				append({
					columnIndex: i,
					fieldName: ""
				});
			}
		} else if (count < fields.length) {
			// Remove excess mappings
			for (let i = fields.length - 1; i >= count; i--) {
				remove(i);
			}
		}
	};

	// const getAvailableFieldOptions = (columnIndex: number) => {
	// 	return [...fieldOptions];
	// };

	const getColumnMappingErrors = () => {
		console.log("CHECKING FIELD ERRORS--------------");
		console.log(formErrors);

		const errors: string[] = [];

		if (formErrors.columnFieldMapping) {
			if (typeof formErrors.columnFieldMapping.root?.message === "string") {
				errors.push(formErrors.columnFieldMapping.root.message);
			}
		}

		return errors;
	};

	// Call onSubmit and reset form when the form is submitted
	const handleFormSubmit = (data: MappingFormProps) => {
		onSubmit(data);
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
							name="mappingName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mapping Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter a name for this mapping" {...field} />
									</FormControl>
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
										<Input placeholder="Enter account name e.g. CIBC" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="includesHeader"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
									<FormLabel>Headers in first row?</FormLabel>
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="columnCount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Number of Columns</FormLabel>
									<Select
										value={field.value.toString()}
										onValueChange={(value) => {
											field.onChange(Number.parseInt(value, 10));
											handleColumnCountChange(value);
										}}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select number of columns" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
												<SelectItem key={num} value={num.toString()}>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-1">
							<FormLabel>Column Mappings</FormLabel>
							<FormDescription>
								- Each column must map to a unique field or leave unassigned.
								<br /> - Mapping to the Date, Description, and Amount fields (or both Credit and Debit)
								is required.
								<br /> - Description field should contain merchant information.
							</FormDescription>
							<div className="space-y-3 py-1">
								{fields.map((field, index) => (
									<FormField
										key={field.id}
										control={form.control}
										name={`columnFieldMapping.${index}.fieldName`}
										render={({ field: formField }) => (
											<FormItem className="grid grid-cols-4 items-center gap-4">
												<FormLabel className="text-right">Column {index + 1}</FormLabel>
												<FormControl>
													<div className="col-span-3">
														<SelectWithClear
															value={formField.value}
															onChange={formField.onChange}
															// options={getAvailableFieldOptions(index)}
															options={fieldOptions.map((item) => ({
																id: item,
																value: item
															}))}
															placeholder="Select field"
															// index={index}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								))}
							</div>
							{/* 
							<Alert>
								<Asterisk className="h-4 w-4" />
								<AlertTitle>Each column must map to a unique field or leave unassigned</AlertTitle>
								<AlertDescription>
									Mapping to the Date, Description, and Amount fields (or both Credit and Debit) is
									required.
								</AlertDescription>
							</Alert> */}
						</div>

						{form.watch("columnFieldMapping").some((field) => field.fieldName == "Amount") && (
							<FormField
								control={form.control}
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

						{formErrors.columnFieldMapping && formErrors.columnFieldMapping.root && (
							<Alert variant="destructive" className="flex align-middle">
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
