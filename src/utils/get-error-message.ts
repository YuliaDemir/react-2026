import type { AppError } from "@/types";
import { ErrorHandler } from "@/utils/error-handler";

export const getErrorMessage = (error: AppError): string => {
    if (!error) {
        return "";
    }

    if (error instanceof ErrorHandler) {
        return error.getErrorMessageByStatus();
    }

    if ("status" in error) {
        if ("data" in error && typeof error.data === "string") {
            return error.data;
        }

        if ("error" in error && typeof error.error === "string") {
            return error.error;
        }

        return `Request failed with status ${error.status}`;
    }

    return error.message ?? "Unknown error";
};