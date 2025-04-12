"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { transactionFormSchema } from "@/lib/validation";
import { TransactionFormProps } from "@/app/types";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";

interface ComponentProps {
	defaultValues: TransactionFormProps;
	onSubmit: (data: TransactionFormProps) => void;
	onCancel: () => void;
	title: string;
	description: string;
	submitButtonText: string;
	isFormOpen: boolean;
}

export default function TransactionForm({
	defaultValues,
	onSubmit,
	onCancel,
	title,
	description,
	submitButtonText,
	isFormOpen
}: ComponentProps) {
	const [dateOpen, setDateOpen] = useState(false);

	const form = useForm<TransactionFormProps>({
		resolver: zodResolver(transactionFormSchema),
		defaultValues
	});

	const handleFormSubmit = (data: TransactionFormProps) => {
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
									<FormLabel>
										Amount*
										<FormDescription className="font-normal">
											(Enter a postive (+) number for credit and a negative (-) number for debit.)
										</FormDescription>
									</FormLabel>

									<FormControl>
										<Input placeholder="0.00" {...field} type="number" step="1" className="h-10" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="merchant"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Merchant</FormLabel>
									<FormControl>
										<Input placeholder="Enter a merchant name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Input placeholder="Enter a category" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="subcategory"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Subcategory</FormLabel>
									<FormControl>
										<Input placeholder="Enter a subcategory" {...field} />
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
						<Button type="submit">{submitButtonText}</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
}
