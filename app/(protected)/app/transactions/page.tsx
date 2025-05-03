"use client";

import type React from "react";
import Transactions from "@/components/transactions/transactions";
import { useGetTransactionsWithRelations } from "@/lib/react-query/transactions.queries";
import { TransactionWithRelations } from "@/app/types";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
	const {
		data: transactionsResponse,
		isLoading: isLoadingTransactions,
		isError: isErrorTransactions
	} = useGetTransactionsWithRelations();

	if (isErrorTransactions)
		return (
			<div>
				<p>Something bad happened</p>
			</div>
		);

	if (isLoadingTransactions)
		return (
			<div className="size-full -mt-20 min-h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);

	if (!transactionsResponse?.success) {
		return (
			<div>
				<p>{`${transactionsResponse?.statusCode}: ${transactionsResponse?.data}`}</p>
			</div>
		);
	}

	const transactions = (transactionsResponse.data as TransactionWithRelations[]) || [];

	return <Transactions transactions={transactions} />;
}
