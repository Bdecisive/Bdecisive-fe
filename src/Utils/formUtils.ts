// utils/formUtils.ts
import { UseFormSetError } from "react-hook-form";
import { toast } from "react-toastify";

// Define the basic error structure from server
export interface ValidationError {
    message: string;
    status: string;
    timestamp: string;
    errors: {
        [key: string]: string;
    };
}

export type FieldMapping<T> = {
    [serverField: string]: keyof T;
};

// Define validation options type
export interface ValidationOptions {
    showToast?: boolean;
    toastMessage?: string;
    logError?: boolean;
}

export const handleServerErrors = <T extends object>(
    error: any,
    setError: UseFormSetError<T>,
    fieldMapping: FieldMapping<T>,
    options: ValidationOptions = {}
) => {
    const {
        showToast = true,
        toastMessage = 'Validation failed',
        logError = true
    } = options;

    if (error.response?.data?.errors) {
        const validationErrors = error.response.data as ValidationError;

        // Handle field-specific errors
        Object.entries(validationErrors.errors).forEach(([serverField, errorMessage]) => {
            const formField = fieldMapping[serverField];
            if (formField) {
                setError(formField as any, {
                    type: 'server',
                    message: errorMessage
                });
            }
        });

        // Show toast if enabled
        if (showToast) {
            toast.error(toastMessage);
        }

        // Log error if enabled
        if (logError) {
            console.error('Validation errors:', validationErrors.errors);
        }

        return true;
    }
    return false;
};