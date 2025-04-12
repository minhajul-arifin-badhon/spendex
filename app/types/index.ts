import {
	createTransactionSchema,
	deleteTransactionSchema,
	transactionFormSchema,
	updateTransactionSchema
} from "@/lib/validation";
import { z } from "zod";

export type BaseResponse = {
	success: boolean;
	statusCode: number;
};

export type SuccessResponse<T> = BaseResponse & {
	data: T;
};

export type ErrorResponse = BaseResponse & {
	data: string;
};

export type Response<T> = SuccessResponse<T> | ErrorResponse;
export type TransactionFormProps = z.infer<typeof transactionFormSchema>;

// props needed when calling actions
export type CreateTransactionProps = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionProps = z.infer<typeof updateTransactionSchema>;
export type DeleteTransactionProps = z.infer<typeof deleteTransactionSchema>;
